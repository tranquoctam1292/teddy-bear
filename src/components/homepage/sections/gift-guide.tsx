// Gift Guide Section Component - Phase 8: Gift Guide & Product Enhancements
// Server Component displaying occasion-based gift recommendations
import Link from 'next/link';
import Image from 'next/image';
import {
  Cake,
  Heart,
  Flower,
  TreePine,
  Sparkles,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import { Button } from '@/components/ui/button';
import type { GiftOccasion } from '@/lib/mock-data';
import { GIFT_OCCASIONS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface GiftGuideProps {
  heading?: string;
  subheading?: string;
  limit?: number;
}

// Icon mapping for gift occasions
const ICON_MAP: Record<string, LucideIcon> = {
  Cake,
  Heart,
  Flower,
  TreePine,
  Sparkles,
  GraduationCap,
};

function GiftOccasionCard({ occasion }: { occasion: GiftOccasion }) {
  const IconComponent = ICON_MAP[occasion.icon] || Heart;

  return (
    <Link
      href={`/products?occasion=${occasion.slug}`}
      className="group block"
      aria-label={`Xem quà tặng cho ${occasion.name}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={occasion.image}
            alt={occasion.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
          />

          {/* Icon Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center justify-center w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-lg group-hover:bg-pink-100 transition-colors">
              <IconComponent className="w-7 h-7 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
            {occasion.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {occasion.description}
          </p>

          {/* Price Range */}
          {occasion.priceRange && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Khoảng giá:</p>
              <p className="text-sm font-semibold text-pink-600">
                {formatCurrency(occasion.priceRange.min)} -{' '}
                {formatCurrency(occasion.priceRange.max)}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400"
          >
            Xem Gợi Ý
          </Button>
        </div>
      </div>
    </Link>
  );
}

export function GiftGuide({
  heading = 'Tìm Quà Tặng Hoàn Hảo',
  subheading = 'Gợi ý quà tặng theo từng dịp đặc biệt',
  limit,
}: GiftGuideProps) {
  const occasions = limit ? GIFT_OCCASIONS.slice(0, limit) : GIFT_OCCASIONS;

  if (occasions.length === 0) {
    return (
      <Container variant="standard" padding="desktop">
        <p className="text-center text-muted-foreground py-12">
          Không có dịp lễ nào
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

      {/* Gift Occasions Grid */}
      <div
        className={cn(
          'grid gap-4 md:gap-6',
          // Mobile: 2 cols
          'grid-cols-2',
          // Tablet & Desktop: 3 cols
          'md:grid-cols-3'
        )}
      >
        {occasions.map((occasion) => (
          <GiftOccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </div>
    </Container>
  );
}

