'use client';

import { Search } from 'lucide-react';
import styles from './filterbar.module.css';

const tags = [
  '#Celulares',
  '#Celulares',
  '#Celulares',
  '#Celulares',
  '#Celulares',
  '#Celulares',
];

export default function FilterBar() {
  return (
    <div className={styles.container}>
      {/* Tags */}
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <button key={index} className={styles.tag}>
            {tag}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Notebook Acer 4gb Ram"
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
