// Age Recommendation Section Component - Phase 9: Visual Storytelling & Age Recommendations
// Server Component displaying age-based product recommendations
import Link from 'next/link';
import { Baby, User, Users, CheckCircle2, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import { Button } from '@/components/ui/button';
import type { AgeGroup } from '@/lib/mock-data';
import { AGE_GROUPS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface AgeRecommendationProps {
  heading?: string;
  subheading?: string;
}

// Icon mapping for age groups
const ICON_MAP: Record<string, LucideIcon> = {
  Baby,
  Child: User, // 'Child' doesn't exist in lucide-react, use 'User' instead
  Users,
};

function AgeGroupCard({ ageGroup }: { ageGroup: AgeGroup }) {
  const IconComponent = ICON_MAP[ageGroup.icon] || Users;

  // Color scheme based on age range
  const colorScheme = {
    '0-3': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    '3-6': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100 text-green-600',
      button: 'bg-green-600 hover:bg-green-700 text-white',
    },
    '6+': {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100 text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  };

  const colors =
    colorScheme[ageGroup.ageRange as keyof typeof colorScheme] ||
    colorScheme['6+'];

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg',
        colors.bg,
        colors.border
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full',
            colors.icon
          )}
        >
          <IconComponent className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {ageGroup.ageRange}
            </span>
            <span className="text-xs font-semibold text-gray-500">tuổi</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{ageGroup.name}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        {ageGroup.description}
      </p>

      {/* Safety Features */}
      <div className="space-y-2 mb-6">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Đặc điểm an toàn:
        </p>
        <ul className="space-y-2">
          {ageGroup.safetyFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Button
        asChild
        className={cn('w-full', colors.button)}
        size="sm"
      >
        <Link href={`/products?age=${ageGroup.ageRange}`}>
          Xem gấu cho bé {ageGroup.ageRange} tuổi
        </Link>
      </Button>
    </div>
  );
}

export function AgeRecommendation({
  heading = 'Chọn Gấu Bông Theo Độ Tuổi',
  subheading = 'An toàn và phù hợp cho mọi lứa tuổi',
}: AgeRecommendationProps) {
  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={heading}
        subheading={subheading}
        alignment="center"
      />

      {/* Age Groups Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {AGE_GROUPS.map((ageGroup) => (
          <AgeGroupCard key={ageGroup.id} ageGroup={ageGroup} />
        ))}
      </div>
    </Container>
  );
}

