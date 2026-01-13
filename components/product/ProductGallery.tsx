'use client';

import { ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import styles from './product.module.css';

const mockImages = [
  { src: '/figma/card-bg-4.png', alt: 'PC Gamer Completo' },
  { src: '/figma/card-bg-2.png', alt: 'Setup Gaming 1' },
  { src: '/figma/card-bg-2.png', alt: 'Setup Gaming 2' },
  { src: '/figma/card-bg-3.png', alt: 'Setup Gaming 3' },
  { src: '/figma/card-bg-4.png', alt: 'Setup Gaming 4' },
  { src: '/figma/hero-bg.webp', alt: 'Setup Premium' }
];

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const imagesPerView = 3;
  const maxIndex = mockImages.length - imagesPerView;

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
      setLightboxImage((lightboxImage + 1) % mockImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage - 1 + mockImages.length) % mockImages.length);
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
            width: `${(mockImages.length / imagesPerView) * 100}%`
          }}
        >
          {mockImages.map((image, index) => (
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
              src={mockImages[lightboxImage].src}
              alt={mockImages[lightboxImage].alt}
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
