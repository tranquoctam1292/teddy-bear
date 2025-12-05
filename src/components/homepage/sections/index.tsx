// Homepage Section Components Registry
// NOTE: This file exports both Server and Client Components
// Server Components (FeaturedProducts, ProductGrid, BlogPosts) have 'server-only' directive
// Client Components (HeroSlider, Newsletter, etc.) have 'use client' directive
//
// IMPORTANT: Server Components with 'server-only' are lazy-loaded to prevent
// client-side bundling issues. They are imported dynamically in getSectionComponent.
import { SectionType } from '@/lib/types/homepage';
import { HeroBanner } from './hero-banner';
import { HeroSlider } from './hero-slider';
// Client Components - safe to import directly
import { Testimonials } from './Testimonials';
import { FeaturesList } from './FeaturesList';
import { CTABanner } from './CTABanner';
import { Newsletter } from './Newsletter';
import { VideoEmbed } from './VideoEmbed';
import { ImageGallery } from './ImageGallery';
import { CountdownTimer } from './CountdownTimer';
import { SocialFeed } from './SocialFeed';
import { CustomHTML } from './CustomHTML';
import { CategoryShowcase } from './CategoryShowcase';

// Spacer component
const Spacer = () => {
  return <div className="py-8" />;
};

/**
 * Map section types to their components (Client Components only)
 * Server Components are lazy-loaded in getSectionComponent()
 */
const CLIENT_COMPONENTS: Partial<Record<SectionType, React.ComponentType<any>>> = {
  'hero-banner': HeroBanner,
  'hero-slider': HeroSlider,
  'category-showcase': CategoryShowcase,
  testimonials: Testimonials,
  'features-list': FeaturesList,
  'cta-banner': CTABanner,
  newsletter: Newsletter,
  'video-embed': VideoEmbed,
  'image-gallery': ImageGallery,
  'countdown-timer': CountdownTimer,
  'social-feed': SocialFeed,
  'custom-html': CustomHTML,
  spacer: Spacer,
};

/**
 * Get section component by type
 * Server Components (with 'server-only') are lazy-loaded to prevent client bundling
 */
export async function getSectionComponent(
  type: SectionType
): Promise<React.ComponentType<any> | null> {
  // Check client components first
  if (CLIENT_COMPONENTS[type]) {
    return CLIENT_COMPONENTS[type] || null;
  }

  // Lazy load Server Components that use database
  switch (type) {
    case 'featured-products': {
      const { FeaturedProducts } = await import('./FeaturedProducts');
      return FeaturedProducts;
    }
    case 'product-grid': {
      const { ProductGrid } = await import('./ProductGrid');
      return ProductGrid;
    }
    case 'blog-posts': {
      const { BlogPosts } = await import('./BlogPosts');
      return BlogPosts;
    }
    default:
      return null;
  }
}

// Re-export metadata for backward compatibility (Server Components only)
export { SECTION_METADATA, getDefaultSectionContent } from './metadata';
