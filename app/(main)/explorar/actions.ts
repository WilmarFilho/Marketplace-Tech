"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProducts(searchParams?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("products")
    .select(`
      *,
      seller:profiles!seller_id (
        full_name,
        avatar_url
      ),
      tags:products_tags(
        tag:tags(
          name
        )
      )
    `)
    .eq("status", "aprovado");

  // Filtros
  if (searchParams?.search) {
    query = query.ilike("title", `%${searchParams.search}%`);
  }

  if (searchParams?.category && searchParams.category !== 'all') {
    query = query.ilike("category", `%${searchParams.category}%`);
  }

  if (searchParams?.minPrice) {
    query = query.gte("price", searchParams.minPrice);
  }

  if (searchParams?.maxPrice) {
    query = query.lte("price", searchParams.maxPrice);
  }

  // Ordenação
  switch (searchParams?.sortBy) {
    case 'oldest':
      query = query.order("created_at", { ascending: true });
      break;
    case 'price_asc':
      query = query.order("price", { ascending: true });
      break;
    case 'price_desc':
      query = query.order("price", { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: products } = await query;

  // Transformar os dados para o formato esperado
  const transformedProducts = products?.map(product => ({
    ...product,
    tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
  }));

  return transformedProducts;
}

export async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return categories;
}
