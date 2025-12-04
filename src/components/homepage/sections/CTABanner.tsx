// CTA Banner Section Component
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CTABannerContent } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface CTABannerProps {
  content: CTABannerContent;
  layout: any;
  isPreview?: boolean;
}

export function CTABanner({ content, layout, isPreview }: CTABannerProps) {
  return (
    <div
      className="relative py-20 md:py-24"
      style={{
        backgroundColor: content.backgroundColor || 'transparent',
      }}
    >
      {/* Background Image (if provided) */}
      {content.backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={content.backgroundImage}
              alt={content.heading}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Overlay */}
          {content.overlay?.enabled && (
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: content.overlay.color || 'rgba(0, 0, 0, 0.6)',
                opacity: content.overlay.opacity || 0.6,
              }}
            />
          )}
        </>
      )}

      {/* Content */}
      <div className="container relative z-10">
        <div
          className={cn(
            'mx-auto max-w-3xl space-y-6',
            content.textAlign === 'center' && 'text-center',
            content.textAlign === 'right' && 'text-right'
          )}
          style={{ color: content.textColor }}
        >
          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {content.heading}
          </h2>

          {/* Description */}
          {content.description && (
            <p className="text-lg opacity-90">{content.description}</p>
          )}

          {/* CTA Button */}
          <div
            className={cn(
              'flex',
              content.textAlign === 'center' && 'justify-center',
              content.textAlign === 'right' && 'justify-end'
            )}
          >
            <Button
              asChild
              size="lg"
              variant={content.button.style || 'default'}
            >
              <Link
                href={content.button.link}
                target={content.button.openInNewTab ? '_blank' : undefined}
              >
                {content.button.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

