'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './filter.module.css';

type FilterSectionProps = {
  title: string;
  id: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function FilterSection({ title, id, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h3>{title}</h3>
        </div>
        <button
          type="button"
          className={styles.sectionToggle}
          aria-expanded={isOpen}
          aria-controls={id}
          onClick={() => setIsOpen(v => !v)}
        >
          <ChevronDown
            className={isOpen ? styles.sectionToggleIconOpen : styles.sectionToggleIcon}
          />
        </button>
      </header>

      <div
        id={id}
        className={isOpen ? styles.sectionContent : styles.sectionContentCollapsed}
      >
        {children}
      </div>
    </section>
  );
}