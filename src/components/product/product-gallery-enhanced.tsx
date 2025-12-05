'use client';

/**
 * Product Gallery Enhanced
 * Gallery nâng cấp với zoom, video, 360 view
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, RotateCw, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product, ProductVariant } from '@/lib/schemas/product';

interface ProductGalleryEnhancedProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

/**
 * Extract YouTube video ID from URL
 */
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extract Vimeo video ID from URL
 */
function getVimeoVideoId(url: string): string | null {
  const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function ProductGalleryEnhanced({
  product,
  selectedVariant,
}: ProductGalleryEnhancedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);
  const [current360Index, setCurrent360Index] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Compute display images
  const displayImages = (() => {
    if (selectedVariant?.image) {
      const variantImageIndex = product.images.findIndex(
        (img) => img === selectedVariant.image
      );
      if (variantImageIndex !== -1) {
        return [
          selectedVariant.image,
          ...product.images.filter((img) => img !== selectedVariant.image),
        ];
      }
      return [selectedVariant.image, ...product.images];
    }
    return product.images;
  })();

  // Reset to first image when variant changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedVariant?.id]);

  // Handle image zoom on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  // Video URL handling
  const videoUrl = product.videoUrl;
  const videoThumbnail = product.videoThumbnail || product.images[0];
  const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
  const isVimeo = videoUrl?.includes('vimeo.com');
  const videoId = videoUrl
    ? isYouTube
      ? getYouTubeVideoId(videoUrl)
      : isVimeo
        ? getVimeoVideoId(videoUrl)
        : null
    : null;

  // 360 images
  const images360 = product.images360 || [];

  // Get embed URL for video
  const getVideoEmbedUrl = (): string | null => {
    if (!videoId) return null;
    if (isYouTube) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (isVimeo) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return null;
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const next360Image = () => {
    setCurrent360Index((prev) => (prev + 1) % images360.length);
  };

  const prev360Image = () => {
    setCurrent360Index((prev) => (prev - 1 + images360.length) % images360.length);
  };

  return (
    <>
      <div className="relative">
        {/* Main Image with Zoom */}
        <div
          ref={imageRef}
          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {displayImages[currentIndex] && (
            <Image
              src={displayImages[currentIndex]}
              alt={`${product.name} - Ảnh ${currentIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
              priority={currentIndex === 0}
            />
          )}

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <ZoomIn className="w-3 h-3" />
              Di chuột để zoom
            </div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Video Thumbnail Overlay */}
          {videoUrl && videoThumbnail && currentIndex === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white/90 hover:bg-white rounded-full p-4 shadow-xl transition-all hover:scale-110"
                aria-label="Xem video"
              >
                <Play className="w-12 h-12 text-pink-600 fill-pink-600" />
              </button>
            </div>
          )}

          {/* 360 View Button */}
          {images360.length > 0 && (
            <button
              onClick={() => setIs360ModalOpen(true)}
              className="absolute bottom-4 right-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
              aria-label="Xem 360 độ"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-sm font-medium">Xem 360°</span>
            </button>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? 'border-pink-600 ring-2 ring-pink-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Video giới thiệu sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black">
            {getVideoEmbedUrl() ? (
              <iframe
                src={getVideoEmbedUrl() || ''}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Product Video"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <p>Không thể tải video</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 360 View Modal */}
      <Dialog open={is360ModalOpen} onOpenChange={setIs360ModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Xem 360 độ ({current360Index + 1}/{images360.length})</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square bg-gray-100">
            {images360[current360Index] && (
              <Image
                src={images360[current360Index]}
                alt={`${product.name} - 360 độ ${current360Index + 1}`}
                fill
                className="object-contain"
              />
            )}

            {/* 360 Navigation */}
            {images360.length > 1 && (
              <>
                <button
                  onClick={prev360Image}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next360Image}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* 360 Thumbnails */}
            {images360.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg p-2">
                {images360.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent360Index(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      current360Index === index
                        ? 'bg-pink-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Xem ảnh 360 ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

