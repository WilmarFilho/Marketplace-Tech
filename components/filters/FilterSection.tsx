"use client";

import { useState, ReactNode, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './filter.module.css';
import { cn } from '@/lib/utils';

type FilterSectionProps = {
  title: string;
  id: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function FilterSection({ title, id, defaultOpen = true, children, className }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // On small screens, start collapsed to allow a compact horizontal filter bar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) setIsOpen(false);
    }
  }, []);

  return (
    <section className={cn(styles.section, className)}>
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