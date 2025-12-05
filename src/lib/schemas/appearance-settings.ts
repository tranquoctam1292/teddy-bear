// MongoDB Schema Definitions for Appearance Settings
import type { ObjectId } from 'mongodb';

/**
 * Appearance Configuration Schema
 * Website appearance settings: theme, colors, logo, favicon
 */
export interface AppearanceConfig {
  _id?: ObjectId;
  id: string;
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string; // Hex color (e.g., #3B82F6)
  secondaryColor: string; // Hex color (e.g., #8B5CF6)
  logo?: string; // URL to logo image
  favicon?: string; // URL to favicon image
  // Additional customization options
  fontFamily?: string; // Font family name
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; // Border radius style
  createdAt: Date;
  updatedAt: Date;
}





