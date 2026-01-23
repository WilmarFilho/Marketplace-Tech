-- Cria índice na coluna id da tabela profiles para acelerar buscas por id
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles (id);