// Hero Slider Section Component
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  heading: string;
  subheading?: string;
  description?: string;
  image: string;
  imageAlt: string;
  imageMobile?: string;
  primaryButton?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline';
    openInNewTab?: boolean;
  };
  secondaryButton?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline';
    openInNewTab?: boolean;
  };
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

interface HeroSliderContent {
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number; // milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  transition?: 'fade' | 'slide';
}

export function HeroSlider({
  content,
  layout,
  isPreview,
}: SectionComponentProps<HeroSliderContent>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.slides || [];
  
  const autoplay = content.autoplay !== false; // default true
  const interval = content.autoplayInterval || 5000;
  const showDots = content.showDots !== false;
  const showArrows = content.showArrows !== false;

  // Autoplay
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <div className="relative bg-gray-100 py-20 text-center">
        <p className="text-gray-500">No slides configured</p>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              
              {/* Overlay */}
              {s.overlay?.enabled && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: s.overlay.color || 'rgba(0, 0, 0, 0.4)',
                    opacity: s.overlay.opacity || 0.4,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={cn(
                    'max-w-3xl',
                    s.textAlign === 'center' && 'mx-auto text-center',
                    s.textAlign === 'right' && 'ml-auto text-right'
                  )}
                  style={{ color: s.textColor || '#ffffff' }}
                >
                  {s.heading && (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in-up">
                      {s.heading}
                    </h1>
                  )}

                  {s.subheading && (
                    <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 opacity-90 animate-fade-in-up animation-delay-100">
                      {s.subheading}
                    </h2>
                  )}

                  {s.description && (
                    <p className="text-lg md:text-xl mb-8 opacity-80 animate-fade-in-up animation-delay-200">
                      {s.description}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  {(s.primaryButton || s.secondaryButton) && (
                    <div className={cn(
                      'flex flex-wrap gap-4 animate-fade-in-up animation-delay-300',
                      s.textAlign === 'center' && 'justify-center',
                      s.textAlign === 'right' && 'justify-end'
                    )}>
                      {s.primaryButton && (
                        <Button asChild size="lg" variant={s.primaryButton.style || 'default'}>
                          <Link
                            href={s.primaryButton.link}
                            target={s.primaryButton.openInNewTab ? '_blank' : undefined}
                          >
                            {s.primaryButton.text}
                          </Link>
                        </Button>
                      )}

                      {s.secondaryButton && (
                        <Button asChild size="lg" variant={s.secondaryButton.style || 'outline'}>
                          <Link
                            href={s.secondaryButton.link}
                            target={s.secondaryButton.openInNewTab ? '_blank' : undefined}
                          >
                            {s.secondaryButton.text}
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-30 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}

