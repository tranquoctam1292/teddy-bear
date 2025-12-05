// CTA Banner Section Component - Phase 5: Marketing Sections Redesign
// Server Component displaying call-to-action banners
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/homepage/container';
import type { CTAContent } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CTABannerProps {
  content?: CTAContent;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'centered' | 'split';
  background?: 'gradient' | 'solid' | 'image';
  backgroundImage?: string;
}

export function CTABanner({
  content,
  heading,
  description,
  buttonText,
  buttonLink,
  variant = 'centered',
  background = 'gradient',
  backgroundImage,
}: CTABannerProps) {
  // Use content prop or individual props
  const finalHeading = content?.heading || heading || 'Khuyến mãi đặc biệt';
  const finalDescription = content?.description || description;
  const finalButtonText = content?.buttonText || buttonText || 'Mua ngay';
  const finalButtonLink = content?.buttonLink || buttonLink || '/products';
  const finalVariant = content?.variant || variant;
  const finalBackground = content?.background || background;
  const finalBackgroundImage = content?.backgroundImage || backgroundImage;

  return (
    <div
      className={cn(
        'relative py-16 md:py-20 lg:py-24 overflow-hidden',
        finalBackground === 'gradient' &&
          'bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700',
        finalBackground === 'solid' && 'bg-pink-600'
      )}
    >
      {/* Background Image (if provided) */}
      {finalBackground === 'image' && finalBackgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={finalBackgroundImage}
              alt={finalHeading}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 z-0 bg-black/40" />
        </>
      )}

      {/* Content */}
      <Container variant="standard" padding="desktop" className="relative z-10">
        <div
          className={cn(
            'flex flex-col items-center text-center text-white',
            finalVariant === 'split' && 'md:flex-row md:text-left md:justify-between'
          )}
        >
          {/* Text Content */}
          <div
            className={cn(
              'flex-1',
              finalVariant === 'centered' && 'max-w-3xl mx-auto',
              finalVariant === 'split' && 'md:max-w-2xl'
            )}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {finalHeading}
            </h2>
            {finalDescription && (
              <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed">
                {finalDescription}
              </p>
            )}

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Link href={finalButtonLink}>
                {finalButtonText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Split Layout: Image on Right (Desktop only) */}
          {finalVariant === 'split' && finalBackgroundImage && (
            <div className="hidden md:block relative w-full md:w-96 h-64 md:h-80 rounded-2xl overflow-hidden mt-8 md:mt-0 md:ml-8">
              <Image
                src={finalBackgroundImage}
                alt={finalHeading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

