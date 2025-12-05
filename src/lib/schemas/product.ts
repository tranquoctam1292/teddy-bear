// MongoDB Schema Definitions for Product
import type { ObjectId } from 'mongodb';
import type { SEOConfig } from './seo';
import { z } from 'zod';

/**
 * Product Variant Dimensions
 */
export interface VariantDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

/**
 * Product Variant Schema
 * Represents a specific size/price option for a product
 */
export interface ProductVariant {
  _id?: ObjectId;
  id: string; // Unique identifier for the variant
  size: string; // e.g., "80cm", "1m2", "1m5", "2m"
  color?: string; // Color name (e.g., "Pink", "Purple", "Blue")
  colorCode?: string; // Hex color code (e.g., "#FF69B4", "#9B59B6", "#3498DB")
  price: number; // Price in VND
  stock: number; // Available quantity
  image?: string; // Optional variant-specific image URL
  sku?: string; // Stock Keeping Unit (optional)
  weight?: number; // Weight in grams (for shipping calculation)
  dimensions?: VariantDimensions;
  isPopular?: boolean; // Variant phổ biến flag
}

/**
 * Product Dimensions
 */
export interface ProductDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

/**
 * Combo Product Item
 */
export interface ComboProductItem {
  productId: string; // Product ID
  productName: string; // Product name (for display)
  discount?: number; // Discount percentage (0-100)
}

/**
 * Product Schema
 * Core product entity with nested variants array
 */
export interface Product {
  _id?: ObjectId;
  id: string; // Unique identifier
  name: string;
  slug: string; // URL-friendly identifier
  description: string;
  category: string; // e.g., "teddy", "capybara", "lotso", "kuromi", "cartoon"
  tags: string[]; // e.g., ["Best Seller", "Birthday", "Valentine"]
  
  // Price range for quick display (calculated from variants)
  minPrice: number; // Lowest price among all variants
  maxPrice?: number; // Highest price (if multiple variants)
  
  // Product images
  images: string[]; // Main product gallery
  
  // Variants array - nested structure
  variants: ProductVariant[];
  
  // Product metadata
  isHot: boolean; // Featured/hot product flag
  isActive: boolean; // Product availability
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Total number of reviews
  
  // SEO & Marketing
  metaTitle?: string;
  metaDescription?: string;
  seo?: SEOConfig; // Advanced SEO configuration
  
  // NEW: Chi tiết sản phẩm
  material?: string; // Chất liệu (VD: "Bông gòn cao cấp, vải lông mềm")
  dimensions?: ProductDimensions; // Kích thước thực tế
  weight?: number; // Trọng lượng (gram)
  ageRange?: string; // Độ tuổi phù hợp (VD: "3+", "0-12 tháng")
  careInstructions?: string; // Hướng dẫn bảo quản (HTML)
  safetyInfo?: string; // Thông tin an toàn (HTML)
  warranty?: string; // Bảo hành (VD: "6 tháng")
  
  // NEW: Tính năng quà tặng
  giftWrapping?: boolean; // Có hỗ trợ gói quà
  giftWrappingOptions?: string[]; // Các loại gói quà (VD: ["Hộp giấy", "Túi vải", "Hộp cao cấp"])
  giftMessageEnabled?: boolean; // Cho phép ghi lời chúc
  giftMessageTemplate?: string; // Template lời chúc mặc định
  specialOccasions?: string[]; // Dịp đặc biệt (VD: ["Valentine", "Sinh nhật", "8/3"])
  
  // NEW: Media mở rộng
  videoUrl?: string; // Video giới thiệu (YouTube/Vimeo URL)
  videoThumbnail?: string; // Thumbnail video
  images360?: string[]; // Hình ảnh 360 độ (array of URLs)
  lifestyleImages?: string[]; // Hình ảnh lifestyle (array of URLs)
  
  // NEW: Bộ sưu tập & Combo
  collection?: string; // Bộ sưu tập (VD: "Teddy Classic", "Valentine 2025")
  relatedProducts?: string[]; // Sản phẩm liên quan (product IDs)
  comboProducts?: ComboProductItem[]; // Combo/Set sản phẩm
  bundleDiscount?: number; // Giảm giá khi mua combo (%)
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simplified Product (for listing pages)
 * Lightweight version without full variant details
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  minPrice: number;
  maxPrice?: number;
  images: string[];
  isHot: boolean;
  rating?: number;
  reviewCount?: number;
  variantCount: number; // Number of available variants
}

// ========================================
// Zod Validation Schemas
// ========================================

/**
 * Variant Dimensions Zod Schema
 */
export const variantDimensionsSchema = z.object({
  length: z.number().min(0, 'Chiều dài phải >= 0'),
  width: z.number().min(0, 'Chiều rộng phải >= 0'),
  height: z.number().min(0, 'Chiều cao phải >= 0'),
});

/**
 * Product Variant Zod Schema
 */
export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, 'Kích thước là bắt buộc'),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng tồn kho phải >= 0'),
  image: z.string().url('URL ảnh không hợp lệ').optional().or(z.literal('')),
  sku: z.string().optional(),
  weight: z.number().min(0, 'Trọng lượng phải >= 0').optional(),
  dimensions: variantDimensionsSchema.optional(),
  isPopular: z.boolean().optional(),
});

/**
 * Product Dimensions Zod Schema
 */
export const productDimensionsSchema = z.object({
  length: z.number().min(0, 'Chiều dài phải >= 0'),
  width: z.number().min(0, 'Chiều rộng phải >= 0'),
  height: z.number().min(0, 'Chiều cao phải >= 0'),
});

/**
 * Combo Product Item Zod Schema
 */
export const comboProductItemSchema = z.object({
  productId: z.string().min(1, 'Product ID là bắt buộc'),
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  discount: z.number().min(0).max(100, 'Giảm giá phải từ 0-100%').optional(),
});

/**
 * Product Zod Schema
 */
export const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url('URL ảnh không hợp lệ')).min(1, 'Cần ít nhất 1 ảnh'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 biến thể'),
  isHot: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // NEW: Chi tiết sản phẩm
  material: z.string().optional(),
  dimensions: productDimensionsSchema.optional(),
  weight: z.number().min(0, 'Trọng lượng phải >= 0').optional(),
  ageRange: z.string().optional(),
  careInstructions: z.string().optional(),
  safetyInfo: z.string().optional(),
  warranty: z.string().optional(),
  
  // NEW: Tính năng quà tặng
  giftWrapping: z.boolean().default(false),
  giftWrappingOptions: z.array(z.string()).default([]),
  giftMessageEnabled: z.boolean().default(false),
  giftMessageTemplate: z.string().optional(),
  specialOccasions: z.array(z.string()).default([]),
  
  // NEW: Media mở rộng
  videoUrl: z.string().url('URL video không hợp lệ').optional().or(z.literal('')),
  videoThumbnail: z.string().url('URL thumbnail không hợp lệ').optional().or(z.literal('')),
  images360: z.array(z.string().url('URL ảnh 360 không hợp lệ')).default([]),
  lifestyleImages: z.array(z.string().url('URL ảnh lifestyle không hợp lệ')).default([]),
  
  // NEW: Bộ sưu tập & Combo
  collection: z.string().optional(),
  relatedProducts: z.array(z.string()).default([]),
  comboProducts: z.array(comboProductItemSchema).default([]),
  bundleDiscount: z.number().min(0).max(100, 'Giảm giá combo phải từ 0-100%').optional(),
});

/**
 * Type inference từ Zod schema
 */
export type ProductFormData = z.infer<typeof productSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;

