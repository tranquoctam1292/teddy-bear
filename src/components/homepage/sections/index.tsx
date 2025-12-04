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

/**
 * Section type metadata
 */
export const SECTION_METADATA: Record<SectionType, {
  name: string;
  description: string;
  icon: string;
  category: 'hero' | 'products' | 'content' | 'marketing' | 'misc';
}> = {
  'hero-banner': {
    name: 'Hero Banner',
    description: 'Large banner with image, heading, and CTA',
    icon: '🎨',
    category: 'hero',
  },
  'hero-slider': {
    name: 'Hero Slider',
    description: 'Rotating hero banners',
    icon: '🎠',
    category: 'hero',
  },
  'featured-products': {
    name: 'Featured Products',
    description: 'Showcase selected products',
    icon: '⭐',
    category: 'products',
  },
  'product-grid': {
    name: 'Product Grid',
    description: 'Grid of products with filters',
    icon: '📦',
    category: 'products',
  },
  'category-showcase': {
    name: 'Category Showcase',
    description: 'Display product categories with images',
    icon: '🗂️',
    category: 'products',
  },
  'blog-posts': {
    name: 'Blog Posts',
    description: 'Recent or featured blog posts',
    icon: '📝',
    category: 'content',
  },
  'testimonials': {
    name: 'Testimonials',
    description: 'Customer reviews and testimonials',
    icon: '💬',
    category: 'marketing',
  },
  'features-list': {
    name: 'Features List',
    description: 'List of features with icons',
    icon: '✨',
    category: 'content',
  },
  'cta-banner': {
    name: 'CTA Banner',
    description: 'Call-to-action banner',
    icon: '📢',
    category: 'marketing',
  },
  'newsletter': {
    name: 'Newsletter Signup',
    description: 'Email subscription form',
    icon: '📧',
    category: 'marketing',
  },
  'video-embed': {
    name: 'Video Embed',
    description: 'Embed YouTube or Vimeo video',
    icon: '🎥',
    category: 'content',
  },
  'image-gallery': {
    name: 'Image Gallery',
    description: 'Grid or slider of images',
    icon: '🖼️',
    category: 'content',
  },
  'countdown-timer': {
    name: 'Countdown Timer',
    description: 'Countdown to event or sale',
    icon: '⏰',
    category: 'marketing',
  },
  'social-feed': {
    name: 'Social Feed',
    description: 'Instagram or social media feed',
    icon: '📱',
    category: 'marketing',
  },
  'custom-html': {
    name: 'Custom HTML',
    description: 'Custom HTML/CSS/JS code',
    icon: '💻',
    category: 'misc',
  },
  'spacer': {
    name: 'Spacer',
    description: 'Add vertical spacing',
    icon: '⬜',
    category: 'misc',
  },
};

/**
 * Get default content for section type
 */
export function getDefaultSectionContent(type: SectionType): any {
  const defaults: Record<SectionType, any> = {
    'hero-banner': {
      heading: 'Welcome to Our Store',
      subheading: 'Find amazing products at great prices',
      description: '',
      image: '/images/hero-placeholder.jpg',
      imageAlt: 'Hero image',
      textAlign: 'center',
      overlay: {
        enabled: true,
        opacity: 0.4,
      },
    },
    'featured-products': {
      heading: 'Featured Products',
      subheading: 'Check out our best sellers',
      productSelection: 'automatic',
      sortBy: 'popular',
      limit: 8,
      columns: 4,
      showPrice: true,
      showRating: true,
      showAddToCart: true,
    },
    'category-showcase': {
      heading: 'Shop by Category',
      subheading: 'Find what you need',
      categories: [],
      layout: 'grid',
      columns: 4,
      showCount: true,
    },
    'blog-posts': {
      heading: 'Latest from Our Blog',
      subheading: 'Tips, guides, and inspiration',
      postSelection: 'recent',
      limit: 6,
      layout: 'grid',
      columns: 3,
      showExcerpt: true,
      showAuthor: true,
      showDate: true,
      showImage: true,
    },
    'cta-banner': {
      heading: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today',
      button: {
        text: 'Shop Now',
        link: '/products',
        style: 'primary',
      },
      textAlign: 'center',
    },
    // Other types use same defaults for now
    'hero-slider': {},
    'product-grid': {},
    'testimonials': {},
    'features-list': {},
    'newsletter': {},
    'video-embed': {},
    'image-gallery': {},
    'countdown-timer': {},
    'social-feed': {},
    'custom-html': {},
    'spacer': {},
  };

  return defaults[type] || {};
}

async function getPosts(content: BlogPostsContent) {
  const { posts } = await getCollections();

  let query: any = { status: 'published' };
  const limit = content.limit || 6;

  // Build query
  switch (content.postSelection) {
    case 'featured':
      query.featured = true;
      break;
    case 'category':
      if (content.category) {
        query.category = content.category;
      }
      break;
    case 'manual':
      if (content.postIds && content.postIds.length > 0) {
        query._id = { $in: content.postIds };
      }
      break;
  }

  return await posts
    .find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
}

