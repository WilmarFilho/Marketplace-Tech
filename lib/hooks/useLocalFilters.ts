'use client';

import { useState, useCallback } from 'react';
import type { FilterParams } from '../../app/(main)/explorar/actions';

export function useLocalFilters() {
  // Estado dos filtros - sem redirecionamento
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

  // Função para atualizar filtros (sem atualizar URL)
  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Função para atualizar busca com debounce
  const updateSearch = useCallback((value: string) => {
    setSearchDebounce(value);
    // Aplicar a busca imediatamente aos filtros (sem debounce para simplicidade)
    updateFilters({ search: value, page: 1 });
  }, [updateFilters]);

  // Toggle de tag
  const toggleTag = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateFilters({ tags: newTags, page: 1 });
  }, [filters.tags, updateFilters]);

  // Toggle de categoria
  const toggleCategory = useCallback((category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    updateFilters({ categories: newCategories, page: 1 });
  }, [filters.categories, updateFilters]);

  // Definir faixa de preço
  const setPriceRange = useCallback((range: string) => {
    updateFilters({ priceRange: range, page: 1 });
  }, [updateFilters]);

  // Definir preço customizado
  const setCustomPrice = useCallback((min?: number, max?: number) => {
    updateFilters({ minPrice: min, maxPrice: max, page: 1 });
  }, [updateFilters]);

  // Limpar todos os filtros
  const clearFilters = useCallback(() => {
    setFilters({
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
    setSearchDebounce('');
  }, []);

  return {
    filters,
    searchDebounce,
    updateFilters,
    updateSearch,
    toggleTag,
    toggleCategory,
    setPriceRange,
    setCustomPrice,
    clearFilters
  };
}