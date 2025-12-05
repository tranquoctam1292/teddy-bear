// Features List Section Component - Phase 4: Content Sections Redesign
// Server Component displaying trust-building features
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { Feature } from '@/lib/mock-data';
import { FEATURES } from '@/lib/mock-data';
import { Truck, RefreshCw, Shield, Headphones, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturesListProps {
  heading?: string;
  subheading?: string;
  limit?: number;
}

// Icon mapping for features
const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  RefreshCw,
  Shield,
  Headphones,
};

function FeatureCard({ feature }: { feature: Feature }) {
  const IconComponent = ICON_MAP[feature.icon] || Truck;

  return (
    <div className="group text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
        <IconComponent className="w-8 h-8 text-pink-600" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export function FeaturesList({
  heading = 'Tại sao chọn chúng tôi?',
  subheading = 'Cam kết mang đến trải nghiệm mua sắm tốt nhất',
  limit = 4,
}: FeaturesListProps) {
  const features = FEATURES.slice(0, limit);

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader heading={heading} subheading={subheading} alignment="center" />

      {/* Features Grid */}
      <div
        className={cn(
          'grid gap-6',
          'grid-cols-1', // Mobile: 1 column
          'md:grid-cols-2', // Tablet: 2 columns
          'lg:grid-cols-4' // Desktop: 4 columns
        )}
      >
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </Container>
  );
}
