// Redirect Matching Engine
import type { RedirectRule } from '@/lib/schemas/redirect-rule';

/**
 * Normalize URL for matching
 */
export function normalizeUrl(url: string): string {
  // Remove protocol, domain, and query string for path matching
  try {
    const urlObj = new URL(url, 'http://localhost');
    return urlObj.pathname.toLowerCase().replace(/\/$/, '') || '/';
  } catch {
    // If URL parsing fails, treat as path
    return url.toLowerCase().replace(/\/$/, '') || '/';
  }
}

/**
 * Match URL against redirect rule
 */
export function matchRedirect(url: string, rule: RedirectRule): boolean {
  const normalizedUrl = normalizeUrl(url);
  const normalizedSource = normalizeUrl(rule.source);

  switch (rule.matchType) {
    case 'exact':
      return normalizedUrl === normalizedSource;

    case 'prefix':
      return normalizedUrl.startsWith(normalizedSource);

    case 'regex':
      try {
        const regex = new RegExp(rule.source);
        return regex.test(url) || regex.test(normalizedUrl);
      } catch {
        return false;
      }

    default:
      return false;
  }
}

/**
 * Find matching redirect rule for a URL
 * Returns the highest priority matching rule
 */
export async function findMatchingRedirect(
  url: string,
  redirectRules: RedirectRule[]
): Promise<RedirectRule | null> {
  // Filter active redirects
  const activeRedirects = redirectRules.filter(
    (rule) => rule.status === 'active'
  );

  // Check expiration
  const validRedirects = activeRedirects.filter((rule) => {
    if (rule.expiresAt) {
      return new Date(rule.expiresAt) > new Date();
    }
    return true;
  });

  // Find all matching redirects
  const matchingRedirects = validRedirects.filter((rule) =>
    matchRedirect(url, rule)
  );

  if (matchingRedirects.length === 0) {
    return null;
  }

  // Sort by priority (higher priority first), then by creation date
  matchingRedirects.sort((a, b) => {
    const priorityDiff = (b.priority || 0) - (a.priority || 0);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return (
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });

  return matchingRedirects[0];
}

/**
 * Resolve destination URL (handle relative URLs)
 */
export function resolveDestination(
  sourceUrl: string,
  destination: string
): string {
  // If destination is absolute URL, return as is
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    return destination;
  }

  // If destination starts with /, it's an absolute path
  if (destination.startsWith('/')) {
    try {
      const urlObj = new URL(sourceUrl, 'http://localhost');
      return `${urlObj.origin}${destination}`;
    } catch {
      return destination;
    }
  }

  // Relative path - resolve from source URL
  try {
    const sourceUrlObj = new URL(sourceUrl, 'http://localhost');
    const resolved = new URL(destination, sourceUrlObj);
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return destination;
  }
}

/**
 * Detect redirect chains
 * Returns array of chains found
 */
export function detectRedirectChains(
  redirectRules: RedirectRule[]
): Array<{
  source: string;
  chain: string[];
  finalDestination: string;
  totalRedirects: number;
}> {
  const chains: Array<{
    source: string;
    chain: string[];
    finalDestination: string;
    totalRedirects: number;
  }> = [];

  const activeRules = redirectRules.filter((rule) => rule.status === 'active');

  for (const rule of activeRules) {
    const chain: string[] = [rule.source];
    let currentDestination = rule.destination;
    const visited = new Set<string>([rule.source]);

    // Follow the chain
    while (currentDestination) {
      // Check if destination matches another redirect's source
      const nextRule = activeRules.find((r) => {
        if (r.source === rule.source) return false; // Don't match self
        return matchRedirect(currentDestination, r);
      });

      if (!nextRule) {
        // End of chain
        chain.push(currentDestination);
        break;
      }

      // Check for circular reference
      if (visited.has(nextRule.source)) {
        // Circular chain detected
        chain.push(nextRule.destination);
        chain.push('(CIRCULAR)');
        break;
      }

      visited.add(nextRule.source);
      chain.push(nextRule.destination);
      currentDestination = nextRule.destination;
    }

    // If chain has more than 2 elements (source -> destination -> ...), it's a chain
    if (chain.length > 2 && !chain.includes('(CIRCULAR)')) {
      chains.push({
        source: rule.source,
        chain,
        finalDestination: chain[chain.length - 1],
        totalRedirects: chain.length - 1,
      });
    }
  }

  return chains;
}




