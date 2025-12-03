// Redirect Rule Schema
import type { ObjectId } from 'mongodb';

/**
 * Redirect Type
 */
export type RedirectType = '301' | '302' | '307' | '308';

/**
 * Match Type
 */
export type MatchType = 'exact' | 'regex' | 'prefix';

/**
 * Redirect Rule Status
 */
export type RedirectStatus = 'active' | 'inactive';

/**
 * Redirect Rule Schema
 * Manages URL redirects for SEO and user experience
 */
export interface RedirectRule {
  _id?: ObjectId;
  id: string; // Unique identifier
  
  // Source URL (what to redirect from)
  source: string; // URL pattern or path
  matchType: MatchType; // How to match the source
  
  // Destination URL (where to redirect to)
  destination: string; // Target URL (can be absolute or relative)
  
  // Redirect Configuration
  type: RedirectType; // 301 (permanent), 302 (temporary), 307, 308
  status: RedirectStatus; // active or inactive
  
  // Priority (higher number = higher priority)
  priority?: number; // Default: 0, higher priority rules checked first
  
  // Conditions (optional)
  conditions?: {
    queryParams?: Record<string, string>; // Match specific query params
    userAgent?: string; // Match specific user agent
    referer?: string; // Match specific referer
  };
  
  // Metadata
  notes?: string; // Admin notes
  createdBy?: string; // Admin user who created this
  createdFrom404?: boolean; // Created automatically from 404 error
  
  // Statistics
  hitCount?: number; // Number of times this redirect was used
  lastHit?: Date; // Last time this redirect was used
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // Optional expiration date
}

/**
 * Default Redirect Rule
 */
export const DEFAULT_REDIRECT_RULE: Partial<RedirectRule> = {
  matchType: 'exact',
  type: '301',
  status: 'active',
  priority: 0,
  hitCount: 0,
};

/**
 * Redirect Chain Detection
 * Used to detect redirect chains (A -> B -> C)
 */
export interface RedirectChain {
  source: string;
  chain: string[]; // Array of URLs in the chain
  finalDestination: string;
  totalRedirects: number;
}


