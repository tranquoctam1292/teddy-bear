// AI Rate Limiter & Cost Control
import { getCollections } from '@/lib/db';

export interface RateLimitConfig {
  perUser: {
    daily: number;
    monthly: number;
  };
  perIP: {
    hourly: number;
  };
  cooldown: number; // seconds
}

export const DEFAULT_LIMITS: RateLimitConfig = {
  perUser: {
    daily: 50,       // 50 AI generations per day
    monthly: 1000,   // 1000 AI generations per month
  },
  perIP: {
    hourly: 10,      // 10 requests per hour for anonymous users
  },
  cooldown: 5,       // 5 seconds between requests
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  message?: string;
  currentUsage?: {
    daily: number;
    monthly: number;
  };
}

/**
 * Check if user can make an AI API request
 */
export async function checkRateLimit(
  userId: string,
  ip: string,
  action: string = 'ai_generation'
): Promise<RateLimitResult> {
  const { aiUsageLogs } = await getCollections();
  const now = new Date();
  
  // 1. Check cooldown (prevent rapid successive requests)
  const lastRequest = await aiUsageLogs.findOne(
    {
      userId,
      action,
      timestamp: { $gte: new Date(now.getTime() - DEFAULT_LIMITS.cooldown * 1000) },
    },
    { sort: { timestamp: -1 } }
  );
  
  if (lastRequest) {
    const resetAt = new Date(lastRequest.timestamp.getTime() + DEFAULT_LIMITS.cooldown * 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      message: `Please wait ${DEFAULT_LIMITS.cooldown} seconds between requests`,
    };
  }
  
  // 2. Check daily limit
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dailyCount = await aiUsageLogs.countDocuments({
    userId,
    action,
    timestamp: { $gte: startOfDay },
  });
  
  if (dailyCount >= DEFAULT_LIMITS.perUser.daily) {
    const tomorrow = new Date(startOfDay);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      allowed: false,
      remaining: 0,
      resetAt: tomorrow,
      message: `Daily AI generation limit reached (${DEFAULT_LIMITS.perUser.daily} requests/day)`,
      currentUsage: {
        daily: dailyCount,
        monthly: 0,
      },
    };
  }
  
  // 3. Check monthly limit
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyCount = await aiUsageLogs.countDocuments({
    userId,
    action,
    timestamp: { $gte: startOfMonth },
  });
  
  if (monthlyCount >= DEFAULT_LIMITS.perUser.monthly) {
    const nextMonth = new Date(startOfMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return {
      allowed: false,
      remaining: 0,
      resetAt: nextMonth,
      message: `Monthly AI generation limit reached (${DEFAULT_LIMITS.perUser.monthly} requests/month)`,
      currentUsage: {
        daily: dailyCount,
        monthly: monthlyCount,
      },
    };
  }
  
  // 4. Log usage attempt
  await aiUsageLogs.insertOne({
    userId,
    ip,
    action,
    timestamp: now,
    success: true,
    provider: 'pending', // Will be updated after generation
  });
  
  const tomorrow = new Date(startOfDay);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    allowed: true,
    remaining: DEFAULT_LIMITS.perUser.daily - dailyCount - 1,
    resetAt: tomorrow,
    currentUsage: {
      daily: dailyCount + 1,
      monthly: monthlyCount + 1,
    },
  };
}

/**
 * Log AI usage after completion
 */
export async function logAIUsage(
  userId: string,
  provider: string,
  tokensUsed: number,
  estimatedCost: number,
  action: string,
  success: boolean = true,
  errorMessage?: string
): Promise<void> {
  const { aiUsageLogs } = await getCollections();
  
  // Update the most recent pending log
  await aiUsageLogs.updateOne(
    {
      userId,
      action,
      provider: 'pending',
      timestamp: { $gte: new Date(Date.now() - 60000) }, // Within last minute
    },
    {
      $set: {
        provider,
        tokensUsed,
        estimatedCost,
        success,
        errorMessage,
        completedAt: new Date(),
      },
    }
  );
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string): Promise<{
  daily: number;
  monthly: number;
  limits: {
    daily: number;
    monthly: number;
  };
  totalCost: number;
}> {
  const { aiUsageLogs } = await getCollections();
  const now = new Date();
  
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [dailyCount, monthlyCount, monthlyCost] = await Promise.all([
    aiUsageLogs.countDocuments({
      userId,
      timestamp: { $gte: startOfDay },
    }),
    aiUsageLogs.countDocuments({
      userId,
      timestamp: { $gte: startOfMonth },
    }),
    aiUsageLogs
      .aggregate([
        {
          $match: {
            userId,
            timestamp: { $gte: startOfMonth },
            estimatedCost: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$estimatedCost' },
          },
        },
      ])
      .toArray(),
  ]);
  
  return {
    daily: dailyCount,
    monthly: monthlyCount,
    limits: {
      daily: DEFAULT_LIMITS.perUser.daily,
      monthly: DEFAULT_LIMITS.perUser.monthly,
    },
    totalCost: monthlyCost[0]?.total || 0,
  };
}

/**
 * Check IP-based rate limit (for anonymous users)
 */
export async function checkIPRateLimit(ip: string): Promise<boolean> {
  const { aiUsageLogs } = await getCollections();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const count = await aiUsageLogs.countDocuments({
    ip,
    timestamp: { $gte: oneHourAgo },
  });
  
  return count < DEFAULT_LIMITS.perIP.hourly;
}

/**
 * Estimate cost based on provider and tokens
 */
export function estimateCost(provider: string, tokensUsed: number): number {
  const pricing: { [key: string]: number } = {
    'openai': 0.00002,     // GPT-4 Turbo: $0.01 per 1K tokens (average input/output)
    'claude': 0.000015,    // Claude 3 Sonnet: $0.015 per 1K tokens
    'gemini': 0.000001,    // Gemini Pro: $0.001 per 1K tokens
    'rule-based': 0,       // Free
  };
  
  const pricePerToken = pricing[provider] || 0;
  return tokensUsed * pricePerToken;
}

