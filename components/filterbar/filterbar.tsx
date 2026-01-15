'use client';

import { Search } from 'lucide-react';
import styles from './filterbar.module.css';
import { useFilters } from '@/lib/hooks/useFilters';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function FilterBar() {
  const { filters, searchDebounce, updateSearch, toggleTag } = useFilters();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar tags disponíveis
  useEffect(() => {
    async function fetchTags() {
      const supabase = createClient();
      const { data: tagsData } = await supabase
        .from('tags')
        .select('name')
        .limit(6);
      
      setAvailableTags(tagsData?.map(tag => tag.name) || []);
      setIsLoading(false);
    }
    
    fetchTags();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  };

  const handleTagClick = (tag: string) => {
    toggleTag(tag);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.tags}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.tag} animate-pulse bg-gray-200`}>
              &nbsp;
            </div>
          ))}
        </div>
        <div className={styles.searchWrapper}>
          <div className={`${styles.searchInput} animate-pulse bg-gray-200`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Tags */}
      <div className={styles.tags}>
        {availableTags.map((tag, index) => (
          <button 
            key={index} 
            className={`${styles.tag} ${
              filters.tags && filters.tags.includes(tag) ? styles.tagActive : ''
            }`}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Notebook Acer 4gb Ram"
          className={styles.searchInput}
          value={searchDebounce}
          onChange={handleSearchChange}
        />
        <button className={styles.searchButton}>
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
