// Testimonials Section Component
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  role?: string; // "Customer", "Verified Buyer", etc
  avatar?: string;
  rating: number; // 1-5
  content: string;
  date?: string;
  productName?: string; // Optional: which product they bought
}

interface TestimonialsContent {
  heading?: string;
  subheading?: string;
  testimonials: Testimonial[];
  layout: 'grid' | 'slider' | 'single';
  columns?: number; // For grid layout
  showRating?: boolean;
  showAvatar?: boolean;
  showDate?: boolean;
  backgroundColor?: string;
}

export function Testimonials({
  content,
  layout,
  isPreview,
}: SectionComponentProps<TestimonialsContent>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = content.testimonials || [];
  const layoutType = content.layout || 'grid';
  const columns = content.columns || 3;
  const showRating = content.showRating !== false;
  const showAvatar = content.showAvatar !== false;
  const showDate = content.showDate !== false;

  if (testimonials.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No testimonials configured</p>
      </div>
    );
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div 
      className="py-16" 
      style={{ backgroundColor: content.backgroundColor || '#f9fafb' }}
    >
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

        {/* Testimonials - Grid Layout */}
        {layoutType === 'grid' && (
          <div
            className={cn(
              'grid gap-6',
              columns === 1 && 'grid-cols-1',
              columns === 2 && 'grid-cols-1 md:grid-cols-2',
              columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            )}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                showRating={showRating}
                showAvatar={showAvatar}
                showDate={showDate}
              />
            ))}
          </div>
        )}

        {/* Testimonials - Slider Layout */}
        {layoutType === 'slider' && (
          <div className="relative max-w-4xl mx-auto">
            <TestimonialCard
              testimonial={testimonials[currentIndex]}
              showRating={showRating}
              showAvatar={showAvatar}
              showDate={showDate}
              large
            />

            {/* Navigation */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentIndex
                          ? 'bg-gray-800 w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Testimonials - Single Layout */}
        {layoutType === 'single' && (
          <div className="max-w-3xl mx-auto">
            <TestimonialCard
              testimonial={testimonials[0]}
              showRating={showRating}
              showAvatar={showAvatar}
              showDate={showDate}
              large
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
  showRating,
  showAvatar,
  showDate,
  large = false,
}: {
  testimonial: Testimonial;
  showRating: boolean;
  showAvatar: boolean;
  showDate: boolean;
  large?: boolean;
}) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md p-6 relative',
      large && 'p-8'
    )}>
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-gray-200">
        <Quote className={cn('fill-current', large ? 'w-12 h-12' : 'w-8 h-8')} />
      </div>

      {/* Rating */}
      {showRating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-5 h-5',
                i < testimonial.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              )}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <blockquote className={cn(
        'text-gray-700 mb-6 relative z-10',
        large ? 'text-lg' : 'text-base'
      )}>
        "{testimonial.content}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {showAvatar && testimonial.avatar && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div>
          <div className={cn(
            'font-semibold text-gray-900',
            large && 'text-lg'
          )}>
            {testimonial.name}
          </div>
          {testimonial.role && (
            <div className="text-sm text-gray-600">{testimonial.role}</div>
          )}
          {showDate && testimonial.date && (
            <div className="text-xs text-gray-500 mt-1">{testimonial.date}</div>
          )}
        </div>
      </div>

      {/* Product Name (if any) */}
      {testimonial.productName && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            About: <span className="font-medium">{testimonial.productName}</span>
          </span>
        </div>
      )}
    </div>
  );
}

