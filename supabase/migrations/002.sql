create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'comprador') -- Pega o role enviado ou assume comprador se vier vazio
  );
  return new;
end;
$$ language plpgsql security definer;

-- 1. ATUALIZAR TABELA PRODUCTS (Localização)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text;

-- 2. NOVAS TABELAS DE CATEGORIAS E TAGS
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELAS DE RELACIONAMENTO (Many-to-Many)
CREATE TABLE public.products_categories (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE public.products_tags (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 4. NOVA TABELA DE MENSAGENS (Leads)
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL, -- "numero" que você pediu
  message_content text NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  read boolean DEFAULT false
);

-- 5. SEGURANÇA (RLS) PARA MENSAGENS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer pessoa (mesmo deslogada) envie mensagens
CREATE POLICY "Qualquer um pode enviar mensagens" ON public.messages
  FOR INSERT WITH CHECK (true);

-- Apenas o vendedor (vendor_id) pode ver suas próprias mensagens
CREATE POLICY "Vendedores vêem suas mensagens" ON public.messages
  FOR SELECT USING (auth.uid() = vendor_id);


-- 1. CRIAR TABELA DE NEWSLETTER
CREATE TABLE public.newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE ACESSO (RLS)

-- Permitir que qualquer pessoa (mesmo deslogada) se inscreva na newsletter
CREATE POLICY "Qualquer um pode se inscrever na newsletter" ON public.newsletter
  FOR INSERT WITH CHECK (true);

-- Apenas administradores podem ver a lista de e-mails inscritos
-- (Baseado na coluna 'role' que já existe na sua tabela de perfis)
CREATE POLICY "Apenas admins podem ver inscritos" ON public.newsletter
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


  -- Habilitar RLS em todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_tags ENABLE ROW LEVEL SECURITY;

-- 1. CATEGORIES: Público lê, apenas Admin edita
CREATE POLICY "Categorias são públicas" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins gerenciam categorias" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 2. TAGS: Público lê, apenas Admin edita
CREATE POLICY "Tags são públicas" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins gerenciam tags" ON public.tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. RELATIONSHIP TABLES (products_categories e products_tags)
-- Leitura pública para permitir filtros no frontend
CREATE POLICY "Relacionamentos de categorias são públicos" ON public.products_categories
  FOR SELECT USING (true);

CREATE POLICY "Relacionamentos de tags são públicos" ON public.products_tags
  FOR SELECT USING (true);

-- Escrita: Apenas o dono do produto (vendedor) ou Admin pode associar tags/categorias
CREATE POLICY "Vendedores associam categorias aos seus produtos" ON public.products_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = products_categories.product_id 
      AND (products.seller_id = auth.uid() OR 
          (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
    )
  );

CREATE POLICY "Vendedores associam tags aos seus produtos" ON public.products_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = products_tags.product_id 
      AND (products.seller_id = auth.uid() OR 
          (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
    )
  );

  /*
  FIX para problema de RLS na tabela messages
  
  PROBLEMA: As mensagens não conseguem ser marcadas como lidas devido ao 
  Row Level Security (RLS) bloqueando updates mesmo quando o usuário é 
  o dono da mensagem.
  
  SOLUÇÃO: 
  1. Criar uma função PostgreSQL que bypassa o RLS
  2. Recriar as políticas RLS de forma mais permissiva
  3. Garantir que o update funcione corretamente
  
  COMO EXECUTAR:
  1. Abra o Supabase Dashboard
  2. Vá em SQL Editor
  3. Cole e execute este script completo
  4. Teste novamente no aplicativo
*/

-- Fix para RLS na tabela messages
-- Executar este SQL no Supabase SQL Editor

-- 1. Criar função para marcar mensagem como lida
CREATE OR REPLACE FUNCTION mark_message_read(message_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_count INTEGER;
BEGIN
    -- Verificar se o usuário é o vendedor da mensagem
    UPDATE messages 
    SET read = true, updated_at = NOW()
    WHERE id = message_id 
    AND vendor_id = user_id;
    
    GET DIAGNOSTICS result_count = ROW_COUNT;
    
    RETURN result_count > 0;
END;
$$;

-- 2. Desabilitar RLS temporariamente para update das mensagens
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 3. Recriar as políticas de forma mais permissiva
DROP POLICY IF EXISTS "Vendedores podem ver suas mensagens" ON messages;
DROP POLICY IF EXISTS "Vendedores podem atualizar suas mensagens" ON messages;

-- 4. Reabilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas mais permissivas
CREATE POLICY "Vendedores podem ver suas mensagens"
ON messages FOR SELECT
USING (vendor_id = auth.uid());

CREATE POLICY "Vendedores podem atualizar suas mensagens"
ON messages FOR UPDATE
USING (vendor_id = auth.uid())
WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Inserir mensagens para qualquer vendedor"
ON messages FOR INSERT
WITH CHECK (true);

-- 6. Grant permissions na função
GRANT EXECUTE ON FUNCTION mark_message_read(UUID, UUID) TO authenticated;