// MongoDB Schema Definitions for Order Settings
import type { ObjectId } from 'mongodb';

/**
 * Order Status Schema
 * Customizable order status workflow
 */
export interface OrderStatus {
  _id?: ObjectId;
  id: string;
  name: string; // "Chờ xử lý", "Đã xác nhận", "Đang giao hàng"
  slug: string; // "pending", "confirmed", "shipping"
  color: string; // Hex color
  icon?: string; // Icon name or URL
  order: number; // Workflow order
  isDefault: boolean; // Initial status for new orders
  canTransitionTo: string[]; // Allowed next statuses
  sendNotification: boolean; // Auto-send email on status change
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order Notification Schema
 * Configuration for order-related notifications
 */
export interface OrderNotification {
  _id?: ObjectId;
  id: string;
  event: 'order_created' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled';
  enabled: boolean;
  sendToCustomer: boolean;
  sendToAdmin: boolean;
  adminEmails: string[]; // Additional admin emails
  emailTemplateId?: string; // Reference to email template
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Method Schema
 * Payment method configuration
 */
export interface PaymentMethod {
  _id?: ObjectId;
  id: string;
  name: string; // "MoMo", "VietQR", "COD"
  slug: string;
  enabled: boolean;
  config: {
    // MoMo config
    partnerCode?: string;
    accessKey?: string;
    secretKey?: string;
    // VietQR config
    apiKey?: string;
    // COD config
    minOrderAmount?: number;
    maxOrderAmount?: number;
  };
  fee: {
    type: 'fixed' | 'percentage';
    value: number;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}








