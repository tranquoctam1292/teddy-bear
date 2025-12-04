// MongoDB Schema Definitions for Product Settings
import type { ObjectId } from 'mongodb';

/**
 * Product Category Schema
 * Dynamic product categories management
 */
export interface ProductCategory {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // URL to icon image
  image?: string; // URL to category image
  order: number; // Display order
  isActive: boolean;
  parentId?: string; // For nested categories
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product Tag Schema
 * Tags for product categorization and search
 */
export interface ProductTag {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  color?: string; // Hex color code
  description?: string;
  productCount: number; // Calculated field
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attribute Value Schema
 * Individual value for a product attribute
 */
export interface AttributeValue {
  id: string;
  label: string;
  value: string;
  color?: string; // For color attributes
  image?: string; // For image-based attributes
  order: number;
}

/**
 * Product Attribute Schema
 * Configurable attributes like Size, Color, Material
 */
export interface ProductAttribute {
  _id?: ObjectId;
  id: string;
  name: string; // "Size", "Color", "Material"
  slug: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean';
  values: AttributeValue[]; // Available values
  isRequired: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}




