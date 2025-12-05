// Hero Banner Section Component - Phase 2: Hero Sections Redesign
// Enhanced Hero Banner with improved UX, layout variants, and trust badges
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/homepage/container';
import type { HeroBannerContent } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';
import type { SectionComponentProps } from '@/lib/types/homepage';

interface HeroBannerProps extends Omit<SectionComponentProps<HeroBannerContent>, 'layout'> {
  // Enhanced props from Phase 2 plan
  bannerLayout?: 'centered' | 'left-aligned' | 'split';
  containerWidth?: 'full-width' | 'standard' | 'narrow';
  showTrustBadges?: boolean;
  trustBadges?: string[];
}

export function HeroBanner({
  content,
  bannerLayout,
  containerWidth = 'full-width',
  showTrustBadges = false,
  trustBadges = [],
}: HeroBannerProps) {
  // Determine layout from content or prop
  const layout = bannerLayout || (content.textAlign === 'center' ? 'centered' : 'left-aligned');

  // Text color class based on content or default
  const textColorClass =
    content.textColor === 'dark'
      ? 'text-gray-900'
      : content.textColor === 'light' || !content.textColor
      ? 'text-white'
      : '';

  // Overlay opacity (0-1)
  const overlayOpacity = content.overlay?.opacity ?? 0.4;
  const overlayColor = content.overlay?.color || 'rgba(0, 0, 0, 0.4)';

  return (
    <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay */}
        {content.overlay?.enabled !== false && (
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
      <Container variant={containerWidth} padding="desktop" className="relative z-10">
        <div
          className={cn(
            'space-y-6 md:space-y-8',
            layout === 'centered' && 'mx-auto text-center max-w-4xl',
            layout === 'left-aligned' && 'max-w-3xl',
            layout === 'split' && 'max-w-7xl grid md:grid-cols-2 gap-12 items-center'
          )}
          style={
            content.textColor && content.textColor !== 'light' && content.textColor !== 'dark'
              ? { color: content.textColor }
              : undefined
          }
        >
          {/* Text Content */}
          <div className={cn('flex flex-col', textColorClass)}>
            {/* Heading */}
            {content.heading && (
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
                {content.heading}
              </h1>
            )}

            {/* Subheading */}
            {content.subheading && (
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 opacity-90">
                {content.subheading}
              </h2>
            )}

            {/* Description */}
            {content.description && (
              <p className="text-lg md:text-xl opacity-80 mb-6 md:mb-8 leading-relaxed">
                {content.description}
              </p>
            )}

            {/* Trust Badges */}
            {showTrustBadges && trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
                {trustBadges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            {(content.primaryButton || content.secondaryButton) && (
              <div
                className={cn(
                  'flex flex-col sm:flex-row flex-wrap gap-4',
                  layout === 'centered' && 'justify-center',
                  layout === 'left-aligned' && 'justify-start',
                  layout === 'split' && 'justify-start'
                )}
              >
                {content.primaryButton && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg shadow-lg text-lg font-semibold transition-all hover:shadow-xl"
                  >
                    <Link
                      href={content.primaryButton.link}
                      target={content.primaryButton.openInNewTab ? '_blank' : undefined}
                    >
                      {content.primaryButton.text}
                    </Link>
                  </Button>
                )}

                {content.secondaryButton && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
                  >
                    <Link
                      href={content.secondaryButton.link}
                      target={content.secondaryButton.openInNewTab ? '_blank' : undefined}
                    >
                      {content.secondaryButton.text}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Split Layout: Image on Right (Desktop only) */}
          {layout === 'split' && (
            <div className="hidden md:block relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={content.image}
                alt={content.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
