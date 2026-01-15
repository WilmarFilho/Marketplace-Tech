'use client';

import {
  ArrowRight,
  Circle
} from 'lucide-react';
import styles from './filter.module.css';
import { FilterSection } from './FilterSection';
import { useFilters } from '@/lib/hooks/useFilters';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Filters() {
  const { 
    filters, 
    updateFilters, 
    toggleCategory, 
    setPriceRange, 
    setCustomPrice 
  } = useFilters();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar categorias do banco de dados
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('name')
        .order('name');
      
      setCategories(categoriesData?.map(cat => cat.name) || []);
      setIsLoading(false);
    }
    
    fetchCategories();
  }, []);
  
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ location: e.target.value, page: 1 });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ city: e.target.value, page: 1 });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ state: e.target.value, page: 1 });
  };

  const handleDateFilterChange = (dateFilter: string) => {
    const newFilter = filters.dateFilter === dateFilter ? '' : dateFilter;
    updateFilters({ dateFilter: newFilter, page: 1 });
  };

  if (isLoading) {
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

      {/* Preço */}
      <FilterSection title="Preço do produto" id="filters-price">
        <p className={styles.label}>Escolha um intervalo:</p>

        <div className={styles.priceRange}>
          <input 
            placeholder="Preço Min" 
            type="number"
            value={filters.minPrice || ''}
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

      {/* Data */}
      <FilterSection title="Data do anúncio" id="filters-date">
        <div className={styles.radioGroup}>
          {['Última Semana', 'Último Mês', 'Último Trimestre'].map(item => (
            <label 
              key={item} 
              className={`${styles.radio} ${
                filters.dateFilter === item ? styles.radioActive : ''
              }`}
              onClick={() => handleDateFilterChange(item)}
            >
              <span>{item}</span>
              <Circle 
                size={18} 
                className={filters.dateFilter === item ? styles.circleActive : ''}
              />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Categoria */}
      <FilterSection title="Categoria do produto" id="filters-category">
        <div className={styles.tags}>
          {categories.map(cat => (
            <button 
              key={cat} 
              type="button"
              className={filters.categories && filters.categories.includes(cat) ? styles.tagActive : ''}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
