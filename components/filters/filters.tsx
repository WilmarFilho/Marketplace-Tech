'use client';

import { useState } from 'react';

import {
  ChevronDown,
  ArrowRight,
  Circle
} from 'lucide-react';

import styles from './filter.module.css';

export default function Filters() {
  const [openPrice, setOpenPrice] = useState(true);
  const [openLocation, setOpenLocation] = useState(true);
  const [openDate, setOpenDate] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>FILTROS</h2>

      {/* Preço */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Preço do produto</h3>
          </div>
          <button
            type="button"
            className={styles.sectionToggle}
            aria-expanded={openPrice}
            aria-controls="filters-price"
            onClick={() => setOpenPrice((v) => !v)}
          >
            <ChevronDown
              className={openPrice ? styles.sectionToggleIconOpen : styles.sectionToggleIcon}
            />
          </button>
        </header>

        <div
          id="filters-price"
          className={openPrice ? styles.sectionContent : styles.sectionContentCollapsed}
        >
          <p className={styles.label}>Escolha um intervalo:</p>

          <div className={styles.priceRange}>
            <input placeholder="Preço Min" />
            <button type="button" className={styles.arrow}>
              <ArrowRight size={16} />
            </button>
            <input placeholder="Preço Max" />
          </div>

          <p className={styles.label}>Ou uma faixa específica:</p>

          <div className={styles.tags}>
            {Array.from({ length: 6 }).map((_, i) => (
              <button key={i} type="button">Até 800R$</button>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Localização do produto</h3>
          </div>
          <button
            type="button"
            className={styles.sectionToggle}
            aria-expanded={openLocation}
            aria-controls="filters-location"
            onClick={() => setOpenLocation((v) => !v)}
          >
            <ChevronDown
              className={openLocation ? styles.sectionToggleIconOpen : styles.sectionToggleIcon}
            />
          </button>
        </header>

        <div
          id="filters-location"
          className={openLocation ? styles.sectionContent : styles.sectionContentCollapsed}
        >
          <p className={styles.label}>Escolha um estado:</p>
          <input
            className={styles.fullInput}
            placeholder="Goiás, São Paulo ..."
          />

          <p className={styles.label}>Ou uma cidade específica:</p>
          <input
            className={styles.fullInput}
            placeholder="Goiânia, Trindade ..."
          />
        </div>
      </section>

      {/* Data */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Data do anúncio</h3>
          </div>
          <button
            type="button"
            className={styles.sectionToggle}
            aria-expanded={openDate}
            aria-controls="filters-date"
            onClick={() => setOpenDate((v) => !v)}
          >
            <ChevronDown
              className={openDate ? styles.sectionToggleIconOpen : styles.sectionToggleIcon}
            />
          </button>
        </header>

        <div
          id="filters-date"
          className={openDate ? styles.sectionContent : styles.sectionContentCollapsed}
        >
          <div className={styles.radioGroup}>
            {['Última Semana', 'Último Mês', 'Último Trimestre'].map(item => (
              <label key={item} className={styles.radio}>
                <span>{item}</span>
                <Circle size={18} />
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Categoria */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Categoria do produto</h3>
          </div>
          <button
            type="button"
            className={styles.sectionToggle}
            aria-expanded={openCategory}
            aria-controls="filters-category"
            onClick={() => setOpenCategory((v) => !v)}
          >
            <ChevronDown
              className={openCategory ? styles.sectionToggleIconOpen : styles.sectionToggleIcon}
            />
          </button>
        </header>

        <div
          id="filters-category"
          className={openCategory ? styles.sectionContent : styles.sectionContentCollapsed}
        >
          <div className={styles.tags}>
            {[
              'Hardware',
              'Acessórios',
              'Celulares',
              'Notebook',
              'Desktop',
              'Headset',
              'Headphone',
              'Consoles',
              'Cadeiras',
            ].map(cat => (
              <button key={cat} type="button">{cat}</button>
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
