// Competitor Schema
import type { ObjectId } from 'mongodb';

/**
 * Competitor Information
 */
export interface Competitor {
  _id?: ObjectId;
  id: string;
  
  // Basic Information
  name: string;
  website: string;
  domain: string;
  
  // SEO Metrics
  domainAuthority?: number; // 0-100
  backlinks?: number;
  referringDomains?: number;
  organicKeywords?: number;
  organicTraffic?: number;
  
  // Tracking Configuration
  enabled: boolean;
  trackedAt: Date;
  lastChecked?: Date;
  checkFrequency?: 'daily' | 'weekly' | 'monthly';
  
  // Notes
  notes?: string;
  tags?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Competitor Keyword Tracking
 */
export interface CompetitorKeyword {
  _id?: ObjectId;
  id: string;
  
  competitorId: string;
  keyword: string;
  
  // Ranking Data
  competitorRank?: number; // Competitor's rank for this keyword
  ourRank?: number; // Our rank for the same keyword
  rankGap?: number; // Difference in ranks
  
  // Metrics
  searchVolume?: number;
  difficulty?: number;
  
  // Timestamps
  trackedAt: Date;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Competitor Content Analysis
 */
export interface CompetitorContent {
  _id?: ObjectId;
  id: string;
  
  competitorId: string;
  url: string;
  title: string;
  description?: string;
  
  // Analysis
  wordCount?: number;
  keywordDensity?: Record<string, number>;
  headings?: string[];
  internalLinks?: number;
  externalLinks?: number;
  
  // Comparison
  similarToOurContent?: string[]; // Our content IDs that are similar
  
  // Timestamps
  analyzedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}








