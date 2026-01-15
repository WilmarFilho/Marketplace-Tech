'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { getProducts, type PaginatedResponse } from "../../app/(main)/explorar/actions";
import Filters from "@/components/filters/filters";
import FilterBar from "@/components/filterbar/filterbar";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import { ResultsHeader } from "@/components/filters/ResultsHeader";
import { useFilters } from "@/lib/hooks/useFilters";

function ProductGrid() {
  const { filters } = useFilters();
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [lastFilters, setLastFilters] = useState<typeof filters | null>(null);
  
  const observer = useRef<IntersectionObserver | null>(null);

  // Verificar se os filtros mudaram (excluindo page)
  const filtersChanged = useCallback(() => {
    if (!lastFilters) return true;
    
    const { page: _, ...currentFiltersWithoutPage } = filters;
    const { page: __, ...lastFiltersWithoutPage } = lastFilters;
    
    return JSON.stringify(currentFiltersWithoutPage) !== JSON.stringify(lastFiltersWithoutPage);
  }, [filters, lastFilters]);

  // Buscar produtos (primeira página ou quando filtros mudarem)
  const fetchProducts = useCallback(async (resetProducts = false) => {
    if (resetProducts) {
      setIsLoading(true);
      setAllProducts([]);
    }
    setError(null);
    
    try {
      const currentPage = resetProducts ? 1 : pagination.page + 1;
      const data = await getProducts({ ...filters, page: currentPage });
      
      if (resetProducts) {
        setAllProducts(data.data);
      } else {
        setAllProducts(prev => [...prev, ...data.data]);
      }
      
      setPagination({
        page: currentPage,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasMore: data.pagination.hasMore
      });
      
      setLastFilters(filters);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters]);

  // Carregar mais produtos
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !pagination.hasMore) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const currentPage = pagination.page + 1;
      const data = await getProducts({ ...filters, page: currentPage });
      
      setAllProducts(prev => [...prev, ...data.data]);
      
      setPagination({
        page: currentPage,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasMore: data.pagination.hasMore
      });
    } catch (err) {
      setError('Erro ao carregar mais produtos');
      console.error('Erro ao buscar mais produtos:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, pagination.hasMore, pagination.page, filters]);

  // Intersection Observer para scroll infinito
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, pagination.hasMore, loadMore]);

  // Buscar produtos quando filtros mudarem
  useEffect(() => {
    if (filtersChanged()) {
      fetchProducts(true);
    }
  }, [filters]);

  if (error && allProducts.length === 0) {
    return (
      <div>
        <ResultsHeader 
          total={0}
          page={pagination.page}
          limit={pagination.limit}
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
        total={pagination.total}
        page={pagination.page}
        limit={pagination.limit}
        isLoading={isLoading}
      />

      {isLoading && allProducts.length === 0 ? (
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[395px] w-full max-w-[478px] bg-gray-200 animate-pulse rounded-[20px]"></div>
          ))}
        </div>
      ) : allProducts.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium mb-2 text-white">Nenhum produto encontrado</h3>
          <p className="text-gray-400">
            Tente ajustar seus filtros para encontrar mais produtos.
          </p>
        </div>
      ) : (
        <>
          <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allProducts.map((product: ProductRow, index: number) => (
              <div
                key={`${product.id}-${index}`}
                ref={index === allProducts.length - 1 ? lastProductElementRef : null}
                className="w-full"
              >
                <CardAnuncio product={product} />
              </div>
            ))}
          </div>
          
          {/* Loading indicator para scroll infinito */}
          {isLoadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[395px] w-full max-w-[478px] bg-gray-200 animate-pulse rounded-[20px]"></div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ExplorarContent() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-10 md:px-[44px]">
      <FilterBar />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[380px] shrink-0">
          <Filters />
        </div>

        <div className="min-w-0 flex-1">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}