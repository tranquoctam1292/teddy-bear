/**
 * SEO Data Caching Layer
 * Implements caching for frequently accessed SEO data
 */

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  key: string;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      expiresAt,
      key,
    });
  }

  /**
   * Delete cached data
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton cache instance
let cacheInstance: SimpleCache | null = null;

export function getCache(): SimpleCache {
  if (!cacheInstance) {
    cacheInstance = new SimpleCache();
    
    // Cleanup expired entries every 10 minutes
    setInterval(() => {
      cacheInstance?.cleanup();
    }, 10 * 60 * 1000);
  }
  
  return cacheInstance;
}

/**
 * Generate cache key
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}

/**
 * Cache wrapper for async functions
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = getCache();
  
  // Try to get from cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function
  const result = await fn();
  
  // Cache result
  cache.set(key, result, ttl);
  
  return result;
}



