'use client';

/**
 * Keyword Performance Dashboard Component
 * Shows overall keyword performance metrics
 */
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Select } from '@/components/admin/ui/select';

interface KeywordPerformanceDashboardProps {
  days?: number;
}

export default function KeywordPerformanceDashboard({ days = 30 }: KeywordPerformanceDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedDays, setSelectedDays] = useState(days);

  useEffect(() => {
    fetchStats();
  }, [selectedDays]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/seo/keywords/performance?days=${selectedDays}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching keyword performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Thời gian:</label>
        <Select
          value={selectedDays.toString()}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        >
          <option value="7">7 ngày</option>
          <option value="30">30 ngày</option>
          <option value="90">90 ngày</option>
          <option value="180">6 tháng</option>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng từ khóa</p>
                <p className="text-2xl font-bold">{stats.totalKeywords}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thứ hạng TB</p>
                <p className="text-2xl font-bold">
                  {stats.averageRank ? `#${stats.averageRank}` : 'N/A'}
                </p>
                {stats.rankChange !== undefined && stats.rankChange !== 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {stats.rankChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-xs ${
                        stats.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stats.rankChange > 0 ? '+' : ''}
                      {stats.rankChange}
                    </span>
                  </div>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cải thiện</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.improved}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalKeywords > 0
                    ? Math.round((stats.improved / stats.totalKeywords) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đạt mục tiêu</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.achievedTargets || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalKeywords > 0
                    ? Math.round(((stats.achievedTargets || 0) / stats.totalKeywords) * 100)
                    : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {stats.topPerformers && stats.topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Từ khóa cải thiện nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topPerformers.map((performer: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{performer.keyword}</span>
                    <span className="text-xs text-gray-600 ml-2">
                      ({performer.entityType})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-700">
                      +{performer.rankChange} vị trí
                    </div>
                    <div className="text-xs text-gray-600">
                      {performer.previousRank} → {performer.currentRank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Decliners */}
      {stats.topDecliners && stats.topDecliners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Decliners</CardTitle>
            <CardDescription>Từ khóa giảm hạng nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topDecliners.map((decliner: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{decliner.keyword}</span>
                    <span className="text-xs text-gray-600 ml-2">
                      ({decliner.entityType})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-700">
                      {decliner.rankChange} vị trí
                    </div>
                    <div className="text-xs text-gray-600">
                      {decliner.previousRank} → {decliner.currentRank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



