'use client';

// Slider ảnh sản phẩm
// Image MUST update automatically when variant changes
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Variant } from '@/types';

interface ProductGalleryProps {
  images: string[];
  selectedVariant?: Variant;
}

export default function ProductGallery({
  images,
  selectedVariant,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Compute display images based on variant
  const displayImages = (() => {
    if (selectedVariant?.image) {
      // If variant has specific image, show it first
      const variantImageIndex = images.findIndex((img) => img === selectedVariant.image);
      if (variantImageIndex !== -1) {
        return [selectedVariant.image, ...images.filter((img) => img !== selectedVariant.image)];
      }
      return [selectedVariant.image, ...images];
    }
    return images;
  })();

  // Reset to first image when variant changes
  const prevVariantIdRef = useRef<string | undefined>(selectedVariant?.id);
  
  useEffect(() => {
    if (prevVariantIdRef.current !== selectedVariant?.id) {
      prevVariantIdRef.current = selectedVariant?.id;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setCurrentIndex(0);
      }, 0);
    }
  }, [selectedVariant?.id]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Không có ảnh</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
        <Image
          src={displayImages[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${
                  index === currentIndex
                    ? 'border-pink-400 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                }
              `}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
