-- 1. TABELA DE PERFIS (Extensão do Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  role text check (role in ('comprador', 'vendedor', 'admin')) default 'comprador',
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. TABELA DE ANÚNCIOS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  title text not null,
  description text,
  price numeric not null,
  images_urls text[] default '{}',
  status text check (status in ('pendente', 'aprovado', 'reprovado', 'vendido')) default 'pendente',
  seller_id uuid references public.profiles(id) on delete cascade not null,
  contact_phone text -- Caso o vendedor queira usar um telefone diferente do perfil
);

-- 3. TABELA DE FAVORITOS
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, product_id) -- Impede favoritar o mesmo item duas vezes
);

-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.favorites enable row level security;

-- 5. POLÍTICAS DE ACESSO (RLS)

-- Produtos: Qualquer um vê aprovados. Vendedores vêem os seus próprios (mesmo pendentes).
create policy "Produtos aprovados são públicos" on public.products
  for select using (status = 'aprovado');

create policy "Vendedores gerenciam seus produtos" on public.products
  for all using (auth.uid() = seller_id);

-- Favoritos: Apenas o dono vê e gerencia seus favoritos.
create policy "Usuários gerenciam próprios favoritos" on public.favorites
  for all using (auth.uid() = user_id);

-- Perfis: Público vê informações básicas. Dono edita tudo.
create policy "Perfis são públicos" on public.profiles
  for select using (true);

create policy "Usuários editam próprio perfil" on public.profiles
  for update using (auth.uid() = id);
