'use client';

// Slider ảnh sản phẩm
// Image MUST update automatically when variant changes
// Optimized with next/image for performance and layout shift prevention
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
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  
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

  // Set loading state when image changes
  useEffect(() => {
    setImageLoading((prev) => ({ ...prev, [currentIndex]: true }));
  }, [currentIndex, displayImages]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  if (displayImages.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Không có ảnh</p>
      </div>
    );
  }

  const currentImage = displayImages[currentIndex];
  const isFirstImage = currentIndex === 0;
  const isLoading = imageLoading[currentIndex];
  const hasError = imageError[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg overflow-hidden group">
        {/* Loading Skeleton */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Error Placeholder */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-2 block">🐻</span>
              <p className="text-sm text-gray-500">Không thể tải ảnh</p>
            </div>
          </div>
        )}

        {/* Main Product Image */}
        {!hasError && (
          <Image
            src={currentImage}
            alt={`${selectedVariant ? `${selectedVariant.size} - ` : ''}${currentIndex + 1} of ${displayImages.length}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={isFirstImage}
            loading={isFirstImage ? undefined : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            quality={90}
            onLoad={() => handleImageLoad(currentIndex)}
            onError={() => handleImageError(currentIndex)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            unoptimized={currentImage.startsWith('http') && !currentImage.includes(process.env.NEXT_PUBLIC_VERCEL_URL || '')}
          />
        )}

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
          {displayImages.map((image, index) => {
            const isActive = index === currentIndex;
            const thumbLoading = imageLoading[index];
            const thumbError = imageError[index];

            return (
              <button
                key={`${image}-${index}`}
                onClick={() => goToSlide(index)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${
                    isActive
                      ? 'border-pink-500 ring-2 ring-pink-200 shadow-md'
                      : 'border-gray-200 hover:border-pink-300'
                  }
                `}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Thumbnail Loading State */}
                {thumbLoading && !thumbError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 animate-pulse" />
                )}

                {/* Thumbnail Error State */}
                {thumbError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                    <span className="text-2xl">🐻</span>
                  </div>
                )}

                {/* Thumbnail Image */}
                {!thumbError && (
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1} of ${displayImages.length}`}
                    fill
                    className={`object-cover transition-opacity duration-200 ${
                      thumbLoading ? 'opacity-0' : 'opacity-100'
                    } ${isActive ? 'scale-105' : ''}`}
                    loading="lazy"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12.5vw, 150px"
                    quality={75}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    unoptimized={image.startsWith('http') && !image.includes(process.env.NEXT_PUBLIC_VERCEL_URL || '')}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
