// Features List Section Component
import Image from 'next/image';
import { 
  Check, 
  Star, 
  Heart, 
  Zap, 
  Shield, 
  Truck, 
  Clock,
  Award,
  Users,
  ThumbsUp,
  Package,
  Headphones
} from 'lucide-react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

// Icon mapping
const ICON_MAP: Record<string, any> = {
  check: Check,
  star: Star,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  truck: Truck,
  clock: Clock,
  award: Award,
  users: Users,
  thumbsup: ThumbsUp,
  package: Package,
  headphones: Headphones,
};

interface Feature {
  id: string;
  icon?: string; // Icon name or image URL
  title: string;
  description: string;
  highlight?: boolean; // Feature emphasis
}

interface FeaturesListContent {
  heading?: string;
  subheading?: string;
  features: Feature[];
  layout: 'grid' | 'list' | 'columns';
  columns?: number; // For grid layout
  iconStyle?: 'outlined' | 'filled' | 'rounded' | 'circle';
  iconColor?: string;
  showNumbers?: boolean; // Show 1, 2, 3... instead of icons
}

export function FeaturesList({
  content,
  layout,
  isPreview,
}: SectionComponentProps<FeaturesListContent>) {
  const features = content.features || [];
  const layoutType = content.layout || 'grid';
  const columns = content.columns || 3;
  const iconStyle = content.iconStyle || 'circle';
  const iconColor = content.iconColor || '#ec4899'; // Pink
  const showNumbers = content.showNumbers || false;

  if (features.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No features configured</p>
      </div>
    );
  }

  return (
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

      {/* Features - Grid Layout */}
      {layoutType === 'grid' && (
        <div
          className={cn(
            'grid gap-8',
            columns === 2 && 'grid-cols-1 md:grid-cols-2',
            columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              iconStyle={iconStyle}
              iconColor={iconColor}
              showNumbers={showNumbers}
            />
          ))}
        </div>
      )}

      {/* Features - List Layout */}
      {layoutType === 'list' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {features.map((feature, index) => (
            <FeatureListItem
              key={feature.id}
              feature={feature}
              index={index}
              iconStyle={iconStyle}
              iconColor={iconColor}
              showNumbers={showNumbers}
            />
          ))}
        </div>
      )}

      {/* Features - Columns Layout (Two column with alternating) */}
      {layoutType === 'columns' && (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              iconStyle={iconStyle}
              iconColor={iconColor}
              showNumbers={showNumbers}
              horizontal
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  feature,
  index,
  iconStyle,
  iconColor,
  showNumbers,
  horizontal = false,
}: {
  feature: Feature;
  index: number;
  iconStyle: string;
  iconColor: string;
  showNumbers: boolean;
  horizontal?: boolean;
}) {
  const IconComponent = feature.icon ? ICON_MAP[feature.icon.toLowerCase()] : Star;

  return (
    <div
      className={cn(
        'group transition-all',
        feature.highlight && 'bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 shadow-md',
        horizontal ? 'flex items-start gap-4' : 'text-center'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'inline-flex items-center justify-center transition-transform group-hover:scale-110',
          !horizontal && 'mx-auto mb-4',
          iconStyle === 'circle' && 'rounded-full bg-pink-100 p-4',
          iconStyle === 'rounded' && 'rounded-lg bg-pink-100 p-4',
          iconStyle === 'filled' && 'rounded-full p-4',
          iconStyle === 'outlined' && 'p-4'
        )}
        style={{
          backgroundColor: iconStyle === 'filled' ? iconColor : undefined,
          borderColor: iconStyle === 'outlined' ? iconColor : undefined,
          borderWidth: iconStyle === 'outlined' ? '2px' : undefined,
        }}
      >
        {showNumbers ? (
          <span
            className="text-2xl font-bold"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          >
            {index + 1}
          </span>
        ) : IconComponent ? (
          <IconComponent
            className="w-8 h-8"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          />
        ) : (
          <Star
            className="w-8 h-8"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          />
        )}
      </div>

      {/* Content */}
      <div className={cn(!horizontal && 'text-center', 'flex-1')}>
        <h3 className={cn(
          'font-semibold text-gray-900 mb-2',
          feature.highlight ? 'text-xl' : 'text-lg'
        )}>
          {feature.title}
        </h3>
        <p className="text-gray-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// Feature List Item Component
function FeatureListItem({
  feature,
  index,
  iconStyle,
  iconColor,
  showNumbers,
}: {
  feature: Feature;
  index: number;
  iconStyle: string;
  iconColor: string;
  showNumbers: boolean;
}) {
  const IconComponent = feature.icon ? ICON_MAP[feature.icon.toLowerCase()] : Check;

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-gray-50',
        feature.highlight && 'bg-gradient-to-r from-pink-50 to-purple-50 shadow-sm'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-12 h-12 flex items-center justify-center',
          iconStyle === 'circle' && 'rounded-full bg-pink-100',
          iconStyle === 'rounded' && 'rounded-lg bg-pink-100'
        )}
        style={{
          backgroundColor: iconStyle === 'filled' ? iconColor : undefined,
        }}
      >
        {showNumbers ? (
          <span
            className="text-lg font-bold"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          >
            {index + 1}
          </span>
        ) : IconComponent ? (
          <IconComponent
            className="w-6 h-6"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          />
        ) : (
          <Check
            className="w-6 h-6"
            style={{ color: iconStyle === 'filled' ? '#ffffff' : iconColor }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

