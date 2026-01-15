'use client';

import { useFilters } from '@/lib/hooks/useFilters';
import { X } from 'lucide-react';

interface ResultsHeaderProps {
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
}

export function ResultsHeader({ total, page, limit, isLoading }: ResultsHeaderProps) {
  const { filters, resetFilters } = useFilters();
  
  // Verificar se há filtros ativos
  const hasActiveFilters = 
    filters.search ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.priceRange ||
    filters.location ||
    filters.city ||
    filters.state ||
    filters.dateFilter;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex justify-between items-center mb-6 text-white">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium">
          {isLoading ? (
            <span className="animate-pulse">Carregando...</span>
          ) : total === 0 ? (
            'Nenhum resultado encontrado'
          ) : (
            <>
              Mostrando {startItem}-{endItem} de {total} produtos
            </>
          )}
        </h3>
        
        {hasActiveFilters && !isLoading && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-500 rounded-lg hover:border-gray-400 transition-colors"
          >
            <X className="h-3 w-3" />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Mostrar filtros ativos */}
      {hasActiveFilters && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Filtros ativos:</span>
          <div className="flex gap-1">
            {filters.search && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                &quot;{filters.search}&quot;
              </span>
            )}
            {filters.tags && filters.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                #{tag}
              </span>
            ))}
            {filters.categories && filters.categories.map((category: string) => (
              <span key={category} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                {category}
              </span>
            ))}
            {filters.priceRange && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                {filters.priceRange}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                R$ {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
              </span>
            )}
            {filters.dateFilter && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {filters.dateFilter}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}