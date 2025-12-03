// API Contracts for Cart Management
import type { Cart, CartItem } from '../schemas/cart';
import type { UpsellServices } from '@/types';

/**
 * POST /api/cart
 * 
 * GOAL: Add a specific variant to the user's cart
 * 
 * Request Body:
 */
export interface AddToCartRequest {
  productId: string; // Product identifier
  variantId: string; // Variant identifier (CRITICAL - specifies size/price)
  quantity: number; // Quantity to add (must be > 0)
}

/**
 * PUT /api/cart/:itemId
 * 
 * GOAL: Update quantity of an existing cart item
 * 
 * Request Body:
 */
export interface UpdateCartItemRequest {
  quantity: number; // New quantity (must be > 0)
}

/**
 * DELETE /api/cart/:itemId
 * 
 * GOAL: Remove an item from cart
 * 
 * No request body required
 */

/**
 * PUT /api/cart/upsell-services
 * 
 * GOAL: Update upsell services selection
 * 
 * Request Body:
 */
export interface UpdateUpsellServicesRequest {
  upsellServices: Partial<UpsellServices>;
}

/**
 * Response Body for Cart Operations
 */
export interface CartResponse {
  success: true;
  data: {
    cart: Cart;
    totals: {
      subtotal: number;
      upsellTotal: number;
      shippingFee: number;
      total: number;
      itemCount: number; // Total quantity of items
    };
  };
}

/**
 * Error Response
 */
export interface CartErrorResponse {
  success: false;
  error: string;
  details?: {
    field?: string;
    message: string;
  };
}




