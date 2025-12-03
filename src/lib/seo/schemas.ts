/**
 * SEO Schema Markup Helpers
 * Generate JSON-LD structured data for Schema.org
 */

export interface ProductSchema {
  '@context': string;
  '@type': 'Product';
  name: string;
  description: string;
  image: string | string[];
  sku?: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: OfferSchema | OfferSchema[];
  aggregateRating?: AggregateRatingSchema;
}

export interface OfferSchema {
  '@type': 'Offer';
  price: string | number;
  priceCurrency: string;
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
  url?: string;
  priceValidUntil?: string;
  itemCondition?: 'https://schema.org/NewCondition';
  seller?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: string | number;
  reviewCount: string | number;
  bestRating?: string | number;
  worstRating?: string | number;
}

export interface BlogPostingSchema {
  '@context': string;
  '@type': 'BlogPosting';
  headline: string;
  image?: string | string[];
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface BreadcrumbListSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface LocalBusinessSchema {
  '@context': string;
  '@type': 'LocalBusiness';
  name: string;
  image?: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  email?: string;
  url?: string;
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange?: string;
}

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType?: string;
    email?: string;
    areaServed?: string | string[];
  };
}

/**
 * Generate Product Schema
 */
export function generateProductSchema(
  product: {
    name: string;
    description: string;
    images: string[];
    sku?: string;
    variants: Array<{
      id: string;
      price: number;
      stock: number;
    }>;
    rating?: number;
    reviewCount?: number;
  },
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): ProductSchema {
  const mainImage = product.images[0] || '';
  const absoluteImage = mainImage.startsWith('http') 
    ? mainImage 
    : `${baseUrl}${mainImage}`;

  // Get lowest price variant
  const lowestPriceVariant = product.variants.reduce((min, v) => 
    v.price < min.price ? v : min, product.variants[0]
  );

  // Determine availability
  const hasStock = product.variants.some(v => v.stock > 0);
  const availability = hasStock 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock';

  const offer: OfferSchema = {
    '@type': 'Offer',
    price: lowestPriceVariant.price.toString(),
    priceCurrency: 'VND',
    availability: availability as OfferSchema['availability'],
    url: `${baseUrl}/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'The Emotional House',
    },
  };

  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: absoluteImage,
    brand: {
      '@type': 'Brand',
      name: 'The Emotional House',
    },
    offers: offer,
  };

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * Generate BlogPosting Schema
 */
export function generateBlogPostingSchema(
  post: {
    title: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    author?: string;
    publishedAt?: Date;
    updatedAt?: Date;
  },
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn',
  slug: string
): BlogPostingSchema {
  const publishedDate = post.publishedAt || new Date();
  const modifiedDate = post.updatedAt || publishedDate;

  const schema: BlogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    author: {
      '@type': 'Organization',
      name: post.author || 'The Emotional House',
    },
    datePublished: publishedDate.toISOString(),
    dateModified: modifiedDate.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'The Emotional House',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
  };

  if (post.featuredImage) {
    const absoluteImage = post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${baseUrl}${post.featuredImage}`;
    schema.image = absoluteImage;
  }

  return schema;
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbListSchema(
  items: Array<{ name: string; url?: string }>,
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn'
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`) : undefined,
    })),
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema(
  store: {
    name: string;
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    country?: string;
    lat?: number;
    lng?: number;
    phone?: string;
    email?: string;
    url?: string;
    openingHours?: string;
    image?: string;
  },
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn'
): LocalBusinessSchema {
  const addressParts = store.address.split(',').map(s => s.trim());
  
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressParts[0] || store.address,
      addressLocality: store.city,
      addressCountry: store.country || 'VN',
    },
  };

  if (store.region) {
    schema.address.addressRegion = store.region;
  }
  if (store.postalCode) {
    schema.address.postalCode = store.postalCode;
  }

  if (store.lat && store.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: store.lat,
      longitude: store.lng,
    };
  }

  if (store.phone) {
    schema.telephone = store.phone;
  }

  if (store.email) {
    schema.email = store.email;
  }

  if (store.url) {
    schema.url = store.url;
  }

  // Parse opening hours (simple format: "9:00 - 22:00 (Tất cả các ngày trong tuần)")
  if (store.openingHours) {
    const hoursMatch = store.openingHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (hoursMatch) {
      schema.openingHoursSpecification = [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: `${hoursMatch[1]}:${hoursMatch[2]}`,
        closes: `${hoursMatch[3]}:${hoursMatch[4]}`,
      }];
    }
  }

  if (store.image) {
    const absoluteImage = store.image.startsWith('http')
      ? store.image
      : `${baseUrl}${store.image}`;
    schema.image = absoluteImage;
  }

  return schema;
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(
  org: {
    name: string;
    url: string;
    logo?: string;
    socialMedia?: string[];
    contactPoint?: {
      telephone?: string;
      email?: string;
      contactType?: string;
      areaServed?: string | string[];
    };
  },
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn'
): OrganizationSchema {
  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
  };

  if (org.logo) {
    const absoluteLogo = org.logo.startsWith('http')
      ? org.logo
      : `${baseUrl}${org.logo}`;
    schema.logo = absoluteLogo;
  }

  if (org.socialMedia && org.socialMedia.length > 0) {
    schema.sameAs = org.socialMedia;
  }

  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...org.contactPoint,
    };
  }

  return schema;
}

