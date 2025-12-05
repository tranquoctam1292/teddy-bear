// Hero Slider Section Component - Phase 2: Hero Sections Redesign
// Enhanced Hero Slider with navigation dots, autoplay, pause on hover, and smooth transitions
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/homepage/container';
import type { SectionComponentProps } from '@/lib/types/homepage';
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

export function HeroSlider(
  props: SectionComponentProps<HeroSliderContent> | { content: HeroSliderContent }
) {
  const { content } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = content.slides || [];

  const autoplay = content.autoplay !== false; // default true
  const interval = content.autoplayInterval || 5000;
  const showDots = content.showDots !== false; // default true
  const showArrows = content.showArrows !== false; // default true
  const transition = content.transition || 'fade';

  // Autoplay with pause on hover
  useEffect(() => {
    if (!autoplay || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length, isPaused]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (slides.length === 0) {
    return (
      <div className="relative bg-gray-100 py-20 text-center">
        <Container variant="standard" padding="desktop">
          <p className="text-gray-500">No slides configured</p>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          const overlayOpacity = s.overlay?.opacity ?? 0.4;
          const overlayColor = s.overlay?.color || 'rgba(0, 0, 0, 0.4)';
          const textColorClass =
            s.textColor === 'dark'
              ? 'text-gray-900'
              : s.textColor === 'light' || !s.textColor
              ? 'text-white'
              : '';

          return (
            <div
              key={s.id}
              className={cn(
                'absolute inset-0',
                transition === 'fade' && 'transition-opacity duration-1000',
                transition === 'slide' && 'transition-transform duration-700 ease-in-out',
                isActive
                  ? transition === 'fade'
                    ? 'opacity-100 z-10'
                    : 'translate-x-0 z-10 opacity-100'
                  : transition === 'fade'
                  ? 'opacity-0 z-0'
                  : index < currentSlide
                  ? '-translate-x-full z-0 opacity-0'
                  : 'translate-x-full z-0 opacity-0'
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
                {s.overlay?.enabled !== false && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: overlayColor,
                      opacity: overlayOpacity,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex items-center">
                <Container variant="full-width" padding="desktop">
                  <div
                    className={cn(
                      'max-w-3xl space-y-6 md:space-y-8',
                      s.textAlign === 'center' && 'mx-auto text-center',
                      s.textAlign === 'right' && 'ml-auto text-right',
                      s.textAlign === 'left' || !s.textAlign ? '' : '',
                      textColorClass
                    )}
                    style={
                      s.textColor && s.textColor !== 'light' && s.textColor !== 'dark'
                        ? { color: s.textColor }
                        : undefined
                    }
                  >
                    {s.heading && (
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        {s.heading}
                      </h1>
                    )}

                    {s.subheading && (
                      <h2 className="text-2xl md:text-3xl font-semibold opacity-90">
                        {s.subheading}
                      </h2>
                    )}

                    {s.description && (
                      <p className="text-lg md:text-xl opacity-80 leading-relaxed">
                        {s.description}
                      </p>
                    )}

                    {/* CTA Buttons */}
                    {(s.primaryButton || s.secondaryButton) && (
                      <div
                        className={cn(
                          'flex flex-col sm:flex-row flex-wrap gap-4',
                          s.textAlign === 'center' && 'justify-center',
                          s.textAlign === 'right' && 'justify-end'
                        )}
                      >
                        {s.primaryButton && (
                          <Button
                            asChild
                            size="lg"
                            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg shadow-lg text-lg font-semibold transition-all hover:shadow-xl"
                          >
                            <Link
                              href={s.primaryButton.link}
                              target={s.primaryButton.openInNewTab ? '_blank' : undefined}
                            >
                              {s.primaryButton.text}
                            </Link>
                          </Button>
                        )}

                        {s.secondaryButton && (
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
                          >
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
                </Container>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                'h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50',
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70 w-3'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Slide Counter (Optional - can be removed if not needed) */}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 z-30 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  );
}
