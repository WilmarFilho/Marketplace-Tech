'use client';

import { useEffect, useState, useCallback } from "react";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import { ResultsHeader } from "@/components/filters/ResultsHeader";
import { useLocalFilters } from "@/lib/hooks/useLocalFilters";
import { getFavorites } from "../../app/(main)/dashboard/favoritos/actions";
import type { Favorite } from "@/src/types/products";
import LocalFilterBar from "@/components/dashboard/LocalFilterBar";
import LocalFilters from "@/components/dashboard/LocalFilters";
import type { FilterParams } from '../../app/(main)/explorar/actions';
import { ActiveFilters } from "@/components/dashboard/ActiveFilters";

// Interface para o produto completo com campos adicionais
interface ExtendedProduct {
  id: string;
  title: string;
  price: number;
  images_urls: string[] | null;
  status: string;
  address?: string | null;
  products_categories?: Array<{ category?: { name?: string } }>;
  city?: string | null;
  contact_phone?: string | null;
  created_at?: string | null;
  description?: string | null;
  seller_id?: string;
  state?: string | null;
  tags?: Array<{ tag: { name: string } }>;
}

// Converter Favorite para ProductRow
function favoriteToProductRow(favorite: Favorite): ProductRow | null {
  const product = Array.isArray(favorite.product) ? favorite.product[0] : favorite.product;
  
  if (!product) return null;
  
  const extendedProduct = product as ExtendedProduct;
  
  return {
    id: extendedProduct.id,
    title: extendedProduct.title,
    price: extendedProduct.price,
    images_urls: extendedProduct.images_urls,
    status: extendedProduct.status,
    address: extendedProduct.address || null,
    products_categories: extendedProduct.products_categories || [],
    city: extendedProduct.city || null,
    contact_phone: extendedProduct.contact_phone || null,
    created_at: extendedProduct.created_at || null,
    description: extendedProduct.description || null,
    seller_id: extendedProduct.seller_id || '',
    state: extendedProduct.state || null,
    isFavorited: true,
    tags: extendedProduct.tags?.map((t: { tag: { name: string } }) => ({ name: t.tag.name })) || []
  } as ProductRow;
}

function FavoritesGrid({ filters }: { filters: FilterParams }) {
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar favoritos
  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const favorites = await getFavorites();
      
      if (!favorites) {
        setError('Erro de autenticação');
        return;
      }
      
      const products: ProductRow[] = favorites
        .map(favoriteToProductRow)
        .filter((product): product is ProductRow => product !== null);
      
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (err) {
      setError('Erro ao carregar favoritos');
      console.error('Erro ao buscar favoritos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros localmente
  useEffect(() => {
    if (!allProducts.length) return;

    let filtered = [...allProducts];

    // Filtro por categoria
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories?.some((cat: string) =>
          product.products_categories &&
          product.products_categories[0]?.category?.name?.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // Filtro por localização (estado ou cidade)
    if (filters.state) {
      filtered = filtered.filter(product => 
        product.state?.toLowerCase().includes(filters.state?.toLowerCase() || '')
      );
    }
    
    if (filters.city) {
      filtered = filtered.filter(product => 
        product.city?.toLowerCase().includes(filters.city?.toLowerCase() || '')
      );
    }

    // Filtro por localização genérica (se ainda existe)
    if (filters.location) {
      filtered = filtered.filter(product => 
        product.city?.toLowerCase().includes(filters.location?.toLowerCase() || '') ||
        product.state?.toLowerCase().includes(filters.location?.toLowerCase() || '')
      );
    }

    // Filtro por preço
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        filters.tags?.some((filterTag: string) => 
          product.tags?.some((productTag: { name: string }) => 
            productTag.name?.toLowerCase() === filterTag.toLowerCase()
          )
        )
      );
    }

    // Filtro por data
    if (filters.dateFilter) {
      const now = new Date();
      let filterDate: Date | null = new Date();
      
      switch (filters.dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          filterDate.setHours(0, 0, 0, 0);
          break;
        default:
          // Se o valor não for reconhecido, não filtrar por data
          filterDate = null;
      }
      
      if (filterDate) {
        filtered = filtered.filter(product => {
          const productDate = product.created_at ? new Date(product.created_at) : null;
          return productDate && productDate >= filterDate;
        });
      }
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (error) {
    return (
      <div>
        <ResultsHeader 
          total={0}
          page={1}
          limit={12}
          isLoading={false}
        />
        <div className="col-span-full text-center py-12 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResultsHeader 
        total={filteredProducts.length}
        page={1}
        limit={filteredProducts.length}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="explore-grid justify-items-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[395px] w-full max-w-[478px] bg-gray-200 animate-pulse rounded-[20px]"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-medium mb-2 text-white">
            {allProducts.length === 0 
              ? "Nenhum favorito encontrado" 
              : "Nenhum favorito corresponde aos filtros"
            }
          </h3>
          <p className="text-gray-400">
            {allProducts.length === 0 
              ? "Explore produtos e adicione seus favoritos para vê-los aqui." 
              : "Tente ajustar seus filtros para encontrar seus favoritos."
            }
          </p>
        </div>
      ) : (
        <div className="explore-grid justify-items-center gap-6">
          {filteredProducts.map((product: ProductRow) => (
            <div key={product.id} className="w-full">
              <CardAnuncio product={product} showFavoriteButton={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesContent() {
  const {
    filters,
    searchDebounce,
    updateFilters,
    updateSearch,
    toggleTag,
    toggleCategory,
    setPriceRange,
    setCustomPrice,
    clearFilters
  } = useLocalFilters();

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-[1744px] px-6 py-10 md:px-[40px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Favoritos</h1>
          <p className="text-gray-400">Gerencie seus produtos favoritos</p>
        </div>

        <LocalFilterBar 
          filters={filters}
          searchDebounce={searchDebounce}
          updateSearch={updateSearch}
          toggleTag={toggleTag}
        />
        <ActiveFilters 
          filters={filters}
          clearFilters={clearFilters}
          toggleTag={toggleTag}
          toggleCategory={toggleCategory}
          updateFilters={updateFilters}
        />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full lg:w-[380px] shrink-0">
            <LocalFilters 
              filters={{...filters, status: undefined}}
              updateFilters={updateFilters}
              toggleCategory={toggleCategory}
              setPriceRange={setPriceRange}
              setCustomPrice={setCustomPrice}
            />
          </div>

          <div className="min-w-0 flex-1">
            <FavoritesGrid filters={{...filters, status: undefined}} />
          </div>
        </div>
      </div>
    </div>
  );
}