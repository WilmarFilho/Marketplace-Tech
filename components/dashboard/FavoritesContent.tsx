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

// Converter Favorite para ProductRow
function favoriteToProductRow(favorite: Favorite): ProductRow | null {
  const product = Array.isArray(favorite.product) ? favorite.product[0] : favorite.product;
  
  if (!product) return null;
  
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    images_urls: product.images_urls,
    status: product.status,
    address: null,
    category: null,
    city: null,
    contact_phone: null,
    created_at: null,
    description: null,
    seller_id: '',
    state: null,
    isFavorited: true,
    tags: []
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
          product.category?.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // Filtro por localização
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
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
    setCustomPrice
  } = useLocalFilters();

  return (
    <div className="mx-auto w-full max-w-[1800px] px-[60px] py-10 ">
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

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[380px] shrink-0">
          <LocalFilters 
            filters={filters}
            updateFilters={updateFilters}
            toggleCategory={toggleCategory}
            setPriceRange={setPriceRange}
            setCustomPrice={setCustomPrice}
          />
        </div>

        <div className="min-w-0 flex-1">
          <FavoritesGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}