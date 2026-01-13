'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';

export default function ProductGallery() {
  return (
    <div className={styles.gallery}>
      <button className={styles.galleryArrowLeft}>
        <ChevronLeft />
      </button>

      <Image src="/setup.jpg" alt="Produto" width={500} height={300} />

      <button className={styles.galleryArrowRight}>
        <ChevronRight />
      </button>
    </div>
  );
}
