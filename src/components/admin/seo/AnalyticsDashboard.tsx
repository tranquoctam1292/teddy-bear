'use client';

/**
 * Analytics Dashboard Component
 * Displays SEO analytics with charts and metrics
 */
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Select } from '@/components/admin/ui/select';
import { Badge } from '@/components/admin/ui/badge';

interface AnalyticsDashboardProps {
  days?: number;
}

export default function AnalyticsDashboard({ days = 30 }: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<any>(null);
  const [keywordRankings, setKeywordRankings] = useState<any>(null);
  const [issues, setIssues] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [selectedDays, setSelectedDays] = useState(days);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDays]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [trendsRes, rankingsRes, issuesRes, performanceRes] = await Promise.all([
        fetch(`/api/admin/seo/analytics/trends?days=${selectedDays}`),
        fetch(`/api/admin/seo/analytics/keyword-rankings?days=${selectedDays}`),
        fetch(`/api/admin/seo/analytics/issues?days=${selectedDays}`),
        fetch(`/api/admin/seo/analytics/performance?days=${selectedDays}`),
      ]);

      const [trendsData, rankingsData, issuesData, performanceData] = await Promise.all([
        trendsRes.json(),
        rankingsRes.json(),
        issuesRes.json(),
        performanceRes.json(),
      ]);

      if (trendsData.success) setTrends(trendsData.data);
      if (rankingsData.success) setKeywordRankings(rankingsData.data);
      if (issuesData.success) setIssues(issuesData.data);
      if (performanceData.success) setPerformance(performanceData.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Period Selector */}
      <header className="flex items-center gap-4">
        <label className="text-sm font-medium">Thời gian:</label>
        <Select
          value={selectedDays.toString()}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        >
          <option value="7">7 ngày</option>
          <option value="30">30 ngày</option>
          <option value="90">90 ngày</option>
          <option value="180">6 tháng</option>
          <option value="365">1 năm</option>
        </Select>
      </header>

      {/* Performance Metrics */}
      {performance && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Performance metrics">
          {/* SEO Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Điểm SEO TB</p>
                  <p className="text-2xl font-bold">
                    {performance.metrics.seo.averageScore}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(
                      performance.metrics.seo.scoreChange > 0
                        ? 'up'
                        : performance.metrics.seo.scoreChange < 0
                        ? 'down'
                        : 'stable'
                    )}
                    <span
                      className={`text-xs ${
                        performance.metrics.seo.scoreChange > 0
                          ? 'text-green-600'
                          : performance.metrics.seo.scoreChange < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {performance.metrics.seo.scoreChange > 0 ? '+' : ''}
                      {performance.metrics.seo.scoreChange}
                    </span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Từ khóa</p>
                  <p className="text-2xl font-bold">
                    {performance.metrics.keywords.totalKeywords}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Thứ hạng TB: {performance.metrics.keywords.averageRank}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vấn đề</p>
                  <p className="text-2xl font-bold">
                    {performance.metrics.seo.totalIssues}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đã giải quyết: {performance.metrics.seo.resolvedIssues}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* 404 Errors */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lỗi 404</p>
                  <p className="text-2xl font-bold">
                    {performance.metrics.errors404.active404Errors}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đã giải quyết: {performance.metrics.errors404.resolved404Errors}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* SEO Score Trends */}
      {trends && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Xu hướng Điểm SEO
            </CardTitle>
            <CardDescription>
              Biểu đồ điểm SEO theo thời gian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Điểm hiện tại</p>
                  <p className="text-2xl font-bold">
                    {trends.summary.currentAverage}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Thay đổi</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(trends.summary.trend)}
                    <span
                      className={`text-lg font-semibold ${
                        trends.summary.trend === 'up'
                          ? 'text-green-600'
                          : trends.summary.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {trends.summary.scoreChange > 0 ? '+' : ''}
                      {trends.summary.scoreChange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simple Chart (text-based) */}
              <div className="space-y-2">
                {trends.trends.slice(-10).map((trend: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(trend.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 bg-blue-500 rounded"
                          style={{
                            width: `${(trend.averageScore / 100) * 100}%`,
                            minWidth: '20px',
                          }}
                        />
                        <span className="text-sm font-medium w-12">
                          {trend.averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {trend.pageCount} trang
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyword Rankings */}
      {keywordRankings && (
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng Thứ hạng Từ khóa</CardTitle>
            <CardDescription>
              Top {keywordRankings.charts.length} từ khóa đang được theo dõi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">
                    {keywordRankings.summary.improved}
                  </p>
                  <p className="text-xs text-gray-600">Cải thiện</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">
                    {keywordRankings.summary.declined}
                  </p>
                  <p className="text-xs text-gray-600">Giảm</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">
                    {keywordRankings.summary.stable}
                  </p>
                  <p className="text-xs text-gray-600">Ổn định</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">
                    {keywordRankings.summary.averageRank}
                  </p>
                  <p className="text-xs text-gray-600">Thứ hạng TB</p>
                </div>
              </div>

              {/* Keyword List */}
              <div className="space-y-2">
                {keywordRankings.charts.slice(0, 10).map((chart: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{chart.keyword}</span>
                        <Badge variant="outline" className="ml-2">
                          {chart.entityType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            #{chart.currentRank || 'N/A'}
                          </div>
                          {chart.rankChange !== 0 && (
                            <div
                              className={`text-xs ${
                                chart.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {chart.rankChange > 0 ? '+' : ''}
                              {chart.rankChange}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Resolution */}
      {issues && (
        <Card>
          <CardHeader>
            <CardTitle>Theo dõi Giải quyết Vấn đề</CardTitle>
            <CardDescription>
              Tỷ lệ giải quyết vấn đề SEO theo thời gian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng vấn đề hiện tại</p>
                  <p className="text-2xl font-bold">
                    {issues.summary.currentTotalIssues}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tỷ lệ giải quyết</p>
                  <p className="text-2xl font-bold text-green-600">
                    {issues.summary.resolutionRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Trend */}
              <div className="space-y-2">
                {issues.trends.slice(-10).map((trend: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(trend.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-red-500"
                            style={{
                              width: `${Math.min((trend.totalIssues / 100) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {trend.totalIssues}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {trend.errors} errors, {trend.warnings} warnings, {trend.resolvedIssues} resolved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}



