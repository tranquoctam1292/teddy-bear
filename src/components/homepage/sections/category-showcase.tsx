// Category Showcase Section Component - Phase 7: Category & Emotional Storytelling
// Server Component displaying main product categories
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Smile,
  Sparkles,
  Package,
  Baby,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { Category } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CategoryShowcaseProps {
  heading?: string;
  subheading?: string;
  limit?: number;
  showFeaturedOnly?: boolean;
}

// Icon mapping for categories
const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Smile,
  Sparkles,
  Package,
  Baby,
  Star,
};

function CategoryCard({ category }: { category: Category }) {
  const IconComponent = ICON_MAP[category.icon] || Heart;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block h-full"
      aria-label={`Xem danh mục ${category.name}`}
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {/* Icon Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-md group-hover:bg-pink-100 transition-colors">
              <IconComponent className="w-6 h-6 text-pink-600" />
            </div>
          </div>

          {/* Product Count Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-pink-600 text-white text-xs font-semibold rounded-full shadow-md">
              {category.productCount} sản phẩm
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CategoryShowcase({
  heading = 'Khám Phá Bộ Sưu Tập',
  subheading = 'Tìm người bạn đồng hành hoàn hảo cho bạn',
  limit,
  showFeaturedOnly = false,
}: CategoryShowcaseProps) {
  // Filter categories
  let categories = showFeaturedOnly
    ? CATEGORIES.filter((cat) => cat.featured)
    : CATEGORIES;

  // Apply limit if provided
  if (limit) {
    categories = categories.slice(0, limit);
  }

  if (categories.length === 0) {
    return (
      <Container variant="standard" padding="desktop">
        <p className="text-center text-muted-foreground py-12">
          Không có danh mục nào
        </p>
      </Container>
    );
  }

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={heading}
        subheading={subheading}
        alignment="center"
      />

      {/* Categories Grid */}
      <div
        className={cn(
          'grid gap-4 md:gap-6 items-stretch',
          // Mobile: 2 cols
          'grid-cols-2',
          // Tablet: 3 cols
          'md:grid-cols-3',
          // Desktop: 6 cols (for all 6 categories) or 4 cols (if less)
          categories.length >= 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-4'
        )}
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </Container>
  );
}

