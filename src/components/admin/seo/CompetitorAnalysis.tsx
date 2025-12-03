'use client';

/**
 * Competitor Analysis Component
 * Compare competitors with our SEO performance
 */
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Select } from '@/components/admin/ui/select';
import { Badge } from '@/components/admin/ui/badge';

interface CompetitorAnalysisProps {
  competitorId?: string;
}

export default function CompetitorAnalysis({ competitorId }: CompetitorAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitorId || '');

  useEffect(() => {
    fetchAnalysis();
  }, [selectedCompetitor]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const url = selectedCompetitor
        ? `/api/admin/seo/competitors/analysis?competitorId=${selectedCompetitor}`
        : '/api/admin/seo/competitors/analysis';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
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

  if (!analysis || analysis.analysis.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chưa có dữ liệu competitor để phân tích</p>
        <p className="text-sm mt-2">Thêm competitors trong Competitor Manager</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analysis.analysis.map((comp: any, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {comp.competitor.name}
            </CardTitle>
            <CardDescription>
              {comp.competitor.domain} • DA: {comp.competitor.domainAuthority || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Tổng từ khóa</div>
                  <div className="text-xl font-bold">{comp.keywords.total}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Chúng ta tốt hơn</div>
                  <div className="text-xl font-bold text-green-700">
                    {comp.keywords.weRankHigher}
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Họ tốt hơn</div>
                  <div className="text-xl font-bold text-red-700">
                    {comp.keywords.theyRankHigher}
                  </div>
                </div>
              </div>

              {/* Keyword Comparison */}
              {comp.comparison && comp.comparison.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">So sánh từ khóa</h4>
                  <div className="space-y-2">
                    {comp.comparison.map((kw: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{kw.keyword}</span>
                          {kw.searchVolume && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({kw.searchVolume.toLocaleString()}/tháng)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Competitor</div>
                            <div className="font-semibold">
                              {kw.competitorRank ? `#${kw.competitorRank}` : 'N/A'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Chúng ta</div>
                            <div className="font-semibold">
                              {kw.ourRank ? `#${kw.ourRank}` : 'N/A'}
                            </div>
                          </div>
                          {kw.rankGap !== null && (
                            <div className="flex items-center">
                              {kw.rankGap > 0 ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              ) : kw.rankGap < 0 ? (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              ) : null}
                              <span
                                className={`text-sm font-semibold ml-1 ${
                                  kw.rankGap > 0 ? 'text-green-600' : kw.rankGap < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}
                              >
                                {kw.rankGap > 0 ? '+' : ''}
                                {kw.rankGap}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


