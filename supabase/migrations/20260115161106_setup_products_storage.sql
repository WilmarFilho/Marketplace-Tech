-- Criar bucket 'products' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their product images" ON storage.objects;
DROP POLICY IF EXISTS "Public product images are viewable by everyone" ON storage.objects;

-- Política para permitir que usuários façam upload de imagens de seus produtos
CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Política para permitir que usuários vejam suas próprias imagens de produtos
CREATE POLICY "Users can view their product images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'products' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Política para permitir que usuários atualizem suas próprias imagens de produtos
CREATE POLICY "Users can update their product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'products' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Política para permitir que usuários deletem suas próprias imagens de produtos
CREATE POLICY "Users can delete their product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Política para permitir que qualquer pessoa veja imagens de produtos (necessário para visualizar)
CREATE POLICY "Public product images are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'products');
