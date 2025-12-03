// Post Form Data Type
// Shared type definition for Post form across the application

export type PostFormData = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[]; // Array of keywords for SEO
  featuredImage?: string;
  category?: string;
  tags: string[]; // Array of tags
  status: 'draft' | 'published' | 'archived';
};


