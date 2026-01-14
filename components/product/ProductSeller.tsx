import { Layers, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';
import type { Tables } from '@/src/types/supabase';

interface ProductSellerProps {
  product: Tables<'products'> & {
    seller?: any;
    sellerStats?: {
      totalProducts: number;
    };
  };
}

export default function ProductSeller({ product }: ProductSellerProps) {
  const seller = product.seller;
  const sellerStats = product.sellerStats;
  
  return (
    <section className={styles.sellerCard}>
      <h3>INFORMAÇÕES DO VENDEDOR</h3>

      <div className={styles.sellerContent}>
        <div className={styles.sellerInfo}>
          <Image 
            src={seller?.avatar_url || "/figma/avatar.png"} 
            alt="Vendedor" 
            width={50} 
            height={50}
            className={styles.sellerAvatar}
          />
          <span>{seller?.full_name || 'Vendedor'}</span>
        </div>

        <div className={styles.sellerStats}>
          <button>
            <Layers />
          </button>
          <span>+{sellerStats?.totalProducts || 0} anúncios</span>
        </div>

        <div className={styles.sellerReputation}>
          <button>
            <BadgeCheck />
          </button>
          <span>
            {sellerStats && sellerStats.totalProducts > 5 
              ? 'Boa Reputação' 
              : 'Novo Vendedor'
            }
          </span>
        </div>
      </div>

    </section>
  );
}
