// Section Header Component - Phase 1: Foundation
// Standardized header for homepage sections with consistent styling
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SectionHeaderAlignment = 'left' | 'center' | 'right';

interface SectionHeaderProps {
  heading: string;
  subheading?: string;
  alignment?: SectionHeaderAlignment;
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  badge?: string;
  className?: string;
}

export function SectionHeader({
  heading,
  subheading,
  alignment = 'left',
  showViewAll = false,
  viewAllLink = '/products',
  viewAllText = 'Xem tất cả',
  badge,
  className,
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('w-full mb-8 md:mb-12', className)}>
      {/* Badge */}
      {badge && (
        <div className={cn('mb-2', alignmentClasses[alignment])}>
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
            {badge}
          </span>
        </div>
      )}

      {/* Header Content with View All Link */}
      {showViewAll ? (
        <div
          className={cn(
            'flex flex-col gap-4',
            alignment === 'center' && 'items-center',
            alignment === 'left' && 'items-start',
            alignment === 'right' && 'items-end'
          )}
        >
          {/* Title and Subtitle - Always respect alignment */}
          <div className={cn('w-full', alignmentClasses[alignment])}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-2 text-lg text-gray-600 leading-relaxed">{subheading}</p>
            )}
          </div>
          {/* View All Link - Position based on alignment */}
          <Link
            href={viewAllLink}
            className={cn(
              'flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors flex-shrink-0',
              alignment === 'center' && 'mx-auto',
              alignment === 'left' && 'ml-auto',
              alignment === 'right' && 'mr-auto'
            )}
            aria-label={`${viewAllText} - ${heading}`}
          >
            {viewAllText}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className={cn('w-full', alignmentClasses[alignment])}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{heading}</h2>
          {subheading && <p className="mt-2 text-lg text-gray-600 leading-relaxed">{subheading}</p>}
        </div>
      )}
    </div>
  );
}
