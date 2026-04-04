-- ================================================
-- MIGRATION 004: Pedidos de Compra
-- ================================================
-- Executar manualmente no Supabase SQL Editor
-- ================================================

-- 1. CRIAR TABELA DE PEDIDOS DE COMPRA
CREATE TABLE public.purchase_requests (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       text NOT NULL,
  description text,
  target_price numeric, -- preço alvo (opcional)
  city        text,
  state       text,
  contact_phone text,
  status      text CHECK (status IN ('ativo', 'encerrado')) DEFAULT 'ativo',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_purchase_requests_buyer_id ON public.purchase_requests(buyer_id);
CREATE INDEX idx_purchase_requests_status   ON public.purchase_requests(status);
CREATE INDEX idx_purchase_requests_created  ON public.purchase_requests(created_at DESC);

-- 3. HABILITAR ROW LEVEL SECURITY
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO

-- Leitura pública (qualquer pessoa vê pedidos ativos)
CREATE POLICY "Pedidos de compra são públicos"
  ON public.purchase_requests
  FOR SELECT
  USING (true);

-- Apenas o comprador dono pode inserir
CREATE POLICY "Compradores criam seus pedidos"
  ON public.purchase_requests
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Apenas o dono pode atualizar os seus pedidos
CREATE POLICY "Compradores atualizam seus pedidos"
  ON public.purchase_requests
  FOR UPDATE
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

-- Apenas o dono pode deletar os seus pedidos
CREATE POLICY "Compradores deletam seus pedidos"
  ON public.purchase_requests
  FOR DELETE
  USING (auth.uid() = buyer_id);

-- 5. TRIGGER para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_requests_updated_at
  BEFORE UPDATE ON public.purchase_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
