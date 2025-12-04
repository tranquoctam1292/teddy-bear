// Image Gallery Section Component
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryContent {
  heading?: string;
  subheading?: string;
  images: GalleryImage[];
  layout: 'grid' | 'masonry' | 'slider';
  columns?: number; // 2, 3, 4, 5
  gap?: 'sm' | 'md' | 'lg';
  enableLightbox?: boolean;
}

export function ImageGallery({
  content,
  layout,
  isPreview,
}: SectionComponentProps<ImageGalleryContent>) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const images = content.images || [];
  const layoutType = content.layout || 'grid';
  const columns = content.columns || 3;
  const gap = content.gap || 'md';
  const enableLightbox = content.enableLightbox !== false;

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  if (images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No images configured</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center mb-12">
          {content.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      <div
        className={cn(
          'grid',
          gapClass,
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          columns === 5 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {enableLightbox && selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-7xl max-h-[90vh] mx-auto px-16">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
            />
            {images[selectedImage].caption && (
              <p className="text-white text-center mt-4">
                {images[selectedImage].caption}
              </p>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

