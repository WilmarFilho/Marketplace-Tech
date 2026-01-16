-- Políticas RLS para a tabela messages
-- Execute estas queries no Supabase SQL Editor se necessário

-- Habilitar RLS na tabela messages (se não estiver habilitado)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir que vendedores vejam suas próprias mensagens
CREATE POLICY "Vendors can view their own messages" ON messages
FOR SELECT USING (auth.uid()::text = vendor_id);

-- Política para permitir que vendedores atualizem suas próprias mensagens (marcar como lida)
CREATE POLICY "Vendors can update their own messages" ON messages
FOR UPDATE USING (auth.uid()::text = vendor_id)
WITH CHECK (auth.uid()::text = vendor_id);

-- Política para permitir inserção de mensagens (para quando usuários enviam mensagens)
CREATE POLICY "Anyone can insert messages" ON messages
FOR INSERT WITH CHECK (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'messages';