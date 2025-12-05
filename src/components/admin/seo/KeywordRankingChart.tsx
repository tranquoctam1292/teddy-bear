'use client';

/**
 * Keyword Ranking Chart Component
 * Displays ranking history as a line chart
 */
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KeywordRankingChartProps {
  keyword: string;
  rankingHistory: Array<{
    date: Date | string;
    rank?: number;
  }>;
  currentRank?: number;
  previousRank?: number;
}

export default function KeywordRankingChart({
  keyword,
  rankingHistory,
  currentRank,
  previousRank,
}: KeywordRankingChartProps) {
  // Process history data
  const chartData = useMemo(() => {
    if (!rankingHistory || rankingHistory.length === 0) {
      return [];
    }

    return rankingHistory
      .map((entry) => ({
        date: new Date(entry.date).toISOString().split('T')[0],
        rank: entry.rank,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rankingHistory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const ranks = chartData
      .map((d) => d.rank)
      .filter((r): r is number => r !== undefined && r !== null);

    if (ranks.length === 0) {
      return {
        min: null,
        max: null,
        average: null,
        trend: null,
        change: null,
      };
    }

    const min = Math.min(...ranks);
    const max = Math.max(...ranks);
    const average = ranks.reduce((sum, r) => sum + r, 0) / ranks.length;

    // Calculate trend (comparing first and last)
    let trend: 'up' | 'down' | 'stable' | null = null;
    let change: number | null = null;

    if (ranks.length >= 2) {
      const firstRank = ranks[0];
      const lastRank = ranks[ranks.length - 1];
      change = firstRank - lastRank; // Positive = improved

      if (change > 0) {
        trend = 'up';
      } else if (change < 0) {
        trend = 'down';
      } else {
        trend = 'stable';
      }
    } else if (currentRank !== undefined && previousRank !== undefined) {
      change = previousRank - currentRank;
      if (change > 0) trend = 'up';
      else if (change < 0) trend = 'down';
      else trend = 'stable';
    }

    return { min, max, average: Math.round(average * 10) / 10, trend, change };
  }, [chartData, currentRank, previousRank]);

  // Calculate chart dimensions
  const maxRank = Math.max(...chartData.map((d) => d.rank || 100).filter((r) => r <= 100), 100);
  const minRank = Math.min(...chartData.map((d) => d.rank || 1).filter((r) => r >= 1), 1);
  const rankRange = maxRank - minRank || 1;

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Chưa có dữ liệu thứ hạng</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Thứ hạng hiện tại</div>
          <div className="text-xl font-bold text-gray-900">
            {currentRank !== undefined && currentRank !== null ? `#${currentRank}` : 'N/A'}
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Tốt nhất</div>
          <div className="text-xl font-bold text-gray-900">
            {stats.min !== null ? `#${stats.min}` : 'N/A'}
          </div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Trung bình</div>
          <div className="text-xl font-bold text-gray-900">
            {stats.average !== null ? `#${stats.average}` : 'N/A'}
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Xu hướng</div>
          <div className="flex items-center gap-1">
            {stats.trend === 'up' && (
              <>
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  +{stats.change}
                </span>
              </>
            )}
            {stats.trend === 'down' && (
              <>
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="text-lg font-bold text-red-600">
                  {stats.change}
                </span>
              </>
            )}
            {stats.trend === 'stable' && (
              <>
                <Minus className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-bold text-gray-600">0</span>
              </>
            )}
            {stats.trend === null && <span className="text-gray-400">-</span>}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-600">
            <span>{maxRank}</span>
            <span>{Math.round((maxRank + minRank) / 2)}</span>
            <span>{minRank}</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="border-t border-gray-200"
                  style={{ borderStyle: i === 0 ? 'none' : 'dashed' }}
                />
              ))}
            </div>

            {/* Data points and line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Line */}
              {chartData.length > 1 && (
                <polyline
                  points={chartData
                    .map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 100;
                      const y =
                        d.rank !== undefined && d.rank !== null
                          ? 100 - ((d.rank - minRank) / rankRange) * 100
                          : 50;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              )}

              {/* Data points */}
              {chartData.map((d, i) => {
                const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
                const y =
                  d.rank !== undefined && d.rank !== null
                    ? 100 - ((d.rank - minRank) / rankRange) * 100
                    : 50;

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#2563eb"
                    className="hover:r-4 transition-all"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 mt-2">
              {chartData.length <= 5
                ? chartData.map((d, i) => (
                    <span key={i} className="transform -rotate-45 origin-top-left">
                      {new Date(d.date).toLocaleDateString('vi-VN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  ))
                : [
                    chartData[0],
                    chartData[Math.floor(chartData.length / 2)],
                    chartData[chartData.length - 1],
                  ].map((d, i) => (
                    <span key={i} className="transform -rotate-45 origin-top-left">
                      {new Date(d.date).toLocaleDateString('vi-VN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3">Ngày</th>
              <th className="text-right py-2 px-3">Thứ hạng</th>
            </tr>
          </thead>
          <tbody>
            {chartData.slice(-10).reverse().map((d, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 px-3">
                  {new Date(d.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="text-right py-2 px-3 font-medium">
                  {d.rank !== undefined && d.rank !== null ? `#${d.rank}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}





