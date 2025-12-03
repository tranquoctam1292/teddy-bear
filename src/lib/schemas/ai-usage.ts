// AI Usage Log Schema
export interface AIUsageLog {
  id: string;
  userId: string;
  ip: string;
  action: 'ai_generation' | 'keyword_research' | 'content_optimization';
  provider: 'openai' | 'claude' | 'gemini' | 'rule-based' | 'pending';
  timestamp: Date;
  completedAt?: Date;
  tokensUsed?: number;
  estimatedCost?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: {
    type?: string; // meta-description, title, etc.
    contentLength?: number;
    keyword?: string;
  };
}

// MongoDB indexes for performance
export const AI_USAGE_INDEXES = [
  // Query by user and time
  { key: { userId: 1, action: 1, timestamp: -1 } },
  // Query by IP for rate limiting
  { key: { ip: 1, timestamp: -1 } },
  // TTL index - auto-delete after 90 days
  { key: { timestamp: 1 }, expireAfterSeconds: 7776000 }, // 90 days
  // Query pending logs
  { key: { provider: 1, timestamp: -1 } },
];

