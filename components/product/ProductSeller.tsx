import { Layers, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';

export default function ProductSeller() {
  return (
    <section className={styles.sellerCard}>
      <h3>INFORMAÇÕES DO VENDEDOR</h3>

      <div className={styles.sellerContent}>
        <div className={styles.sellerInfo}>
          <Image src="/figma/avatar.png" alt="Vendedor" width={50} height={50} />
          <span>ALFREDO FAST</span>
        </div>

        <div className={styles.sellerStats}>

          <button>
            <Layers />
          </button>

          <span>+100 anúncios</span>
        </div>

        <div className={styles.sellerReputation}>
          <button>
            <BadgeCheck />
          </button>
          <span>Boa Reputação</span>
        </div>
      </div>

    </section>
  );
}
