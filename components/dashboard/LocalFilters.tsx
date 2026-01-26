'use client';

import { useState } from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import styles from '../filters/filter.module.css';
import { FilterSection } from '../filters/FilterSection';

import type { FilterParams } from '../../app/(main)/explorar/actions';

interface LocalFiltersProps {
  filters: FilterParams;
  updateFilters: (filters: Partial<FilterParams>) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: string) => void;
  setCustomPrice: (min?: number, max?: number) => void;
  showStatusFilter?: boolean;
}

export default function LocalFilters({
  filters,
  updateFilters,
  setPriceRange,
  setCustomPrice,
  showStatusFilter = false,
}: LocalFiltersProps) {

  const [isLoading] = useState(true);

  
  // Tags de faixas de preço
  const priceTags = [
    'Até R$ 500',
    'R$ 500 - R$ 1.000',
    'R$ 1.000 - R$ 2.500',
    'R$ 2.500 - R$ 5.000',
    'R$ 5.000 - R$ 10.000',
    'Acima de R$ 10.000'
  ];

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setCustomPrice(value, filters.maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setCustomPrice(filters.minPrice, value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ state: e.target.value, page: 1 });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ city: e.target.value, page: 1 });
  };

  if (!isLoading) {
    return (
      <aside className={styles.container}>
        <h2 className={styles.title}>FILTROS</h2>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>FILTROS</h2>

      {/* Status do anúncio (só para Meus Anúncios) */}
      {showStatusFilter && (
        <FilterSection title="Status do anúncio" id="filters-status">
          <div className={styles.tags}>
            {['aprovado', 'pendente', 'reprovado'].map((status) => (
              <button
                key={status}
                type="button"
                className={filters.status === status ? styles.tagActive : ''}
                onClick={() => updateFilters({ status: filters.status === status ? '' : status, page: 1 })}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Preço */}
      <FilterSection title="Preço do produto" id="filters-price">
        <p className={styles.label}>Escolha um intervalo:</p>

        <div className={styles.priceRange}>
          <input 
            placeholder="Preço Min" 
            type="number"
            value={filters.minPrice !== undefined ? filters.minPrice : ''}
            onChange={handleMinPriceChange}
          />
          <button type="button" className={styles.arrow}>
            <ArrowRight size={16} />
          </button>
          <input 
            placeholder="Preço Max" 
            type="number"
            value={filters.maxPrice || ''}
            onChange={handleMaxPriceChange}
          />
        </div>

        <p className={styles.label}>Ou uma faixa específica:</p>

        <div className={styles.tags}>
          {priceTags.map((tag, i) => (
            <button 
              key={i} 
              type="button"
              className={filters.priceRange === tag ? styles.tagActive : ''}
              onClick={() => setPriceRange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Localização */}
      <FilterSection title="Localização do produto" id="filters-location">
        <p className={styles.label}>Escolha um estado:</p>
        <input
          className={styles.fullInput}
          placeholder="Goiás, São Paulo ..."
          value={filters.state || ''}
          onChange={handleStateChange}
        />

        <p className={styles.label}>Ou uma cidade específica:</p>
        <input
          className={styles.fullInput}
          placeholder="Goiânia, Trindade ..."
          value={filters.city || ''}
          onChange={handleCityChange}
        />
      </FilterSection>
    </aside>
  );
}