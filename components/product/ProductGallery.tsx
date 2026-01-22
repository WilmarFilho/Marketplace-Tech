'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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
  const [imagesPerView, setImagesPerView] = useState(3);

  // Calcula o limite máximo de scroll baseado nas imagens visíveis
  const maxIndex = Math.max(0, images.length - imagesPerView);

  useEffect(() => {
    const updateImagesPerView = () => {
      const width = window.innerWidth;
      if (width >= 1400) {
        setImagesPerView(3);
      } else if (width >= 650) {
        setImagesPerView(2);
      } else {
        setImagesPerView(1);
      }
    };

    updateImagesPerView();
    window.addEventListener('resize', updateImagesPerView);
    return () => window.removeEventListener('resize', updateImagesPerView);
  }, []);

  // Garante que o currentIndex não fique "orfão" ao mudar o tamanho da tela
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const openLightbox = (index: number) => setLightboxImage(index);
  const closeLightbox = () => setLightboxImage(null);

  const nextImage = () => setLightboxImage((prev) => (prev !== null ? (prev + 1) % images.length : null));
  const prevImage = () => setLightboxImage((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));

  return (
    <div className={styles.gallery}>
      <button 
        className={styles.galleryArrowLeft}
        onClick={handlePrev}
        style={{ display: currentIndex === 0 ? 'none' : 'flex' }}
      >
        <ChevronLeft />
      </button>

      <div className={styles.galleryContainer}>
        <div 
          className={styles.galleryTrack} 
          style={{ 
            transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
            width: `${images.length * 100 / imagesPerView}%`
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.gallerySlide}>
              <Image 
                src={image.src} 
                alt={image.alt} 
                width={800} 
                height={600}
                className={styles.galleryImage}
                onClick={() => openLightbox(index)}
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        className={styles.galleryArrowRight}
        onClick={handleNext}
        style={{ display: currentIndex >= maxIndex ? 'none' : 'flex' }}
      >
        <ChevronRight />
      </button>

      {lightboxImage !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={32} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxPrev} onClick={prevImage}>
              <ChevronLeft size={48} />
            </button>
            <div className={styles.lightboxImageContainer}>
              <Image 
                src={images[lightboxImage].src}
                alt={images[lightboxImage].alt}
                width={1200}
                height={800}
                className={styles.lightboxImage}
              />
            </div>
            <button className={styles.lightboxNext} onClick={nextImage}>
              <ChevronRight size={48} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}