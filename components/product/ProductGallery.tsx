'use client';

import { ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import styles from './product.module.css';
import type { Tables } from '@/src/types/supabase';

interface ProductGalleryProps {
  product: Tables<'products'>;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images_urls && product.images_urls.length > 0 
    ? product.images_urls.map((url, index) => ({ 
        src: url, 
        alt: `${product.title} - Imagem ${index + 1}` 
      }))
    : [{ 
        src: '/figma/card-bg-1.png', 
        alt: product.title 
      }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const imagesPerView = Math.min(3, images.length);
  const maxIndex = Math.max(0, images.length - imagesPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxImage(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage - 1 + images.length) % images.length);
    }
  };

  return (
    <div className={styles.gallery}>
      <button 
        className={styles.galleryArrowLeft}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft />
      </button>

      <div className={styles.galleryContainer}>
        <div 
          className={styles.galleryTrack}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)`,
            width: `${(images.length / imagesPerView) * 100}%`
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.gallerySlide}>
              <Image 
                src={image.src} 
                alt={image.alt} 
                width={300} 
                height={200}
                className={styles.galleryImage}
                onClick={() => openLightbox(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        className={styles.galleryArrowRight}
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
      >
        <ChevronRight />
      </button>

      {lightboxImage !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>

            <button className={styles.lightboxPrev} onClick={prevImage}>
              <ChevronLeft />
            </button>
            
            <Image 
              src={images[lightboxImage].src}
              alt={images[lightboxImage].alt}
              width={800}
              height={600}
              className={styles.lightboxImage}
            />
            
            <button className={styles.lightboxNext} onClick={nextImage}>
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
