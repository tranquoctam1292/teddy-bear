/**
 * Rate Limiting Middleware
 * 
 * Simple in-memory rate limiting for API routes
 * For production with multiple servers, use Redis-based solution (@upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (for single server)
// For production with multiple servers, use Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
};

/**
 * Get client identifier (IP address)
 */
function getClientId(request: Request): string {
  // Try to get IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetAt: number; retryAfter?: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientId = getClientId(request);
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(clientId);

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetAt: now + finalConfig.windowMs,
    };
    rateLimitStore.set(clientId, entry);
  }

  // Increment count
  entry.count += 1;

  const remaining = Math.max(0, finalConfig.maxRequests - entry.count);
  const allowed = entry.count <= finalConfig.maxRequests;

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetAt - now) / 1000),
  };
}

// Import NextRequest and NextResponse
import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: Partial<RateLimitConfig>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = checkRateLimit(request, config);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: config?.message || DEFAULT_CONFIG.message,
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': result.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': (config?.maxRequests || DEFAULT_CONFIG.maxRequests).toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', (config?.maxRequests || DEFAULT_CONFIG.maxRequests).toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

    return response;
  };
}

