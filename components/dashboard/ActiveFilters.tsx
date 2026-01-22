'use client';

import { X } from 'lucide-react';
import type { FilterParams } from '../../app/(main)/explorar/actions';

interface ActiveFiltersProps {
  filters: FilterParams;
  clearFilters: () => void;
  toggleTag: (tag: string) => void;
  toggleCategory: (category: string) => void;
  updateFilters: (filters: Partial<FilterParams>) => void;
}

export function ActiveFilters({ 
  filters, 
  clearFilters, 
  toggleTag, 
  toggleCategory, 
  updateFilters 
}: ActiveFiltersProps) {
  
  const hasActiveFilters = () => {
    return (
      filters.search || 
      (filters.tags && filters.tags.length > 0) ||
      (filters.categories && filters.categories.length > 0) ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.priceRange ||
      filters.city ||
      filters.state ||
      filters.dateFilter ||
      filters.status
    );
  };

  const formatPriceFilter = () => {
    if (filters.priceRange) return filters.priceRange;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const min = filters.minPrice ? `R$ ${filters.minPrice}` : '';
      const max = filters.maxPrice ? `R$ ${filters.maxPrice}` : '';
      if (min && max) return `${min} - ${max}`;
      if (min) return `Acima de ${min}`;
      if (max) return `Até ${max}`;
    }
    return null;
  };

  const formatDateFilter = () => {
    switch (filters.dateFilter) {
      case 'today': return 'Hoje';
      case 'week': return 'Última semana';
      case 'month': return 'Último mês';
      case '3months': return 'Últimos 3 meses';
      default: return null;
    }
  };

  if (!hasActiveFilters()) return null;

  return (
    <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Filtros ativos:</h3>
        <button
          onClick={clearFilters}
          className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Limpar todos
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Status */}
        {filters.status && (
          <div
            className={
              `flex items-center gap-1 px-2 py-1 rounded-md text-xs border ` +
              (filters.status === 'aprovado'
                ? 'bg-green-500/20 text-green-300 border-green-400/30'
                : filters.status === 'pendente'
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                : 'bg-red-500/20 text-red-300 border-red-400/30')
            }
          >
            <span>
              Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
            </span>
            <button
              onClick={() => updateFilters({ status: '', page: 1 })}
              className="hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Busca */}
        {filters.search && (
          <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs border border-blue-400/30">
            <span>Busca: &ldquo;{filters.search}&rdquo;</span>
            <button
              onClick={() => updateFilters({ search: '', page: 1 })}
              className="hover:text-blue-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Tags */}
        {filters.tags && filters.tags.map(tag => (
          <div key={tag} className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-xs border border-green-400/30">
            <span>#{tag}</span>
            <button
              onClick={() => toggleTag(tag)}
              className="hover:text-green-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Categorias */}
        {filters.categories && filters.categories.map(category => (
          <div key={category} className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs border border-purple-400/30">
            <span>{category}</span>
            <button
              onClick={() => toggleCategory(category)}
              className="hover:text-purple-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Preço */}
        {formatPriceFilter() && (
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md text-xs border border-yellow-400/30">
            <span>{formatPriceFilter()}</span>
            <button
              onClick={() => updateFilters({ 
                minPrice: undefined, 
                maxPrice: undefined, 
                priceRange: '', 
                page: 1 
              })}
              className="hover:text-yellow-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Cidade */}
        {filters.city && (
          <div className="flex items-center gap-1 bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md text-xs border border-orange-400/30">
            <span>Cidade: {filters.city}</span>
            <button
              onClick={() => updateFilters({ city: '', page: 1 })}
              className="hover:text-orange-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Estado */}
        {filters.state && (
          <div className="flex items-center gap-1 bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md text-xs border border-pink-400/30">
            <span>Estado: {filters.state}</span>
            <button
              onClick={() => updateFilters({ state: '', page: 1 })}
              className="hover:text-pink-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Data */}
        {formatDateFilter() && (
          <div className="flex items-center gap-1 bg-teal-500/20 text-teal-300 px-2 py-1 rounded-md text-xs border border-teal-400/30">
            <span>{formatDateFilter()}</span>
            <button
              onClick={() => updateFilters({ dateFilter: '', page: 1 })}
              className="hover:text-teal-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}