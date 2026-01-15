'use client';

import {
  ArrowRight,
  Circle
} from 'lucide-react';
import styles from './filters.module.css';
import { FilterSection } from '../filters/FilterSection';
import { useFilters } from '@/lib/hooks/useFilters';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

export default function DashboardFilters() {
  const pathname = usePathname();
  const { 
    filters, 
    updateFilters, 
    toggleCategory, 
    setPriceRange, 
    setCustomPrice 
  } = useFilters();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMeusAnuncios = pathname?.includes('/meus-anuncios');

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

  // Status options para meus anúncios
  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'rejeitado', label: 'Rejeitado' },
  ];

  const handlePriceTagClick = (tag: string) => {
    if (filters.priceRange === tag) {
      setPriceRange('');
      setCustomPrice(undefined, undefined);
    } else {
      setPriceRange(tag);
      
      // Converter tag para valores min/max
      switch(tag) {
        case 'Até R$ 500':
          setCustomPrice(undefined, 500);
          break;
        case 'R$ 500 - R$ 1.000':
          setCustomPrice(500, 1000);
          break;
        case 'R$ 1.000 - R$ 2.500':
          setCustomPrice(1000, 2500);
          break;
        case 'R$ 2.500 - R$ 5.000':
          setCustomPrice(2500, 5000);
          break;
        case 'R$ 5.000 - R$ 10.000':
          setCustomPrice(5000, 10000);
          break;
        case 'Acima de R$ 10.000':
          setCustomPrice(10000, undefined);
          break;
      }
    }
  };

  const handleCustomPriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    
    if (field === 'min') {
      setCustomPrice(numValue, filters.maxPrice);
    } else {
      setCustomPrice(filters.minPrice, numValue);
    }
    
    // Limpar seleção de tag quando personalizar
    if (filters.priceRange) {
      setPriceRange('');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.filters}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filters}>
      {/* Status Filter - Only for Meus Anúncios */}
      {isMeusAnuncios && (
        <FilterSection id="status" title="Status">
          <div className={styles.filterTags}>
            {statusOptions.map((option) => {
              const isActive = filters.status === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ status: isActive ? '' : option.value })}
                  className={`${styles.filterTag} ${isActive ? styles.active : ''}`}
                >
                  <Circle className={styles.tagIcon} />
                  <span>{option.label}</span>
                  {isActive && <ArrowRight className={styles.tagIcon} />}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Categories */}
      <FilterSection id="categories" title="Categorias">
        <div className={styles.filterTags}>
          {categories.map((category) => {
            const isActive = filters.categories?.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`${styles.filterTag} ${isActive ? styles.active : ''}`}
              >
                <Circle className={styles.tagIcon} />
                <span>{category}</span>
                {isActive && <ArrowRight className={styles.tagIcon} />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection id="price" title="Preço">
        <div className={styles.filterTags}>
          {priceTags.map((tag) => {
            const isActive = filters.priceRange === tag;
            return (
              <button
                key={tag}
                onClick={() => handlePriceTagClick(tag)}
                className={`${styles.filterTag} ${isActive ? styles.active : ''}`}
              >
                <Circle className={styles.tagIcon} />
                <span>{tag}</span>
                {isActive && <ArrowRight className={styles.tagIcon} />}
              </button>
            );
          })}
        </div>

        {/* Custom Price Range */}
        <div className={styles.customPriceContainer}>
          <div className={styles.priceInputGroup}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>R$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleCustomPriceChange('min', e.target.value)}
                className={styles.priceInput}
              />
            </div>
            <span className={styles.priceSeparator}>-</span>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>R$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleCustomPriceChange('max', e.target.value)}
                className={styles.priceInput}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection id="location" title="Localização">
        <input
          type="text"
          placeholder="Cidade ou estado"
          value={filters.location || ''}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className={styles.locationInput}
        />
      </FilterSection>
    </div>
  );
}