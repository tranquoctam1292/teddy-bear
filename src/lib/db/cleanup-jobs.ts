// Database Cleanup Jobs
import { getCollections } from '@/lib/db';

export interface RetentionPolicy {
  retention: number; // days
  archiveAfter?: number; // days
  aggregateAfter?: number; // days
}

export const RETENTION_POLICIES: Record<string, RetentionPolicy> = {
  '404_errors': {
    retention: 90, // Keep for 90 days
    archiveAfter: 30, // Archive after 30 days
    aggregateAfter: 7, // Aggregate duplicates after 7 days
  },
  'keyword_ranking': {
    retention: 365, // Keep for 1 year
    aggregateAfter: 90, // Aggregate to weekly after 90 days
  },
  'seo_analysis': {
    retention: 180, // Keep for 6 months
  },
  'ai_usage': {
    retention: 90, // Keep for 90 days
  },
  'backlinks': {
    retention: 365, // Keep for 1 year
  },
};

/**
 * Cleanup old 404 error logs
 */
export async function cleanup404Errors(): Promise<number> {
  const { errorLogs } = await getCollections();
  
  const policy = RETENTION_POLICIES['404_errors'];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - policy.retention);
  
  // Delete very old errors
  const result = await errorLogs.deleteMany({
    type: '404',
    timestamp: { $lt: cutoffDate },
  });
  
  // Aggregate duplicate 404s
  if (policy.aggregateAfter) {
    const aggregateDate = new Date();
    aggregateDate.setDate(aggregateDate.getDate() - policy.aggregateAfter);
    
    // Find duplicate URLs and keep only the most recent
    const duplicates = await errorLogs
      .aggregate([
        {
          $match: {
            type: '404',
            timestamp: { $lt: aggregateDate },
          },
        },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
            first: { $first: '$$ROOT' },
            latest: { $max: '$timestamp' },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
      ])
      .toArray();
    
    let aggregated = 0;
    for (const dup of duplicates) {
      // Keep the first occurrence but update its count
      await errorLogs.updateOne(
        { _id: dup.first._id },
        {
          $set: {
            count: dup.count,
            lastOccurrence: dup.latest,
            aggregated: true,
          },
        }
      );
      
      // Delete other occurrences
      const deleteResult = await errorLogs.deleteMany({
        url: dup._id,
        _id: { $ne: dup.first._id },
        timestamp: { $lt: aggregateDate },
      });
      
      aggregated += deleteResult.deletedCount;
    }
  }
  
  return result.deletedCount;
}

/**
 * Aggregate old keyword ranking history
 */
export async function aggregateKeywordRankings(): Promise<number> {
  const { seoKeywords } = await getCollections();
  
  const policy = RETENTION_POLICIES['keyword_ranking'];
  const dailyCutoff = new Date();
  dailyCutoff.setDate(dailyCutoff.getDate() - policy.aggregateAfter!);
  
  // Get all keywords with ranking history
  const keywords = await seoKeywords.find({
    rankingHistory: { $exists: true, $ne: [] },
  }).toArray();
  
  let totalAggregated = 0;
  
  for (const keyword of keywords) {
    if (!keyword.rankingHistory || keyword.rankingHistory.length === 0) continue;
    
    // Separate daily (recent) and old data
    const dailyHistory = keyword.rankingHistory.filter(
      (h: any) => new Date(h.date) >= dailyCutoff
    );
    
    const oldHistory = keyword.rankingHistory.filter(
      (h: any) => new Date(h.date) < dailyCutoff
    );
    
    if (oldHistory.length === 0) continue;
    
    // Aggregate old data by week
    const weeklyAggregated = aggregateByWeek(oldHistory);
    
    // Update keyword with new history
    await seoKeywords.updateOne(
      { _id: keyword._id },
      {
        $set: {
          rankingHistory: [...dailyHistory, ...weeklyAggregated],
          lastAggregatedAt: new Date(),
        },
      }
    );
    
    totalAggregated += oldHistory.length - weeklyAggregated.length;
  }
  
  return totalAggregated;
}

/**
 * Aggregate data points by week
 */
function aggregateByWeek(history: any[]): any[] {
  const weeks = new Map<string, any[]>();
  
  history.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey)!.push(entry);
  });
  
  return Array.from(weeks.entries()).map(([weekKey, entries]) => ({
    date: new Date(weekKey),
    position: average(entries.map(e => e.position)),
    clicks: sum(entries.map(e => e.clicks || 0)),
    impressions: sum(entries.map(e => e.impressions || 0)),
    ctr: average(entries.map(e => e.ctr || 0)),
    aggregated: true,
    originalCount: entries.length,
  }));
}

function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Cleanup old SEO analyses (keep latest per entity)
 */
export async function cleanupOldAnalyses(): Promise<number> {
  const { seoAnalysis } = await getCollections();
  
  const policy = RETENTION_POLICIES['seo_analysis'];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - policy.retention);
  
  // Get all unique entities
  const entities = await seoAnalysis.distinct('entityId');
  
  let totalDeleted = 0;
  
  for (const entityId of entities) {
    // Get all analyses for this entity, sorted by date (newest first)
    const analyses = await seoAnalysis
      .find({ entityId })
      .sort({ analyzedAt: -1 })
      .toArray();
    
    if (analyses.length <= 1) continue;
    
    // Keep the first (latest), delete rest if older than retention
    const toDelete = analyses.slice(1).filter(
      a => new Date(a.analyzedAt) < cutoffDate
    );
    
    if (toDelete.length > 0) {
      const result = await seoAnalysis.deleteMany({
        _id: { $in: toDelete.map(a => a._id) },
      });
      totalDeleted += result.deletedCount;
    }
  }
  
  return totalDeleted;
}

/**
 * Cleanup old AI usage logs
 */
export async function cleanupAIUsageLogs(): Promise<number> {
  const { aiUsageLogs } = await getCollections();
  
  const policy = RETENTION_POLICIES['ai_usage'];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - policy.retention);
  
  const result = await aiUsageLogs.deleteMany({
    timestamp: { $lt: cutoffDate },
  });
  
  return result.deletedCount;
}

/**
 * Run all cleanup jobs
 */
export async function runAllCleanupJobs(): Promise<{
  success: boolean;
  results: {
    errors404: number;
    keywordRankings: number;
    seoAnalyses: number;
    aiUsageLogs: number;
  };
  duration: number;
}> {
  const startTime = Date.now();
  
  try {
    const [errors404, keywordRankings, seoAnalyses, aiUsageLogs] = await Promise.all([
      cleanup404Errors(),
      aggregateKeywordRankings(),
      cleanupOldAnalyses(),
      cleanupAIUsageLogs(),
    ]);
    
  const duration = Date.now() - startTime;
  
  return {
      success: true,
      results: {
        errors404,
        keywordRankings,
        seoAnalyses,
        aiUsageLogs,
      },
      duration,
    };
  } catch (error) {
    console.error('Error during cleanup jobs:', error);
    throw error;
  }
}

/**
 * Get database size statistics
 */
export async function getDbSizeStats(): Promise<{
  totalSize: number;
  dataSize: number;
  indexSize: number;
  collections: {
    name: string;
    size: number;
    count: number;
  }[];
}> {
  const db = (await getCollections()).products.db;
  const stats = await db.stats();
  
  // Get size for each collection
  const collectionNames = [
    'errorLogs',
    'seoKeywords',
    'seoAnalysis',
    'aiUsageLogs',
    'backlinks',
  ];
  
  const collections = await Promise.all(
    collectionNames.map(async name => {
      try {
        const coll = db.collection(name);
        const collStats = await coll.stats();
        return {
          name,
          size: collStats.size || 0,
          count: collStats.count || 0,
        };
      } catch {
        return { name, size: 0, count: 0 };
      }
    })
  );
  
  return {
    totalSize: stats.dataSize + stats.indexSize,
    dataSize: stats.dataSize,
    indexSize: stats.indexSize,
    collections,
  };
}

