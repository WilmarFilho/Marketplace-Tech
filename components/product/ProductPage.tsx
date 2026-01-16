import styles from './product.module.css';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSeller from './ProductSeller';
import ProductContact from './ProductContact';
import { getProductDetails } from '@/app/(main)/anuncio/[id]/actions';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  productId: string;
}

export default async function ProductPage({ productId }: ProductPageProps) {
  const result = await getProductDetails(productId);
  
  if (!result?.product) {
    notFound();
  }
  
  const { product, isFavorite, currentUserId, userRole } = result;

  return (
    <div className={styles.page}>
      <ProductGallery product={product} />

      <div className={`${styles.content}`}>
        <div className={styles.left}>
          <ProductInfo product={product} isFavorite={isFavorite} currentUserId={currentUserId} userRole={userRole} />
          <ProductSeller product={product} />
        </div>

        <ProductContact product={product} />
      </div>
    </div>
  );
}
