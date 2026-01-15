"use server";

import { createClient } from "@/lib/supabase/server";

export interface FilterParams {
  search?: string;
  tags?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  location?: string;
  city?: string;
  state?: string;
  dateFilter?: string;
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export async function getProducts(filters: FilterParams = {}): Promise<PaginatedResponse<any>> {
  const supabase = await createClient();
  
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const offset = (page - 1) * limit;
  
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
    `, { count: 'exact' })
    .eq("status", "aprovado");

  // Filtro por busca (título)
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  // Filtro por tags - primeiro buscar os IDs das tags
  if (filters.tags && filters.tags.length > 0) {
    const { data: tagIds } = await supabase
      .from('tags')
      .select('id')
      .in('name', filters.tags);
      
    if (tagIds && tagIds.length > 0) {
      const { data: productIds } = await supabase
        .from('products_tags')
        .select('product_id')
        .in('tag_id', tagIds.map(tag => tag.id));
        
      if (productIds && productIds.length > 0) {
        query = query.in('id', productIds.map(p => p.product_id));
      } else {
        // Se não encontrou produtos com as tags, retornar vazio
        return {
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false
          }
        };
      }
    }
  }

  // Filtro por categorias - primeiro buscar os IDs das categorias
  if (filters.categories && filters.categories.length > 0) {
    const { data: categoryIds } = await supabase
      .from('categories')
      .select('id')
      .in('name', filters.categories);
      
    if (categoryIds && categoryIds.length > 0) {
      const { data: productIds } = await supabase
        .from('products_categories')
        .select('product_id')
        .in('category_id', categoryIds.map(cat => cat.id));
        
      if (productIds && productIds.length > 0) {
        query = query.in('id', productIds.map(p => p.product_id));
      } else {
        // Se não encontrou produtos com as categorias, retornar vazio
        return {
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false
          }
        };
      }
    }
  }

  // Filtros de preço
  if (filters.priceRange) {
    const ranges: Record<string, { min?: number; max?: number }> = {
      'Até R$ 500': { max: 500 },
      'R$ 500 - R$ 1.000': { min: 500, max: 1000 },
      'R$ 1.000 - R$ 2.500': { min: 1000, max: 2500 },
      'R$ 2.500 - R$ 5.000': { min: 2500, max: 5000 },
      'R$ 5.000 - R$ 10.000': { min: 5000, max: 10000 },
      'Acima de R$ 10.000': { min: 10000 }
    };
    
    const range = ranges[filters.priceRange];
    if (range) {
      if (range.min) query = query.gte("price", range.min);
      if (range.max) query = query.lte("price", range.max);
    }
  } else {
    // Filtros de preço customizados
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
  }

  // Filtros de localização
  if (filters.location) {
    query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
  }
  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.state) {
    query = query.ilike("state", `%${filters.state}%`);
  }

  // Filtro por data
  if (filters.dateFilter) {
    const now = new Date();
    let dateThreshold: Date;
    
    switch (filters.dateFilter) {
      case 'Última Semana':
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'Último Mês':
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'Último Trimestre':
        dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateThreshold = new Date(0);
    }
    
    query = query.gte("created_at", dateThreshold.toISOString());
  }

  // Ordenação
  switch (filters.sortBy) {
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

  // Paginação
  query = query.range(offset, offset + limit - 1);

  const { data: products, count, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false
      }
    };
  }

  // Transformar os dados para o formato esperado
  const transformedProducts = products?.map(product => ({
    ...product,
    tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
  })) || [];

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: transformedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
}

export async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return categories;
}
