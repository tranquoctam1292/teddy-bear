// Backlink Monitoring Schema
import type { ObjectId } from 'mongodb';

/**
 * Backlink Status
 */
export type BacklinkStatus = 'active' | 'lost' | 'pending';

/**
 * Backlink Quality
 */
export type BacklinkQuality = 'high' | 'medium' | 'low' | 'toxic';

/**
 * Backlink
 */
export interface Backlink {
  _id?: ObjectId;
  id: string;
  
  // Source Information
  sourceUrl: string;
  sourceDomain: string;
  sourceTitle?: string;
  sourceDescription?: string;
  
  // Target Information
  targetUrl: string; // Our page URL
  targetDomain: string; // Our domain
  anchorText?: string;
  
  // Link Attributes
  isDofollow: boolean;
  isNofollow: boolean;
  isSponsored: boolean;
  isUgc: boolean; // User-generated content
  
  // Quality Metrics
  domainAuthority?: number; // 0-100
  pageAuthority?: number; // 0-100
  spamScore?: number; // 0-100 (lower is better)
  quality: BacklinkQuality;
  
  // Status
  status: BacklinkStatus;
  firstSeen: Date;
  lastSeen: Date;
  lostAt?: Date;
  
  // Context
  linkPosition?: 'header' | 'footer' | 'sidebar' | 'content' | 'other';
  linkType?: 'text' | 'image' | 'button';
  surroundingText?: string; // Text around the link
  
  // Notes
  notes?: string;
  tags?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Backlink Monitoring Settings
 */
export interface BacklinkSettings {
  _id?: ObjectId;
  id: 'global';
  
  // Monitoring Configuration
  enabled: boolean;
  checkFrequency: 'daily' | 'weekly' | 'monthly';
  autoDetect: boolean; // Auto-detect new backlinks
  
  // Quality Thresholds
  minDomainAuthority: number; // Minimum DA to track
  maxSpamScore: number; // Maximum spam score
  
  // Integration
  ahrefsApiKey?: string;
  semrushApiKey?: string;
  mozApiKey?: string;
  
  // Timestamps
  updatedAt: Date;
}



