// MongoDB Schema Definitions for Cart
import type { ObjectId } from 'mongodb';
import type { CartItem, UpsellServices } from '@/types';

// Re-export CartItem for backward compatibility
export type { CartItem } from '@/types';

/**
 * Cart Schema
 * User's shopping cart (can be persisted or session-based)
 */
export interface Cart {
  _id?: ObjectId;
  userId?: string; // For logged-in users
  sessionId?: string; // For guest users
  
  // Cart items - each item references a specific variant
  items: CartItem[];
  
  // Upsell services selected
  upsellServices: UpsellServices;
  
  // Calculated totals (can be computed on-the-fly or cached)
  subtotal: number;
  upsellTotal: number;
  shippingFee: number;
  total: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For session-based carts
}



