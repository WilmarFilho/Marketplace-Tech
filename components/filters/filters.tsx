'use client';

import {
  ChevronDown,
  ArrowRight,
  Circle
} from 'lucide-react';

import styles from './filter.module.css';

export default function Filters() {
  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>FILTROS</h2>

      {/* Preço */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Preço do produto</h3>
          </div>
          <ChevronDown />
        </header>

        <p className={styles.label}>Escolha um intervalo:</p>

        <div className={styles.priceRange}>
          <input placeholder="Preço Min" />
          <button className={styles.arrow}>
            <ArrowRight size={16} />
          </button>
          <input placeholder="Preço Max" />
        </div>

        <p className={styles.label}>Ou uma faixa específica:</p>

        <div className={styles.tags}>
          {Array.from({ length: 6 }).map((_, i) => (
            <button key={i}>Até 800R$</button>
          ))}
        </div>
      </section>

      {/* Localização */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Localização do produto</h3>
          </div>
          <ChevronDown />
        </header>

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
      </section>

      {/* Data */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Data do anúncio</h3>
          </div>
          <ChevronDown />
        </header>

        <div className={styles.radioGroup}>
          {['Última Semana', 'Último Mês', 'Último Trimestre'].map(item => (
            <label key={item} className={styles.radio}>
              <span>{item}</span>
              <Circle size={18} />
            </label>
          ))}
        </div>
      </section>

      {/* Categoria */}
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h3>Categoria do produto</h3>
          </div>
          <ChevronDown />
        </header>

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
            <button key={cat}>{cat}</button>
          ))}
        </div>
      </section>
    </aside>
  );
}
