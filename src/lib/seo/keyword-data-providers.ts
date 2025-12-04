// SEO Keyword Data Providers
// Provides free and low-cost alternatives to paid APIs

export interface KeywordData {
  keyword: string;
  searchVolume?: number | string; // Can be estimate like "1K-10K"
  difficulty?: number; // 0-100
  cpc?: number; // Cost per click
  competition?: 'low' | 'medium' | 'high';
  trend?: 'rising' | 'stable' | 'declining';
  topCompetitors?: {
    url: string;
    title: string;
    domain: string;
    position?: number;
  }[];
  relatedKeywords?: string[];
  source: 'serpapi' | 'gsc' | 'internal' | 'dataforseo' | 'estimated';
  confidence?: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

/**
 * Get keyword data from multiple sources with fallback
 * 
 * Priority order:
 * 1. SerpAPI (if configured and has quota)
 * 2. Internal analysis from GSC data
 * 3. Estimated data (basic fallback)
 */
export async function getKeywordData(
  keyword: string,
  preferredSource: 'auto' | 'serpapi' | 'gsc' | 'internal' = 'auto'
): Promise<KeywordData> {
  // Try sources in order of preference
  if (preferredSource === 'serpapi' || preferredSource === 'auto') {
    try {
      const serpData = await getDataFromSerpAPI(keyword);
      if (serpData) {
        return serpData;
      }
    } catch (error) {
      console.warn(`⚠️ SerpAPI failed for "${keyword}", falling back:`, error);
    }
  }
  
  // Fallback to internal calculation from GSC data
  if (preferredSource === 'internal' || preferredSource === 'auto') {
    try {
      const internalData = await getDataFromInternalAnalysis(keyword);
      if (internalData) {
        return internalData;
      }
    } catch (error) {
      console.warn(`⚠️ Internal analysis failed for "${keyword}":`, error);
    }
  }
  
  // Last resort: Return estimated data
  return getEstimatedData(keyword);
}

/**
 * Get data from SerpAPI (100 free searches/month)
 */
async function getDataFromSerpAPI(keyword: string): Promise<KeywordData | null> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://serpapi.com/search?` +
      new URLSearchParams({
        q: keyword,
        api_key: apiKey,
        engine: 'google',
        google_domain: 'google.com.vn',
        gl: 'vn',
        hl: 'vi',
        num: '10',
      }),
      {
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      }
    );
    
    // Check for specific error status codes
    if (response.status === 401) {
      console.error('❌ SerpAPI: Invalid API key');
      return null;
    }
    
    if (response.status === 429) {
      console.warn('⚠️ SerpAPI: Rate limit exceeded (100 searches/month), falling back to internal analysis');
      return null;
    }
    
    if (response.status === 403) {
      console.error('❌ SerpAPI: Access forbidden - check your account status');
      return null;
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ SerpAPI error ${response.status}: ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if API returned an error message
    if (data.error) {
      console.error(`❌ SerpAPI returned error: ${data.error}`);
      return null;
    }
    
    // Validate response data
    if (!data.organic_results || data.organic_results.length === 0) {
      console.warn(`⚠️ SerpAPI returned no results for keyword: ${keyword}`);
      // Still return null to trigger fallback, but log for debugging
      return null;
    }
    
    // Extract useful data from SERP
    const organicResults = data.organic_results || [];
    const relatedSearches = data.related_searches || [];
    const adsCount = data.ads?.length || 0;
    
    return {
      keyword,
      searchVolume: estimateVolumeFromSERP(organicResults, relatedSearches, adsCount),
      difficulty: calculateDifficultyFromSERP(organicResults, adsCount),
      competition: adsCount > 5 ? 'high' : adsCount > 2 ? 'medium' : 'low',
      topCompetitors: organicResults.slice(0, 10).map((r: any, idx: number) => ({
        url: r.link,
        title: r.title,
        domain: extractDomain(r.link),
        position: idx + 1,
      })),
      relatedKeywords: relatedSearches.map((r: any) => r.query).slice(0, 10),
      source: 'serpapi',
      confidence: 'high',
      lastUpdated: new Date(),
    };
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('❌ SerpAPI: Request timeout after 10 seconds');
      } else if (error.message.includes('fetch')) {
        console.error('❌ SerpAPI: Network error -', error.message);
      } else {
        console.error('❌ SerpAPI: Unexpected error -', error.message);
      }
    } else {
      console.error('❌ SerpAPI: Unknown error:', error);
    }
    
    // Always return null to trigger fallback to internal analysis
    return null;
  }
}

/**
 * Calculate keyword data from internal GSC data and historical analysis
 */
async function getDataFromInternalAnalysis(keyword: string): Promise<KeywordData | null> {
  const { getCollections } = await import('@/lib/db');
  const { seoKeywords } = await getCollections();
  
  const keywordData = await seoKeywords.findOne({ keyword });
  
  if (!keywordData) {
    return null;
  }
  
  // Calculate metrics from historical data
  const rankingHistory = keywordData.rankingHistory || [];
  
  if (rankingHistory.length === 0) {
    return null;
  }
  
  // Average position
  const avgPosition = rankingHistory.reduce((sum: number, h: any) => sum + h.position, 0) / rankingHistory.length;
  
  // Position volatility (standard deviation)
  const volatility = calculateVolatility(rankingHistory.map((h: any) => h.position));
  
  // Estimate difficulty based on position and volatility
  let difficulty = 0;
  
  // Worse position = higher difficulty
  difficulty += Math.min((avgPosition / 100) * 40, 40);
  
  // High volatility = competitive (higher difficulty)
  difficulty += Math.min((volatility / 10) * 30, 30);
  
  // Low CTR at good position = high difficulty (strong competitors)
  const currentPosition = keywordData.position || avgPosition;
  const expectedCTR = getExpectedCTRByPosition(currentPosition);
  const actualCTR = keywordData.ctr || 0;
  
  if (actualCTR < expectedCTR * 0.7) {
    difficulty += 30;
  }
  
  // Estimate search volume from impressions
  const avgImpressions = rankingHistory.reduce((sum: number, h: any) => sum + (h.impressions || 0), 0) / rankingHistory.length;
  const estimatedVolume = estimateVolumeFromImpressions(avgImpressions, currentPosition);
  
  // Determine trend
  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (rankingHistory.length >= 7) {
    const recent = rankingHistory.slice(-7);
    const older = rankingHistory.slice(-14, -7);
    
    if (older.length > 0) {
      const recentAvg = recent.reduce((sum: number, h: any) => sum + h.position, 0) / recent.length;
      const olderAvg = older.reduce((sum: number, h: any) => sum + h.position, 0) / older.length;
      
      if (recentAvg < olderAvg - 2) {
        trend = 'rising'; // Position improving
      } else if (recentAvg > olderAvg + 2) {
        trend = 'declining'; // Position worsening
      }
    }
  }
  
  return {
    keyword,
    searchVolume: estimatedVolume,
    difficulty: Math.min(Math.round(difficulty), 100),
    competition: difficulty > 70 ? 'high' : difficulty > 40 ? 'medium' : 'low',
    trend,
    source: 'internal',
    confidence: rankingHistory.length >= 30 ? 'high' : 'medium',
    lastUpdated: new Date(),
  };
}

/**
 * Return estimated data when no other source is available
 */
function getEstimatedData(keyword: string): KeywordData {
  // Very basic estimation based on keyword characteristics
  const wordCount = keyword.split(' ').length;
  const isLongTail = wordCount >= 3;
  
  return {
    keyword,
    searchVolume: isLongTail ? 'Low (100-1K)' : 'Medium (1K-10K)',
    difficulty: isLongTail ? 30 : 60,
    competition: isLongTail ? 'low' : 'medium',
    trend: 'stable',
    source: 'estimated',
    confidence: 'low',
    lastUpdated: new Date(),
  };
}

// Helper functions

function estimateVolumeFromSERP(results: any[], relatedSearches: any[], adsCount: number): string {
  const resultCount = results.length;
  const hasWikipedia = results.some((r: any) => r.link?.includes('wikipedia.org'));
  const hasMajorSites = results.some((r: any) => 
    ['amazon.', 'youtube.', 'facebook.', 'instagram.'].some(site => r.link?.includes(site))
  );
  
  // High volume indicators
  if (adsCount >= 5 && hasMajorSites && relatedSearches.length >= 8) {
    return 'High (10K+)';
  }
  
  // Medium-high volume
  if (adsCount >= 3 && resultCount >= 10 && relatedSearches.length >= 5) {
    return 'Medium-High (5K-10K)';
  }
  
  // Medium volume
  if (resultCount >= 10 && (relatedSearches.length >= 3 || adsCount >= 2)) {
    return 'Medium (1K-5K)';
  }
  
  // Low volume
  if (resultCount >= 5) {
    return 'Low (100-1K)';
  }
  
  return 'Very Low (<100)';
}

function calculateDifficultyFromSERP(results: any[], adsCount: number): number {
  let score = 20; // Base score
  
  const topDomains = results.slice(0, 10).map((r: any) => extractDomain(r.link));
  
  // High authority domains increase difficulty
  const highAuthorityDomains = [
    'wikipedia.org',
    'amazon.',
    'youtube.',
    'facebook.',
    'instagram.',
    'linkedin.',
    'twitter.',
  ];
  
  const hasHighAuthority = topDomains.some(domain =>
    highAuthorityDomains.some(auth => domain.includes(auth))
  );
  
  if (hasHighAuthority) score += 25;
  
  // Many ads = competitive = difficult
  score += Math.min(adsCount * 5, 25);
  
  // Full SERP = competitive
  if (results.length >= 10) score += 15;
  
  // Featured snippet = competitive
  if (results[0]?.snippet_highlighted_words) score += 15;
  
  return Math.min(score, 100);
}

function calculateVolatility(positions: number[]): number {
  if (positions.length < 2) return 0;
  
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  const squaredDiffs = positions.map(pos => Math.pow(pos - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / positions.length;
  
  return Math.sqrt(variance);
}

function getExpectedCTRByPosition(position: number): number {
  // Industry average CTR by position (Google SERP)
  const ctrTable: { [key: number]: number } = {
    1: 0.316,  // 31.6%
    2: 0.158,  // 15.8%
    3: 0.108,  // 10.8%
    4: 0.081,  // 8.1%
    5: 0.064,  // 6.4%
    6: 0.053,  // 5.3%
    7: 0.044,  // 4.4%
    8: 0.038,  // 3.8%
    9: 0.033,  // 3.3%
    10: 0.029, // 2.9%
  };
  
  const roundedPos = Math.round(position);
  return ctrTable[roundedPos] || (roundedPos <= 20 ? 0.01 : 0.001);
}

function estimateVolumeFromImpressions(avgImpressions: number, position: number): string | number {
  const expectedCTR = getExpectedCTRByPosition(position);
  
  // If we assume position X gets Y% CTR, then:
  // impressions ≈ totalSearchVolume * impressionShare
  // Rough estimation
  const estimatedVolume = avgImpressions / Math.max(expectedCTR, 0.01);
  
  if (estimatedVolume > 10000) return 'High (10K+)';
  if (estimatedVolume > 5000) return 'Medium-High (5K-10K)';
  if (estimatedVolume > 1000) return 'Medium (1K-5K)';
  if (estimatedVolume > 100) return 'Low (100-1K)';
  return 'Very Low (<100)';
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

