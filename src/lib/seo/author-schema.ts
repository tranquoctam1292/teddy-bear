// Schema.org/Person JSON-LD for Authors (E-E-A-T SEO)
import { Author } from '@/lib/types/author';
import { AuthorSchemaOrg } from '@/lib/types/author';

/**
 * Generate Schema.org Person markup for author
 * Used for: Author archive pages, author boxes
 */
export function generateAuthorSchema(author: Author): AuthorSchemaOrg {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const schema: AuthorSchemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
    description: author.bio,
  };

  // Add image (avatar)
  if (author.avatar) {
    schema.image = author.avatar;
  }

  // Add job title
  if (author.jobTitle) {
    schema.jobTitle = author.jobTitle;
  }

  // Add organization (company)
  if (author.company) {
    schema.worksFor = {
      '@type': 'Organization',
      name: author.company,
    };
  }

  // Add education (E-E-A-T)
  if (author.education) {
    schema.alumniOf = author.education;
  }

  // Add awards (Authority)
  if (author.awards && author.awards.length > 0) {
    schema.award = author.awards;
  }

  // Add honorific prefix from credentials (Dr., Prof., etc.)
  if (author.credentials) {
    // Extract first credential (e.g., "MD" from "MD, PhD")
    const firstCredential = author.credentials.split(',')[0].trim();
    if (firstCredential.match(/^(Dr|Prof|MD|PhD|MBA)$/i)) {
      schema.honorificPrefix = firstCredential;
    }
  }

  // Add expertise areas (Expertise)
  if (author.expertise && author.expertise.length > 0) {
    schema.knowsAbout = author.expertise;
  }

  // Add social media URLs (sameAs for entity linking)
  const sameAs: string[] = [];
  if (author.socialLinks) {
    if (author.socialLinks.website) sameAs.push(author.socialLinks.website);
    if (author.socialLinks.linkedin) sameAs.push(author.socialLinks.linkedin);
    if (author.socialLinks.twitter) sameAs.push(author.socialLinks.twitter);
    if (author.socialLinks.facebook) sameAs.push(author.socialLinks.facebook);
    if (author.socialLinks.instagram) sameAs.push(author.socialLinks.instagram);
    if (author.socialLinks.youtube) sameAs.push(author.socialLinks.youtube);
  }
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

/**
 * Generate Schema.org Article with Author
 * Used for: Blog posts
 */
export function generateArticleWithAuthorSchema(
  post: {
    title: string;
    slug: string;
    excerpt?: string;
    featuredImage?: string;
    publishedAt?: Date;
    updatedAt?: Date;
    category?: string;
  },
  author: Author,
  reviewer?: Author
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `${baseUrl}/blog/${post.slug}`,
    
    // Author (required for Article)
    author: {
      '@type': 'Person',
      name: author.name,
      url: `${baseUrl}/author/${author.slug}`,
      ...(author.jobTitle && { jobTitle: author.jobTitle }),
      ...(author.credentials && { honorificPrefix: author.credentials.split(',')[0].trim() }),
    },

    // Publisher (website/organization)
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Teddy Shop',
      url: baseUrl,
    },

    // Dates
    ...(post.publishedAt && { datePublished: post.publishedAt.toISOString() }),
    ...(post.updatedAt && { dateModified: post.updatedAt.toISOString() }),

    // Image
    ...(post.featuredImage && { image: post.featuredImage }),

    // Category
    ...(post.category && {
      articleSection: post.category,
    }),
  };

  // Add reviewer (YMYL compliance)
  if (reviewer) {
    schema.reviewedBy = {
      '@type': 'Person',
      name: reviewer.name,
      url: `${baseUrl}/author/${reviewer.slug}`,
      jobTitle: reviewer.jobTitle,
      ...(reviewer.credentials && { 
        honorificPrefix: reviewer.credentials.split(',')[0].trim(),
        credential: reviewer.credentials,
      }),
      ...(reviewer.education && { alumniOf: reviewer.education }),
    };

    // Add medical review metadata for YMYL
    if (reviewer.credentials || reviewer.jobTitle) {
      schema.medicalAudience = {
        '@type': 'MedicalAudience',
        audienceType: 'Patient',
      };
    }
  }

  return schema;
}

/**
 * Generate Schema.org ProfilePage
 * Used for: Author archive pages
 */
export function generateAuthorProfileSchema(
  author: Author,
  postCount: number
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: generateAuthorSchema(author),
    url: `${baseUrl}/author/${author.slug}`,
    name: `${author.name} - Author Profile`,
    description: author.bio,
    ...(postCount > 0 && {
      about: {
        '@type': 'ItemList',
        numberOfItems: postCount,
        itemListElement: 'Articles written by ' + author.name,
      },
    }),
  };
}

/**
 * Render Schema.org script tag as string (for dangerouslySetInnerHTML)
 * Usage in component:
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 */
export function renderSchemaScript(schema: any): string {
  return JSON.stringify(schema);
}

