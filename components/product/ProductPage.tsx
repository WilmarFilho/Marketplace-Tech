import styles from './product.module.css';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSeller from './ProductSeller';
import ProductContact from './ProductContact';

export default function ProductPage() {
  return (
    <div className={styles.page}>
      <ProductGallery />

      <div className={`${styles.content}`}>
        <div className={styles.left}>
          <ProductInfo />
          <ProductSeller />
        </div>

        <ProductContact />
      </div>
    </div>
  );
}
