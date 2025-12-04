/**
 * Query Optimizer
 * Optimizes database queries for SEO data
 */

import { getCollections } from '@/lib/db';

/**
 * Optimized query for SEO analyses with pagination
 */
export async function getOptimizedAnalyses(options: {
  entityType?: string;
  entityId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}) {
  const { seoAnalysis } = await getCollections();
  const {
    entityType,
    entityId,
    page = 1,
    limit = 20,
    sort = 'analyzedAt',
    order = 'desc',
  } = options;

  // Build query
  const query: any = {};
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  // Build sort
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Use projection to only fetch needed fields
  const projection: any = {
    id: 1,
    entityType: 1,
    entityId: 1,
    entitySlug: 1,
    overallScore: 1,
    seoScore: 1,
    readabilityScore: 1,
    issues: 1,
    analyzedAt: 1,
  };

  // Get total count (can be optimized with estimated count for large datasets)
  const total = await seoAnalysis.countDocuments(query);

  // Fetch with limit và skip
  const analyses = await seoAnalysis
    .find(query, { projection })
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    analyses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Optimized query for keywords with aggregation
 */
export async function getOptimizedKeywords(options: {
  status?: string;
  entityType?: string;
  limit?: number;
}) {
  const { keywordTracking } = await getCollections();
  const { status, entityType, limit = 100 } = options;

  const query: any = {};
  if (status) query.status = status;
  if (entityType) query.entityType = entityType;

  // Use aggregation for better performance
  const pipeline: any[] = [
    { $match: query },
    {
      $project: {
        id: 1,
        keyword: 1,
        entityType: 1,
        currentRank: 1,
        previousRank: 1,
        searchVolume: 1,
        difficulty: 1,
        status: 1,
        trackedAt: 1,
      },
    },
    { $limit: limit },
  ];

  const keywords = await keywordTracking.aggregate(pipeline).toArray();

  return keywords;
}

/**
 * Batch update for better performance
 */
export async function batchUpdateAnalyses(
  updates: Array<{ id: string; data: Record<string, any> }>
) {
  const { seoAnalysis } = await getCollections();
  const bulkOps = updates.map(({ id, data }) => ({
    updateOne: {
      filter: { id },
      update: {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    },
  }));

  if (bulkOps.length === 0) return { modifiedCount: 0 };

  const result = await seoAnalysis.bulkWrite(bulkOps);
  return {
    modifiedCount: result.modifiedCount,
  };
}

/**
 * Get statistics with aggregation (optimized)
 */
export async function getOptimizedStatistics(entityType?: string) {
  const { seoAnalysis } = await getCollections();

  const matchStage: any = {};
  if (entityType) {
    matchStage.entityType = entityType;
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        averageScore: { $avg: '$overallScore' },
        minScore: { $min: '$overallScore' },
        maxScore: { $max: '$overallScore' },
        totalIssues: {
          $sum: { $size: { $ifNull: ['$issues', []] } },
        },
      },
    },
  ];

  const result = await seoAnalysis.aggregate(pipeline).toArray();
  return result[0] || {
    totalAnalyses: 0,
    averageScore: 0,
    minScore: 0,
    maxScore: 0,
    totalIssues: 0,
  };
}




