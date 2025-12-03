/**
 * SEO Report Generator
 * Generates various SEO reports (Audit, Keyword Performance, Content Analysis)
 */

import type { SEOAnalysis } from '@/lib/schemas/seo-analysis';
import type { KeywordTracking } from '@/lib/schemas/keyword-tracking';

export interface SEOAuditReport {
  reportId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalPages: number;
    averageScore: number;
    scoreDistribution: {
      excellent: number; // 80-100
      good: number; // 60-79
      needsImprovement: number; // 40-59
      poor: number; // 0-39
    };
    totalIssues: number;
    issuesByType: {
      error: number;
      warning: number;
      info: number;
    };
    issuesByField: Record<string, number>;
  };
  topIssues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    field: string;
    affectedPages: number;
    suggestion: string;
  }>;
  scoreTrend: Array<{
    date: string;
    averageScore: number;
    pageCount: number;
  }>;
  recommendations: string[];
}

export interface KeywordPerformanceReport {
  reportId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalKeywords: number;
    trackingKeywords: number;
    improvedKeywords: number;
    declinedKeywords: number;
    stableKeywords: number;
    averageRank: number;
    averageRankChange: number;
  };
  topPerformers: Array<{
    keyword: string;
    currentRank: number;
    previousRank?: number;
    rankChange: number;
    searchVolume?: number;
    entityType: string;
  }>;
  topDecliners: Array<{
    keyword: string;
    currentRank: number;
    previousRank?: number;
    rankChange: number;
    entityType: string;
  }>;
  rankingTrends: Array<{
    keyword: string;
    history: Array<{
      date: string;
      rank?: number;
    }>;
  }>;
  recommendations: string[];
}

export interface ContentAnalysisReport {
  reportId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalContent: number;
    averageWordCount: number;
    averageReadabilityScore: number;
    contentWithImages: number;
    contentWithInternalLinks: number;
    contentWithSchema: number;
  };
  contentQuality: {
    excellent: number; // 80-100
    good: number; // 60-79
    needsImprovement: number; // 40-59
    poor: number; // 0-39
  };
  readabilityDistribution: {
    veryEasy: number; // 90-100
    easy: number; // 80-89
    fairlyEasy: number; // 70-79
    standard: number; // 60-69
    fairlyDifficult: number; // 50-59
    difficult: number; // 30-49
    veryDifficult: number; // 0-29
  };
  topContent: Array<{
    entityType: string;
    entityId: string;
    entitySlug: string;
    overallScore: number;
    wordCount: number;
    readabilityScore: number;
  }>;
  recommendations: string[];
}

/**
 * Generate SEO Audit Report
 */
export function generateSEOAuditReport(
  analyses: SEOAnalysis[],
  period: { start: Date; end: Date }
): SEOAuditReport {
  const reportId = `audit-${Date.now()}`;
  
  // Calculate summary
  const totalPages = analyses.length;
  const averageScore =
    totalPages > 0
      ? analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / totalPages
      : 0;

  // Score distribution
  const scoreDistribution = {
    excellent: analyses.filter(a => (a.overallScore || 0) >= 80).length,
    good: analyses.filter(a => (a.overallScore || 0) >= 60 && (a.overallScore || 0) < 80).length,
    needsImprovement: analyses.filter(a => (a.overallScore || 0) >= 40 && (a.overallScore || 0) < 60).length,
    poor: analyses.filter(a => (a.overallScore || 0) < 40).length,
  };

  // Issues analysis
  const allIssues = analyses.flatMap(a => a.issues || []);
  const totalIssues = allIssues.length;
  const issuesByType = {
    error: allIssues.filter(i => i.type === 'error').length,
    warning: allIssues.filter(i => i.type === 'warning').length,
    info: allIssues.filter(i => i.type === 'info').length,
  };

  // Issues by field
  const issuesByField: Record<string, number> = {};
  allIssues.forEach(issue => {
    issuesByField[issue.field] = (issuesByField[issue.field] || 0) + 1;
  });

  // Top issues (most common)
  const issueCounts: Record<string, { count: number; type: string; field: string; suggestion: string }> = {};
  allIssues.forEach(issue => {
    const key = `${issue.field}:${issue.message}`;
    if (!issueCounts[key]) {
      issueCounts[key] = {
        count: 0,
        type: issue.type,
        field: issue.field,
        suggestion: issue.suggestion || '',
      };
    }
    issueCounts[key].count++;
  });

  const topIssues = Object.entries(issueCounts)
    .map(([key, data]) => ({
      type: data.type as 'error' | 'warning' | 'info',
      message: key.split(':')[1],
      field: data.field,
      affectedPages: data.count,
      suggestion: data.suggestion,
    }))
    .sort((a, b) => b.affectedPages - a.affectedPages)
    .slice(0, 10);

  // Score trend (group by date)
  const scoreTrendMap: Record<string, { total: number; count: number }> = {};
  analyses.forEach(analysis => {
    const date = new Date(analysis.analyzedAt).toISOString().split('T')[0];
    if (!scoreTrendMap[date]) {
      scoreTrendMap[date] = { total: 0, count: 0 };
    }
    scoreTrendMap[date].total += analysis.overallScore || 0;
    scoreTrendMap[date].count++;
  });

  const scoreTrend = Object.entries(scoreTrendMap)
    .map(([date, data]) => ({
      date,
      averageScore: data.count > 0 ? data.total / data.count : 0,
      pageCount: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (scoreDistribution.poor > 0) {
    recommendations.push(`${scoreDistribution.poor} trang có điểm SEO thấp (<40). Ưu tiên cải thiện các trang này.`);
  }
  
  if (issuesByType.error > 0) {
    recommendations.push(`${issuesByType.error} lỗi SEO cần được sửa ngay lập tức.`);
  }
  
  if (issuesByType.warning > 0) {
    recommendations.push(`${issuesByType.warning} cảnh báo SEO nên được xử lý để cải thiện điểm số.`);
  }
  
  if (averageScore < 60) {
    recommendations.push('Điểm SEO trung bình thấp. Cần cải thiện tổng thể chất lượng SEO.');
  }

  return {
    reportId,
    generatedAt: new Date(),
    period,
    summary: {
      totalPages,
      averageScore: Math.round(averageScore * 10) / 10,
      scoreDistribution,
      totalIssues,
      issuesByType,
      issuesByField,
    },
    topIssues,
    scoreTrend,
    recommendations,
  };
}

/**
 * Generate Keyword Performance Report
 */
export function generateKeywordPerformanceReport(
  keywords: KeywordTracking[],
  period: { start: Date; end: Date }
): KeywordPerformanceReport {
  const reportId = `keyword-${Date.now()}`;
  
  const trackingKeywords = keywords.filter(k => k.status === 'tracking');
  const totalKeywords = keywords.length;

  // Calculate rank changes
  const keywordsWithChange = trackingKeywords
    .filter(k => k.currentRank !== undefined && k.previousRank !== undefined)
    .map(k => ({
      keyword: k.keyword,
      currentRank: k.currentRank!,
      previousRank: k.previousRank!,
      rankChange: k.previousRank! - k.currentRank!, // Positive = improved
      searchVolume: k.searchVolume,
      entityType: k.entityType,
    }));

  const improvedKeywords = keywordsWithChange.filter(k => k.rankChange > 0).length;
  const declinedKeywords = keywordsWithChange.filter(k => k.rankChange < 0).length;
  const stableKeywords = keywordsWithChange.filter(k => k.rankChange === 0).length;

  // Average rank
  const ranksWithValue = trackingKeywords
    .filter(k => k.currentRank !== undefined && k.currentRank !== null)
    .map(k => k.currentRank!);
  const averageRank =
    ranksWithValue.length > 0
      ? ranksWithValue.reduce((sum, r) => sum + r, 0) / ranksWithValue.length
      : 0;

  // Average rank change
  const averageRankChange =
    keywordsWithChange.length > 0
      ? keywordsWithChange.reduce((sum, k) => sum + k.rankChange, 0) / keywordsWithChange.length
      : 0;

  // Top performers (improved most)
  const topPerformers = [...keywordsWithChange]
    .filter(k => k.rankChange > 0)
    .sort((a, b) => b.rankChange - a.rankChange)
    .slice(0, 10);

  // Top decliners (declined most)
  const topDecliners = [...keywordsWithChange]
    .filter(k => k.rankChange < 0)
    .sort((a, b) => a.rankChange - b.rankChange)
    .slice(0, 10);

  // Ranking trends
  const rankingTrends = trackingKeywords
    .filter(k => k.rankingHistory && k.rankingHistory.length > 0)
    .map(k => ({
      keyword: k.keyword,
      history: k.rankingHistory!.map(entry => ({
        date: new Date(entry.date).toISOString().split('T')[0],
        rank: entry.rank,
      })),
    }))
    .slice(0, 10);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (declinedKeywords > improvedKeywords) {
    recommendations.push(`${declinedKeywords} từ khóa đang giảm hạng. Cần cải thiện nội dung và SEO cho các từ khóa này.`);
  }
  
  if (averageRank > 50) {
    recommendations.push(`Thứ hạng trung bình cao (>50). Cần tối ưu hóa nội dung để cải thiện thứ hạng.`);
  }
  
  if (topDecliners.length > 0) {
    recommendations.push(`Từ khóa "${topDecliners[0].keyword}" đang giảm hạng nhiều nhất. Ưu tiên cải thiện.`);
  }

  return {
    reportId,
    generatedAt: new Date(),
    period,
    summary: {
      totalKeywords,
      trackingKeywords: trackingKeywords.length,
      improvedKeywords,
      declinedKeywords,
      stableKeywords,
      averageRank: Math.round(averageRank * 10) / 10,
      averageRankChange: Math.round(averageRankChange * 10) / 10,
    },
    topPerformers,
    topDecliners,
    rankingTrends,
    recommendations,
  };
}

/**
 * Generate Content Analysis Report
 */
export function generateContentAnalysisReport(
  analyses: SEOAnalysis[],
  period: { start: Date; end: Date }
): ContentAnalysisReport {
  const reportId = `content-${Date.now()}`;
  
  const totalContent = analyses.length;
  
  // Calculate averages
  const wordCounts = analyses
    .map(a => a.contentAnalysis?.contentLength || 0)
    .filter(c => c > 0);
  const averageWordCount =
    wordCounts.length > 0
      ? wordCounts.reduce((sum, c) => sum + c, 0) / wordCounts.length
      : 0;

  const readabilityScores = analyses
    .map(a => a.contentAnalysis?.readabilityScore || a.readabilityScore || 0)
    .filter(s => s > 0);
  const averageReadabilityScore =
    readabilityScores.length > 0
      ? readabilityScores.reduce((sum, s) => sum + s, 0) / readabilityScores.length
      : 0;

  // Content statistics
  const contentWithImages = analyses.filter(
    a => a.contentAnalysis?.imageCount && a.contentAnalysis.imageCount > 0
  ).length;
  const contentWithInternalLinks = analyses.filter(
    a => a.contentAnalysis?.internalLinks && a.contentAnalysis.internalLinks > 0
  ).length;
  const contentWithSchema = analyses.filter(a => a.hasSchema).length;

  // Content quality distribution
  const contentQuality = {
    excellent: analyses.filter(a => (a.overallScore || 0) >= 80).length,
    good: analyses.filter(a => (a.overallScore || 0) >= 60 && (a.overallScore || 0) < 80).length,
    needsImprovement: analyses.filter(a => (a.overallScore || 0) >= 40 && (a.overallScore || 0) < 60).length,
    poor: analyses.filter(a => (a.overallScore || 0) < 40).length,
  };

  // Readability distribution
  const readabilityDistribution = {
    veryEasy: readabilityScores.filter(s => s >= 90).length,
    easy: readabilityScores.filter(s => s >= 80 && s < 90).length,
    fairlyEasy: readabilityScores.filter(s => s >= 70 && s < 80).length,
    standard: readabilityScores.filter(s => s >= 60 && s < 70).length,
    fairlyDifficult: readabilityScores.filter(s => s >= 50 && s < 60).length,
    difficult: readabilityScores.filter(s => s >= 30 && s < 50).length,
    veryDifficult: readabilityScores.filter(s => s < 30).length,
  };

  // Top content (by score)
  const topContent = analyses
    .map(a => ({
      entityType: a.entityType,
      entityId: a.entityId,
      entitySlug: a.entitySlug,
      overallScore: a.overallScore || 0,
      wordCount: a.contentAnalysis?.contentLength || 0,
      readabilityScore: a.contentAnalysis?.readabilityScore || a.readabilityScore || 0,
    }))
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (averageWordCount < 300) {
    recommendations.push('Độ dài nội dung trung bình thấp (<300 từ). Nên mở rộng nội dung để cải thiện SEO.');
  }
  
  if (averageReadabilityScore < 60) {
    recommendations.push('Điểm readability trung bình thấp. Cần cải thiện khả năng đọc của nội dung.');
  }
  
  if (contentWithImages < totalContent * 0.5) {
    recommendations.push('Nhiều nội dung thiếu hình ảnh. Thêm hình ảnh để cải thiện engagement.');
  }
  
  if (contentWithInternalLinks < totalContent * 0.5) {
    recommendations.push('Nhiều nội dung thiếu internal links. Thêm internal links để cải thiện SEO.');
  }

  return {
    reportId,
    generatedAt: new Date(),
    period,
    summary: {
      totalContent,
      averageWordCount: Math.round(averageWordCount),
      averageReadabilityScore: Math.round(averageReadabilityScore * 10) / 10,
      contentWithImages,
      contentWithInternalLinks,
      contentWithSchema,
    },
    contentQuality,
    readabilityDistribution,
    topContent,
    recommendations,
  };
}

/**
 * Report Template Types
 */
export type ReportType = 'seo-audit' | 'keyword-performance' | 'content-analysis';

export interface ReportTemplate {
  type: ReportType;
  name: string;
  description: string;
  defaultPeriod: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  sections: string[];
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    type: 'seo-audit',
    name: 'SEO Audit Report',
    description: 'Báo cáo tổng quan về SEO của toàn bộ website',
    defaultPeriod: 'month',
    sections: ['summary', 'topIssues', 'scoreTrend', 'recommendations'],
  },
  {
    type: 'keyword-performance',
    name: 'Keyword Performance Report',
    description: 'Báo cáo hiệu suất từ khóa và thứ hạng',
    defaultPeriod: 'month',
    sections: ['summary', 'topPerformers', 'topDecliners', 'rankingTrends', 'recommendations'],
  },
  {
    type: 'content-analysis',
    name: 'Content Analysis Report',
    description: 'Báo cáo phân tích chất lượng nội dung',
    defaultPeriod: 'month',
    sections: ['summary', 'contentQuality', 'readabilityDistribution', 'topContent', 'recommendations'],
  },
];


