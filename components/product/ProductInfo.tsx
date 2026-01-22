'use client';

import {
  Heart,
  Calendar,
  MapPin,
  Trash2,
  Edit3
} from 'lucide-react';
import styles from './product.module.css';
import type { Tables } from '@/src/types/supabase';
import { toggleFavorite, deleteProduct } from '@/app/(main)/anuncio/[id]/actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
  product: Tables<'products'> & {
    seller?: {
      id: string;
      name?: string;
      email?: string;
    };
    sellerStats?: {
      totalProducts: number;
    };
    product_tags?: {
      tag: {
        id: string;
        name: string;
      };
    }[];
    products_categories?: {
      category: {
        id: string;
        name: string;
      };
    }[];
  };
  isFavorite: boolean;
  currentUserId?: string;
  userRole?: string;
}

export default function ProductInfo({ product, isFavorite, currentUserId, userRole }: ProductInfoProps) {
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  const handleToggleFavorite = () => {
    if (!currentUserId) return;
    
    startTransition(async () => {
      setIsCurrentlyFavorite(!isCurrentlyFavorite);
      try {
        await toggleFavorite(product.id);
      } catch {
        // Reverter o estado em caso de erro
        setIsCurrentlyFavorite(isCurrentlyFavorite);
      }
    });
  };

  const handleDeleteProduct = async () => {
    if (!currentUserId) return;
    
    const isOwner = product.seller_id === currentUserId;
    const isAdmin = userRole === 'admin';
    
    if (!isOwner && !isAdmin) {
      alert('Você não tem permissão para deletar este anúncio');
      return;
    }
    
    const confirmDelete = confirm('Tem certeza que deseja deletar este anúncio? Esta ação não pode ser desfeita.');
    
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        await deleteProduct(product.id);
        router.push('/dashboard/meus-anuncios');
      } catch (error) {
        console.error('Erro ao deletar anúncio:', error);
        alert('Erro ao deletar o anúncio. Tente novamente.');
        setIsDeleting(false);
      }
    }
  };

  const handleEditProduct = () => {
    if (!currentUserId || product.seller_id !== currentUserId) return;
    
    // Redirecionar para a tela de edição com os dados do produto
    const editUrl = `/dashboard/anunciar?edit=${product.id}`;
    router.push(editUrl);
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
            {product.products_categories?.[0]?.category?.name && (
              <span className={styles.category}>{product.products_categories[0].category.name}</span>
            )}
            {product.product_tags?.map((productTag) => (
              <span key={productTag.tag.id} className={styles.tag}>
                {productTag.tag.name}
              </span>
            ))}
          </div>
        </div>

        {currentUserId && (
          <div className={styles.actionButtons}>
            {/* Botão de favoritar - apenas se NÃO for o dono do anúncio */}
            {product.seller_id !== currentUserId && (
              <button 
                className={styles.favorite}
                onClick={handleToggleFavorite}
                disabled={isPending}
                style={{
                  color: isCurrentlyFavorite ? '#ef4444' : '#000000'
                }}
              >
                <Heart size={20} fill={isCurrentlyFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            
            {/* Botões para o dono do anúncio */}
            {product.seller_id === currentUserId && (
              <>
                <button
                  className={styles.editButton}
                  onClick={handleEditProduct}
                  title="Editar anúncio"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  title="Deletar anúncio"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            
            {/* Botão de deletar para admin (se não for o dono) */}
            {(userRole === 'admin' && product.seller_id !== currentUserId) && (
              <button
                className={styles.deleteButton}
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                title="Deletar anúncio"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
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
