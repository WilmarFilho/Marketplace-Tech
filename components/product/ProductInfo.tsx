'use client';

import {
  Heart,
  Calendar,
  MapPin
} from 'lucide-react';
import styles from './product.module.css';
import type { Tables } from '@/src/types/supabase';
import { toggleFavorite } from '@/app/(main)/anuncio/[id]/actions';
import { useState, useTransition } from 'react';

interface ProductInfoProps {
  product: Tables<'products'> & {
    seller?: any;
    sellerStats?: {
      totalProducts: number;
    };
  };
  isFavorite: boolean;
  currentUserId?: string;
}

export default function ProductInfo({ product, isFavorite, currentUserId }: ProductInfoProps) {
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();
  
  const handleToggleFavorite = () => {
    if (!currentUserId) return;
    
    startTransition(async () => {
      setIsCurrentlyFavorite(!isCurrentlyFavorite);
      try {
        await toggleFavorite(product.id);
      } catch (error) {
        // Reverter o estado em caso de erro
        setIsCurrentlyFavorite(isCurrentlyFavorite);
      }
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatLocation = () => {
    const parts = [];
    if (product.city) parts.push(product.city);
    if (product.state) parts.push(product.state);
    return parts.length > 0 ? parts.join(' - ') : 'Localização não informada';
  };

  return (
    <section className={styles.productCard}>
      <header className={styles.productHeader}>
        <div className={styles.productTitle}>
          <h1>{product.title}</h1>

          <div className={styles.tags}>
            {product.category && <span className={styles.category}>{product.category}</span>}
          </div>
        </div>

        {currentUserId && (
          <button 
            className={styles.favorite}
            onClick={handleToggleFavorite}
            disabled={isPending}
            style={{
              color: isCurrentlyFavorite ? '#ef4444' : '#6b7280'
            }}
          >
            <Heart fill={isCurrentlyFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </header>

      <div className={styles.description}>
        <h3>DESCRIÇÃO DO PRODUTO</h3>
        <p>
          {product.description || 'Descrição não disponível.'}
        </p>
      </div>

      <footer className={styles.meta}>
        <span>
          <Calendar size={16} /> Publicado no dia {formatDate(product.created_at)}
        </span>
        <span>
          <MapPin size={16} /> {formatLocation()}
        </span>
      </footer>
    </section>
  );
}
