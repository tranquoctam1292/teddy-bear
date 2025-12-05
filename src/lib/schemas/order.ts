// MongoDB Schema Definitions for Order
import type { ObjectId } from 'mongodb';
import type { CartItem } from '@/types';

/**
 * Shipping Address Schema
 */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string; // Street address
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Thành phố
  note?: string; // Delivery notes
}

/**
 * Upsell Services Schema
 * Tracks which services were applied to the order
 */
export interface UpsellServices {
  vacuumSealing: boolean; // Free service - reduces shipping size
  isGiftWrapped: boolean; // Paid service
  giftWrapFee: number; // Fee for gift wrapping (typically 30,000 VND)
  expressShipping: boolean; // Express delivery option
}

/**
 * Payment Details Schema
 */
export interface PaymentDetails {
  method: 'cod' | 'bank_transfer' | 'momo' | 'vnpay';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string; // For online payments
  paidAt?: Date; // Payment timestamp
  amount: number; // Amount paid
}

/**
 * Order Schema
 * Complete order entity with upsell services tracking
 */
export interface Order {
  _id?: ObjectId;
  orderId: string; // Human-readable order ID (e.g., "ORD-1234567890-0001")
  
  // User information
  userId?: string; // Optional - for logged-in users
  guestEmail: string; // Email for guest checkout
  
  // Order items
  items: CartItem[]; // Array of cart items with variantId references
  
  // Shipping information
  shippingAddress: ShippingAddress;
  shippingFee: number; // Calculated shipping cost
  shippingMethod: 'standard' | 'express';
  
  // Upsell Services - CRITICAL for tracking
  upsellServices: UpsellServices;
  
  // Pricing breakdown
  subtotal: number; // Sum of all items (price * quantity)
  upsellTotal: number; // Total from upsell services (gift wrapping, etc.)
  shippingTotal: number; // Shipping fee
  total: number; // Final total (subtotal + upsellTotal + shippingTotal)
  
  // Payment information
  paymentDetails: PaymentDetails;
  
  // Order status
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  
  // Tracking
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order Summary (for API responses)
 */
export interface OrderSummary {
  orderId: string;
  status: Order['orderStatus'];
  total: number;
  itemCount: number;
  createdAt: Date;
}







