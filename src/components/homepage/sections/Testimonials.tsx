// Testimonials Section Component - Phase 4: Content Sections Redesign
// Server Component displaying customer reviews with rating stars
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { Testimonial } from '@/lib/mock-data';
import { TESTIMONIALS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface TestimonialsProps {
  heading?: string;
  subheading?: string;
  limit?: number;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-5 h-5',
              i < testimonial.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-6 leading-relaxed line-clamp-4">
        &quot;{testimonial.comment}&quot;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          {testimonial.role && (
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({
  heading = 'Khách hàng nói gì về chúng tôi',
  subheading = 'Những đánh giá chân thực từ khách hàng đã mua sắm',
  limit = 3,
}: TestimonialsProps) {
  const testimonials = TESTIMONIALS.slice(0, limit);

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={heading}
        subheading={subheading}
        alignment="center"
      />

      {/* Testimonials Grid */}
      <div
        className={cn(
          'grid gap-6',
          'grid-cols-1', // Mobile: 1 column (stack)
          'md:grid-cols-2', // Tablet: 2 columns
          'lg:grid-cols-3' // Desktop: 3 columns
        )}
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Container>
  );
}
