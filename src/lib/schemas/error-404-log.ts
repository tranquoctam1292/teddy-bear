// 404 Error Log Schema
import type { ObjectId } from 'mongodb';

/**
 * 404 Error Status
 */
export type Error404Status = 'active' | 'resolved' | 'ignored';

/**
 * 404 Error Log Schema
 * Tracks 404 errors for monitoring and resolution
 */
export interface Error404Log {
  _id?: ObjectId;
  id: string; // Unique identifier
  
  // Error Information
  url: string; // The URL that returned 404
  normalizedUrl: string; // Normalized URL (lowercase, no trailing slash, etc.)
  
  // Request Information
  referer?: string; // Where the request came from
  userAgent?: string; // Browser/user agent
  ip?: string; // IP address (optional, for privacy)
  
  // Statistics
  count: number; // Number of times this 404 occurred
  firstSeen: Date; // First time this 404 was seen
  lastSeen: Date; // Most recent occurrence
  
  // Resolution
  status: Error404Status; // active, resolved, ignored
  resolved?: boolean; // Whether this has been resolved
  resolvedAt?: Date; // When it was resolved
  resolvedBy?: string; // Admin user who resolved it
  redirectTo?: string; // If resolved with a redirect, the destination URL
  redirectRuleId?: string; // ID of the redirect rule created
  
  // Analysis
  likelyCause?: 'broken_link' | 'typo' | 'old_url' | 'deleted_content' | 'unknown';
  suggestedFix?: string; // Suggested fix (e.g., redirect to new URL)
  
  // Notes
  notes?: string; // Admin notes
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default 404 Error Log
 */
export const DEFAULT_ERROR_404_LOG: Partial<Error404Log> = {
  count: 1,
  status: 'active',
  resolved: false,
  likelyCause: 'unknown',
};

/**
 * 404 Error Statistics
 */
export interface Error404Statistics {
  totalErrors: number;
  activeErrors: number;
  resolvedErrors: number;
  ignoredErrors: number;
  topErrors: Array<{
    url: string;
    count: number;
    lastSeen: Date;
  }>;
  errorsByCause: Record<string, number>;
  errorsByDay: Array<{
    date: string;
    count: number;
  }>;
}








