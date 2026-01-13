import {
  Heart,
  Calendar,
  MapPin
} from 'lucide-react';
import styles from './product.module.css';

export default function ProductInfo() {
  return (
    <section className={styles.productCard}>
      <header className={styles.productHeader}>
        <div className={styles.productTitle}>
          <h1>SETUP GAMER COMPLETO ULTRA MAX</h1>

          <div className={styles.tags}>
            <span className={styles.category}>Headphone</span>
            <span>#Headphone</span>
            <span>#Consoles</span>
          </div>
        </div>

        <button className={styles.favorite}>
          <Heart />
        </button>

      </header>


      <div className={styles.description}>
        <h3>DESCRIÇÃO DO PRODUTO</h3>
        <p>
          Lorem Ipsum has been the  standard dummy text ever since
          the 1500s Lorem Ipsum has been the  standard dummy text ever since
          the 1500s  Lorem Ipsum has been the  standard dummy text ever since
          the 1500s Lorem Ipsum has been the  standard dummy text ever since
          the 1500s Lorem Ipsum has been the  standard dummy text ever since
          the 1500s
        </p>
      </div>


      <footer className={styles.meta}>
        <span>
          <Calendar size={16} /> Publicado no dia 03/01/2026
        </span>
        <span>
          <MapPin size={16} /> Goiânia - GO
        </span>
      </footer>
    </section>
  );
}
