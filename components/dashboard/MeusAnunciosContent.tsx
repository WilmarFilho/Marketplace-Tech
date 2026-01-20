'use client';

import { useEffect, useState, useCallback } from "react";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import { ResultsHeader } from "@/components/filters/ResultsHeader";
import { useLocalFilters } from "@/lib/hooks/useLocalFilters";
import { getMeusAnuncios } from "../../app/(main)/dashboard/meus-anuncios/actions";
import LocalFilterBar from "@/components/dashboard/LocalFilterBar";
import LocalFilters from "@/components/dashboard/LocalFilters";
import { ActiveFilters } from "@/components/dashboard/ActiveFilters";
import Link from "next/link";
import { Plus } from "lucide-react";import type { FilterParams } from '../../app/(main)/explorar/actions';
function MeusAnunciosGrid({ filters }: { filters: FilterParams }) {
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar meus anúncios
  const fetchMeusAnuncios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const products = await getMeusAnuncios();
      
      if (!products) {
        setError('Erro de autenticação');
        return;
      }
      
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (err) {
      setError('Erro ao carregar anúncios');
      console.error('Erro ao buscar anúncios:', err);
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
          product.tags?.some((productTag: { name?: string }) => 
            productTag.name?.toLowerCase() === filterTag.toLowerCase()
          )
        )
      );
    }

    // Filtro por data
    if (filters.dateFilter) {
      // Aplicar filtro de data se fornecido
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
        // Filtrar produtos pela data
        filtered = filtered.filter(product => {
          const productDate = product.created_at ? new Date(product.created_at) : null;
          const isValid = productDate && productDate >= filterDate;
          return isValid;
        });
        
      }
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  useEffect(() => {
    fetchMeusAnuncios();
  }, [fetchMeusAnuncios]);

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
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium mb-2 text-white">
            {allProducts.length === 0 
              ? "Nenhum anúncio encontrado" 
              : "Nenhum anúncio corresponde aos filtros"
            }
          </h3>
          <p className="text-gray-400 mb-6">
            {allProducts.length === 0 
              ? "Crie seu primeiro anúncio para começar a vender." 
              : "Tente ajustar seus filtros para encontrar seus anúncios."
            }
          </p>
          {allProducts.length === 0 && (
            <Link 
              href="/dashboard/anunciar"
              className="inline-flex items-center gap-2 bg-[#ecf230] hover:bg-[#ecf230]/90 text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Criar Anúncio
            </Link>
          )}
        </div>
      ) : (
        <div className="explore-grid justify-items-center gap-6">
          {filteredProducts.map((product: ProductRow) => (
            <div key={product.id} className="w-full">
              <CardAnuncio product={product} showFavoriteButton={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MeusAnunciosContent() {
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-row lg:items-center lg:justify-between max-[599px]:flex-col max-[599px]:items-start max-[599px]:gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meus Anúncios</h1>
            <p className="text-gray-400">Gerencie seus produtos anunciados</p>
          </div>
          <Link 
            href="/dashboard/anunciar"
            className="inline-flex items-center gap-2 bg-[#ecf230] hover:bg-[#ecf230]/90 text-black font-medium px-6 py-3 rounded-lg transition-colors self-start sm:self-auto lg:self-auto max-[599px]:self-start max-[599px]:mt-2"
          >
            <Plus className="h-5 w-5" />
            Novo Anúncio
          </Link>
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
            filters={filters}
            updateFilters={updateFilters}
            toggleCategory={toggleCategory}
            setPriceRange={setPriceRange}
            setCustomPrice={setCustomPrice}
          />
        </div>

        <div className="min-w-0 flex-1">
          <MeusAnunciosGrid filters={filters} />
        </div>
      </div>
      </div>
    </div>
  );
}