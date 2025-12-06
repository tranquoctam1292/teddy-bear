// Navigation Menu Schema
import type { ObjectId } from 'mongodb';

/**
 * Navigation Menu Item Schema
 * Represents a single menu item (can be nested)
 */
export interface NavigationMenuItem {
  id: string; // Unique identifier for the item
  label: string; // Display text (e.g., "Gấu Teddy Bigsize")
  url: string; // Destination link (e.g., "/products?category=teddy-bigsize")
  type: 'category' | 'internal_page' | 'external_url'; // Link type
  order: number; // Used for sorting menu items
  children?: NavigationMenuItem[]; // Optional nested sub-menu items
  icon?: string; // Optional icon identifier
  openInNewTab?: boolean; // For external URLs
}

/**
 * Navigation Menu Schema
 * Stores menu structures for different locations
 */
export interface NavigationMenu {
  _id?: ObjectId;
  id: string; // Unique identifier
  location: string; // Unique location identifier ("main_header", "footer_sitemap", "footer_about", etc.)
  name: string; // Descriptive name (e.g., "Main Shop Navigation")
  items: NavigationMenuItem[]; // Array of menu items
  isActive: boolean; // Whether the menu is active/enabled
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Menu Location Types
 */
export const MENU_LOCATIONS = {
  MAIN_HEADER: 'main_header',
  FOOTER_SITEMAP: 'footer_sitemap',
  FOOTER_ABOUT: 'footer_about',
  FOOTER_SUPPORT: 'footer_support',
} as const;

export type MenuLocation = typeof MENU_LOCATIONS[keyof typeof MENU_LOCATIONS];










