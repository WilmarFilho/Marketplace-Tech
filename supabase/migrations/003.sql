

-- Permitir que admin veja todos os produtos
CREATE POLICY "Admins can view all products" ON products
FOR SELECT USING (
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  OR (seller_id = auth.uid())
  OR (status = 'aprovado')
);


-- Permitir que admin atualize qualquer produto
CREATE POLICY "Admins can update all products" ON products
FOR UPDATE USING (
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  OR (seller_id = auth.uid())
);


-- Cria índice na coluna id da tabela profiles para acelerar buscas por id
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles (id);
