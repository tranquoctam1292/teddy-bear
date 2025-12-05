/**
 * Schema Builder Utilities
 * Provides templates and validation for Schema.org structured data
 */

import type {
  ProductSchema,
  BlogPostingSchema,
  OrganizationSchema,
  LocalBusinessSchema,
  BreadcrumbListSchema,
} from './schemas';

export type SchemaType =
  | 'Product'
  | 'Article'
  | 'BlogPosting'
  | 'Organization'
  | 'LocalBusiness'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'VideoObject'
  | 'Recipe'
  | 'Event';

export interface SchemaTemplate {
  type: SchemaType;
  name: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  template: Record<string, any>;
  example: Record<string, any>;
}

/**
 * Schema Templates
 */
export const SCHEMA_TEMPLATES: Record<SchemaType, SchemaTemplate> = {
  Product: {
    type: 'Product',
    name: 'Product',
    description: 'Schema cho sản phẩm với giá, đánh giá, và thông tin chi tiết',
    requiredFields: ['name', 'description', 'offers'],
    optionalFields: ['image', 'sku', 'brand', 'aggregateRating', 'review'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: '',
      description: '',
      image: '',
      brand: {
        '@type': 'Brand',
        name: '',
      },
      offers: {
        '@type': 'Offer',
        price: '',
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
      },
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Gấu Bông Teddy 1m2',
      description: 'Gấu bông cao cấp, mềm mại, an toàn cho trẻ em',
      image: 'https://example.com/teddy.jpg',
      brand: {
        '@type': 'Brand',
        name: 'The Emotional House',
      },
      offers: {
        '@type': 'Offer',
        price: '500000',
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
      },
    },
  },
  Article: {
    type: 'Article',
    name: 'Article',
    description: 'Schema cho bài viết, tin tức',
    requiredFields: ['headline', 'datePublished'],
    optionalFields: ['author', 'image', 'publisher', 'dateModified'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '',
      datePublished: '',
      author: {
        '@type': 'Person',
        name: '',
      },
      publisher: {
        '@type': 'Organization',
        name: '',
      },
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Cách chọn gấu bông phù hợp',
      datePublished: '2024-01-01T00:00:00Z',
      author: {
        '@type': 'Person',
        name: 'The Emotional House',
      },
    },
  },
  BlogPosting: {
    type: 'BlogPosting',
    name: 'Blog Posting',
    description: 'Schema cho blog post',
    requiredFields: ['headline', 'datePublished'],
    optionalFields: ['author', 'image', 'publisher', 'dateModified'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: '',
      datePublished: '',
      author: {
        '@type': 'Organization',
        name: '',
      },
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Top 10 gấu bông được yêu thích nhất',
      datePublished: '2024-01-01T00:00:00Z',
      author: {
        '@type': 'Organization',
        name: 'The Emotional House',
      },
    },
  },
  Organization: {
    type: 'Organization',
    name: 'Organization',
    description: 'Schema cho tổ chức, công ty',
    requiredFields: ['name', 'url'],
    optionalFields: ['logo', 'sameAs', 'contactPoint'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '',
      url: '',
      logo: '',
      sameAs: [],
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'The Emotional House',
      url: 'https://emotionalhouse.vn',
      logo: 'https://emotionalhouse.vn/logo.png',
      sameAs: [
        'https://facebook.com/emotionalhouse',
        'https://instagram.com/emotionalhouse',
      ],
    },
  },
  LocalBusiness: {
    type: 'LocalBusiness',
    name: 'Local Business',
    description: 'Schema cho cửa hàng địa phương',
    requiredFields: ['name', 'address'],
    optionalFields: ['telephone', 'geo', 'openingHoursSpecification'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: '',
        addressCountry: 'VN',
      },
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'The Emotional House - Chi nhánh Hà Nội',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Đường ABC',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
      telephone: '+84123456789',
    },
  },
  BreadcrumbList: {
    type: 'BreadcrumbList',
    name: 'Breadcrumb List',
    description: 'Schema cho breadcrumb navigation',
    requiredFields: ['itemListElement'],
    optionalFields: [],
    template: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: 'https://emotionalhouse.vn',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sản phẩm',
          item: 'https://emotionalhouse.vn/products',
        },
      ],
    },
  },
  FAQPage: {
    type: 'FAQPage',
    name: 'FAQ Page',
    description: 'Schema cho trang FAQ',
    requiredFields: ['mainEntity'],
    optionalFields: [],
    template: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [],
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Gấu bông có an toàn cho trẻ em không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Có, tất cả sản phẩm của chúng tôi đều đạt tiêu chuẩn an toàn cho trẻ em.',
          },
        },
      ],
    },
  },
  VideoObject: {
    type: 'VideoObject',
    name: 'Video Object',
    description: 'Schema cho video',
    requiredFields: ['name', 'uploadDate'],
    optionalFields: ['description', 'thumbnailUrl', 'contentUrl'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: '',
      uploadDate: '',
      description: '',
      thumbnailUrl: '',
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Giới thiệu sản phẩm',
      uploadDate: '2024-01-01T00:00:00Z',
      description: 'Video giới thiệu về gấu bông',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
    },
  },
  Recipe: {
    type: 'Recipe',
    name: 'Recipe',
    description: 'Schema cho công thức nấu ăn',
    requiredFields: ['name'],
    optionalFields: ['description', 'image', 'recipeIngredient', 'recipeInstructions'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: '',
      description: '',
      image: '',
      recipeIngredient: [],
      recipeInstructions: [],
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Công thức làm gấu bông',
      description: 'Hướng dẫn tự làm gấu bông tại nhà',
    },
  },
  Event: {
    type: 'Event',
    name: 'Event',
    description: 'Schema cho sự kiện',
    requiredFields: ['name', 'startDate'],
    optionalFields: ['endDate', 'location', 'description'],
    template: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: '',
      startDate: '',
      location: {
        '@type': 'Place',
        name: '',
      },
    },
    example: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Triển lãm gấu bông',
      startDate: '2024-12-01T09:00:00Z',
      location: {
        '@type': 'Place',
        name: 'Trung tâm triển lãm',
      },
    },
  },
};

/**
 * Validate schema structure
 */
export function validateSchema(schema: Record<string, any>): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!schema['@context']) {
    errors.push('Missing required field: @context');
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push('@context should be "https://schema.org"');
  }

  if (!schema['@type']) {
    errors.push('Missing required field: @type');
  } else {
    const schemaType = schema['@type'] as SchemaType;
    const template = SCHEMA_TEMPLATES[schemaType];

    if (!template) {
      errors.push(`Unknown schema type: ${schemaType}`);
    } else {
      // Check required fields for this schema type
      template.requiredFields.forEach(field => {
        if (!hasNestedField(schema, field)) {
          errors.push(`Missing required field: ${field}`);
        }
      });
    }
  }

  // Validate common fields
  if (schema.name && typeof schema.name !== 'string') {
    errors.push('Field "name" must be a string');
  }

  if (schema.description && typeof schema.description !== 'string') {
    errors.push('Field "description" must be a string');
  }

  if (schema.image) {
    if (typeof schema.image !== 'string' && !Array.isArray(schema.image)) {
      errors.push('Field "image" must be a string or array');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if nested field exists
 */
function hasNestedField(obj: any, path: string): boolean {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined || !(part in current)) {
      return false;
    }
    current = current[part];
  }

  return current !== null && current !== undefined;
}

/**
 * Get schema template by type
 */
export function getSchemaTemplate(type: SchemaType): SchemaTemplate {
  return SCHEMA_TEMPLATES[type];
}

/**
 * Clone template for editing
 */
export function cloneTemplate(type: SchemaType): Record<string, any> {
  const template = SCHEMA_TEMPLATES[type];
  return JSON.parse(JSON.stringify(template.template));
}

/**
 * Format schema for preview
 */
export function formatSchemaForPreview(schema: Record<string, any>): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Merge multiple schemas
 */
export function mergeSchemas(schemas: Record<string, any>[]): Record<string, any>[] {
  // Return array of schemas (can have multiple schemas on one page)
  return schemas.filter(s => s && s['@type']);
}





