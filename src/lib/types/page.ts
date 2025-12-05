// Page Types for MongoDB
export interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'published' | 'draft' | 'trash';
  parentId?: string;
  template: string;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  customCSS?: string;
  customJS?: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface PageWithChildren extends Page {
  children?: PageWithChildren[];
  parent?: Page;
}

export interface PageFilter {
  status?: 'all' | 'published' | 'draft' | 'trash';
  search?: string;
  parentId?: string | null;
  limit?: number;
  skip?: number;
}

export interface PageListResponse {
  success: boolean;
  pages: Page[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  { id: 'default', name: 'Mặc định', description: 'Template chuẩn' },
  { id: 'full-width', name: 'Toàn màn hình', description: 'Không có sidebar' },
  { id: 'landing', name: 'Landing Page', description: 'Dành cho marketing' },
  { id: 'contact', name: 'Liên hệ', description: 'Có form liên hệ' },
  { id: 'custom', name: 'Tùy chỉnh', description: 'Custom template' },
];




