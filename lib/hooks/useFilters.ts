'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FilterParams } from '../../app/(main)/explorar/actions';

const DEBOUNCE_DELAY = 500; // 500ms

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Estado dos filtros - inicializar com valores padrão primeiro
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    tags: [],
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
    priceRange: '',
    location: '',
    city: '',
    state: '',
    dateFilter: '',
    sortBy: 'newest',
    status: '',
    page: 1,
    limit: 12
  });

  // Estado para debounce da busca
  const [searchDebounce, setSearchDebounce] = useState('');

  // Inicializar filtros a partir da URL apenas uma vez
  useEffect(() => {
    const filtersFromURL: FilterParams = {
      search: searchParams.get('search') || '',
      tags: searchParams.getAll('tags') || [],
      categories: searchParams.getAll('categories') || [],
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      priceRange: searchParams.get('priceRange') || '',
      location: searchParams.get('location') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      dateFilter: searchParams.get('dateFilter') || '',
      sortBy: (searchParams.get('sortBy') as FilterParams['sortBy']) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 12
    };
    
    setFilters(filtersFromURL);
    setSearchDebounce(filtersFromURL.search || '');
    setIsInitialized(true);
  }, [searchParams]); // Reagir quando searchParams mudam

  // Atualizar URL quando filtros mudarem (mas não durante a inicialização)
  const updateURL = useCallback((newFilters: FilterParams) => {
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.set(key, String(value));
        }
      }
    });

    const url = params.toString() ? `?${params.toString()}` : '';
    router.push(`/explorar${url}`, { scroll: false });
  }, [router, isInitialized]);

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Atualizar URL em um useEffect separado para evitar setState durante render
    if (isInitialized) {
      setTimeout(() => {
        updateURL(updated);
      }, 0);
    }
  }, [filters, isInitialized, updateURL]);

  // Debounce para busca por texto
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      if (searchDebounce !== filters.search) {
        updateFilters({ search: searchDebounce, page: 1 });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchDebounce, filters.search, updateFilters, isInitialized]);

  // Função para atualizar busca com debounce
  const updateSearch = useCallback((search: string) => {
    setSearchDebounce(search);
  }, []);

  // Função para resetar filtros
  const resetFilters = useCallback(() => {
    const defaultFilters: FilterParams = {
      search: '',
      tags: [],
      categories: [],
      minPrice: undefined,
      maxPrice: undefined,
      priceRange: '',
      location: '',
      city: '',
      state: '',
      dateFilter: '',
      sortBy: 'newest',
      page: 1,
      limit: 12
    };
    setFilters(defaultFilters);
    setSearchDebounce('');
    updateURL(defaultFilters);
  }, [updateURL]);

  // Função para adicionar/remover tag
  const toggleTag = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    updateFilters({
      tags: currentTags.includes(tag)
        ? currentTags.filter((t: string) => t !== tag)
        : [...currentTags, tag],
      page: 1
    });
  }, [filters.tags, updateFilters]);

  // Função para adicionar/remover categoria
  const toggleCategory = useCallback((category: string) => {
    const currentCategories = filters.categories || [];
    updateFilters({
      categories: currentCategories.includes(category)
        ? currentCategories.filter((c: string) => c !== category)
        : [...currentCategories, category],
      page: 1
    });
  }, [filters.categories, updateFilters]);

  // Função para definir faixa de preço
  const setPriceRange = useCallback((priceRange: string) => {
    updateFilters({
      priceRange,
      minPrice: undefined, // Limpar preços customizados quando usar faixa
      maxPrice: undefined,
      page: 1
    });
  }, [updateFilters]);

  // Função para definir preços customizados
  const setCustomPrice = useCallback((minPrice?: number, maxPrice?: number) => {
    updateFilters({
      minPrice,
      maxPrice,
      priceRange: '', // Limpar faixa quando usar preços customizados
      page: 1
    });
  }, [updateFilters]);

  return {
    filters,
    searchDebounce,
    updateFilters,
    updateSearch,
    resetFilters,
    toggleTag,
    toggleCategory,
    setPriceRange,
    setCustomPrice
  };
}