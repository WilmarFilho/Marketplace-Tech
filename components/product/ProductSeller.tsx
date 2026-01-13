import { Layers, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';

export default function ProductSeller() {
  return (
    <section className={styles.sellerCard}>
      <h3>INFORMAÇÕES DO VENDEDOR</h3>

      <div className={styles.sellerInfo}>
        <Image src="/avatar.png" alt="Vendedor" width={50} height={50} />

        <div>
          <strong>ALFREDO FAST</strong>
        </div>
      </div>

      <div className={styles.sellerStats}>
        <div>
          <Layers />
          <span>+100 anúncios</span>
        </div>

        <div>
          <BadgeCheck />
          <span>Boa Reputação</span>
        </div>
      </div>
    </section>
  );
}
