// Homepage Section Components Registry
import { SectionType } from '@/lib/types/homepage';
import { HeroBanner } from './HeroBanner';
import { HeroSlider } from './HeroSlider';
import { FeaturedProducts } from './FeaturedProducts';
import { ProductGrid } from './ProductGrid';
import { CategoryShowcase } from './CategoryShowcase';
import { BlogPosts } from './BlogPosts';
import { Testimonials } from './Testimonials';
import { FeaturesList } from './FeaturesList';
import { CTABanner } from './CTABanner';
import { Newsletter } from './Newsletter';
import { VideoEmbed } from './VideoEmbed';
import { ImageGallery } from './ImageGallery';
import { CountdownTimer } from './CountdownTimer';
import { SocialFeed } from './SocialFeed';
import { CustomHTML } from './CustomHTML';

// Spacer component
const Spacer = () => {
  return <div className="py-8" />;
};

/**
 * Map section types to their components
 * All 15 section types now fully implemented!
 */
export const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<any>> = {
  'hero-banner': HeroBanner,
  'hero-slider': HeroSlider,
  'featured-products': FeaturedProducts,
  'product-grid': ProductGrid,
  'category-showcase': CategoryShowcase,
  'blog-posts': BlogPosts,
  'testimonials': Testimonials,
  'features-list': FeaturesList,
  'cta-banner': CTABanner,
  'newsletter': Newsletter,
  'video-embed': VideoEmbed,
  'image-gallery': ImageGallery,
  'countdown-timer': CountdownTimer,
  'social-feed': SocialFeed,
  'custom-html': CustomHTML,
  'spacer': Spacer,
};

/**
 * Get section component by type
 */
export function getSectionComponent(type: SectionType) {
  return SECTION_COMPONENTS[type] || null;
}

// Re-export metadata for backward compatibility (Server Components only)
export { SECTION_METADATA, getDefaultSectionContent } from './metadata';

