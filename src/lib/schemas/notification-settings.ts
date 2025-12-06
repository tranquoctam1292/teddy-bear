// MongoDB Schema Definitions for Notification Settings
import type { ObjectId } from 'mongodb';

/**
 * Email Template Schema
 * Reusable email templates for various notifications
 */
export interface EmailTemplate {
  _id?: ObjectId;
  id: string;
  name: string; // "Order Confirmation", "Shipping Notification"
  slug: string; // "order-confirmation", "shipping-notification"
  subject: string; // Email subject with variables {{orderNumber}}
  body: string; // HTML email body with variables
  variables: string[]; // Available variables: ["orderNumber", "customerName", ...]
  category: 'order' | 'customer' | 'system' | 'marketing';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SMTP Configuration Schema
 * Email server configuration
 */
export interface SMTPConfig {
  _id?: ObjectId;
  id: string;
  provider: 'smtp' | 'resend' | 'sendgrid' | 'mailgun';
  enabled: boolean;
  config: {
    // SMTP config
    host?: string;
    port?: number;
    secure?: boolean; // Use TLS
    username?: string;
    password?: string;
    // Resend config
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
    // SendGrid/Mailgun config
    apiKey?: string;
    domain?: string;
  };
  testResult?: {
    success: boolean;
    message: string;
    testedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * System Notification Schema
 * Configuration for system-wide notifications
 */
export interface SystemNotification {
  _id?: ObjectId;
  id: string;
  event: string; // "new_order", "low_stock", "new_contact", "payment_received"
  enabled: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean;
  };
  recipients: string[]; // Admin emails
  templateId?: string; // Reference to EmailTemplate
  createdAt: Date;
  updatedAt: Date;
}








