// API Contracts for Checkout Processing
import type { ShippingAddress, UpsellServices, PaymentDetails } from '../schemas/order';
import type { CartItem } from '../schemas/cart';

/**
 * POST /api/checkout
 * 
 * GOAL: Finalize the order, calculate total including shipping and upsell fees,
 * and create the Order record
 * 
 * Request Body:
 */
export interface CheckoutRequest {
  // User identification
  userId?: string; // Optional - for logged-in users
  guestEmail: string; // Required for guest checkout
  
  // Cart items
  items: CartItem[]; // Array of items with variantId references
  
  // Shipping information
  shippingAddress: ShippingAddress;
  shippingMethod?: 'standard' | 'express'; // Default: 'standard'
  
  // Upsell Services - CRITICAL for final fee calculation
  upsellServices: UpsellServices;
  
  // Payment details
  paymentDetails: {
    method: PaymentDetails['method'];
  };
  
  // Optional: Pre-calculated totals (will be verified server-side)
  subtotal?: number;
  upsellTotal?: number;
  shippingFee?: number;
  total?: number;
}

/**
 * Response Body for POST /api/checkout
 */
export interface CheckoutResponse {
  success: true;
  data: {
    orderId: string; // Generated order ID (e.g., "ORD-1234567890-0001")
    order: {
      id: string;
      status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
      total: number;
      itemCount: number;
      paymentMethod: string;
      estimatedDelivery?: string; // ISO date string
    };
    payment?: {
      // For online payments (MoMo, VNPay)
      paymentUrl?: string;
      transactionId?: string;
      qrCode?: string; // For QR code payments
      qrCodeUrl?: string; // QR code image URL
      accountNo?: string; // Bank account number (for bank transfer)
      accountName?: string; // Account holder name
      content?: string; // Payment content/reference
    };
    message: string;
  };
}

/**
 * Error Response
 */
export interface CheckoutErrorResponse {
  success: false;
  error: string;
  details?: {
    field?: string;
    message: string;
    code?: string; // Error code for client handling
  };
}

/**
 * GET /api/checkout/:orderId
 * 
 * GOAL: Retrieve order status and details
 * 
 * Response Body:
 */
export interface GetOrderResponse {
  success: true;
  data: {
    orderId: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
    total: number;
    itemCount: number;
    shippingAddress: ShippingAddress;
    paymentStatus: PaymentDetails['status'];
    trackingNumber?: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
  };
}



