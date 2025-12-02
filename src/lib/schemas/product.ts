// MongoDB Schema Definitions for Product
import type { ObjectId } from 'mongodb';

/**
 * Product Variant Schema
 * Represents a specific size/price option for a product
 */
export interface ProductVariant {
  _id?: ObjectId;
  id: string; // Unique identifier for the variant
  size: string; // e.g., "80cm", "1m2", "1m5", "2m"
  price: number; // Price in VND
  stock: number; // Available quantity
  image?: string; // Optional variant-specific image URL
  sku?: string; // Stock Keeping Unit (optional)
  weight?: number; // Weight in grams (for shipping calculation)
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
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


