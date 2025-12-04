// Hero Banner Section Component
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroBannerContent } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  content: HeroBannerContent;
  layout: any;
  isPreview?: boolean;
}

export function HeroBanner({ content, layout, isPreview }: HeroBannerProps) {
  return (
    <div className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
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
        {content.overlay?.enabled && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: content.overlay.color || 'rgba(0, 0, 0, 0.4)',
              opacity: content.overlay.opacity || 0.4,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div
          className={cn(
            'max-w-3xl space-y-6',
            content.textAlign === 'center' && 'mx-auto text-center',
            content.textAlign === 'right' && 'ml-auto text-right'
          )}
          style={{ color: content.textColor || 'white' }}
        >
          {/* Heading */}
          {content.heading && (
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {content.heading}
            </h1>
          )}

          {/* Subheading */}
          {content.subheading && (
            <h2 className="text-xl font-medium sm:text-2xl md:text-3xl opacity-90">
              {content.subheading}
            </h2>
          )}

          {/* Description */}
          {content.description && (
            <p className="text-lg opacity-80">{content.description}</p>
          )}

          {/* CTA Buttons */}
          {(content.primaryButton || content.secondaryButton) && (
            <div
              className={cn(
                'flex flex-wrap gap-4',
                content.textAlign === 'center' && 'justify-center',
                content.textAlign === 'right' && 'justify-end'
              )}
            >
              {content.primaryButton && (
                <Button
                  asChild
                  size="lg"
                  variant={content.primaryButton.style || 'default'}
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
                  variant={content.secondaryButton.style || 'outline'}
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
      </div>
    </div>
  );
}

