// MongoDB Schema Definitions for Security Settings
import type { ObjectId } from 'mongodb';

/**
 * Admin User Schema
 * Extended user schema for admin management
 */
export interface AdminUser {
  _id?: ObjectId;
  id: string;
  email: string;
  name: string;
  password: string; // Hashed
  role: 'admin' | 'super_admin' | 'editor' | 'viewer';
  permissions: string[]; // Specific permissions: ["products:write", "orders:read", ...]
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Security Configuration Schema
 * System-wide security settings
 */
export interface SecurityConfig {
  _id?: ObjectId;
  id: string;
  // Password Policy
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // Days before password expires
  };
  // Session Management
  sessionConfig: {
    maxAge: number; // Session timeout in hours
    requireMFA: boolean; // Multi-factor authentication
  };
  // Rate Limiting
  rateLimiting: {
    enabled: boolean;
    maxRequests: number; // Per window
    windowMs: number; // Time window in milliseconds
  };
  // CORS Configuration
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
  };
  // API Security
  apiSecurity: {
    requireApiKey: boolean;
    allowedIPs: string[]; // Whitelist IPs
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Activity Log Schema
 * Track admin user activities
 */
export interface UserActivityLog {
  _id?: ObjectId;
  id: string;
  userId: string; // Reference to AdminUser
  action: string; // "login", "logout", "create_product", "update_order"
  resource: string; // "product", "order", "user"
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * API Key Schema
 * API keys for external integrations
 */
export interface APIKey {
  _id?: ObjectId;
  id: string;
  name: string;
  key: string; // Hashed
  keyPrefix: string; // First 8 chars for display
  permissions: string[];
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}








