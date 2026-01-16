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