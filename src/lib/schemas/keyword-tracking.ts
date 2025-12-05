// Keyword Tracking Schema
import type { ObjectId } from 'mongodb';

/**
 * Keyword Status
 */
export type KeywordStatus = 'tracking' | 'paused' | 'archived';

/**
 * Ranking History Entry
 */
export interface RankingHistoryEntry {
  date: Date;
  rank?: number; // Google position (1-100, null if not in top 100)
  searchVolume?: number;
  difficulty?: number; // 0-100
  notes?: string;
}

/**
 * Keyword Tracking Schema
 * Tracks keyword rankings and performance
 */
export interface KeywordTracking {
  _id?: ObjectId;
  id: string; // Unique identifier
  
  // Keyword Information
  keyword: string;
  entityType: 'product' | 'post' | 'page' | 'global';
  entityId?: string; // Reference to entity (optional for global keywords)
  entitySlug?: string;
  
  // Ranking Data
  currentRank?: number; // Current Google position (1-100)
  previousRank?: number; // Previous rank for comparison
  bestRank?: number; // Best rank achieved
  worstRank?: number; // Worst rank achieved
  
  // Keyword Metrics
  searchVolume?: number; // Monthly search volume
  difficulty?: number; // Keyword difficulty (0-100)
  cpc?: number; // Cost per click (if available)
  competition?: 'low' | 'medium' | 'high';
  
  // Tracking Configuration
  status: KeywordStatus;
  trackedAt: Date; // When tracking started
  lastChecked?: Date; // Last time rank was checked
  checkFrequency?: 'daily' | 'weekly' | 'monthly'; // How often to check
  
  // History
  rankingHistory?: RankingHistoryEntry[]; // Historical ranking data
  totalChecks?: number; // Number of times checked
  
  // Notes & Tags
  notes?: string;
  tags?: string[]; // For grouping/organization
  
  // Goals
  targetRank?: number; // Target ranking position
  targetDate?: Date; // Target date to achieve rank
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default Keyword Tracking
 */
export const DEFAULT_KEYWORD_TRACKING: Partial<KeywordTracking> = {
  status: 'tracking',
  trackedAt: new Date(),
  checkFrequency: 'weekly',
  rankingHistory: [],
  totalChecks: 0,
};





