'use client';

// SEO Analysis Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BarChart3, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Select } from '@/components/admin/ui/select';

export default function SEOAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    entityType: '',
    minScore: '',
    maxScore: '',
    hasIssues: '',
    sort: 'analyzedAt',
    order: 'desc',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyses();
    }
  }, [status, pagination.page, filters]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        order: filters.order,
      });

      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.minScore) params.append('minScore', filters.minScore);
      if (filters.maxScore) params.append('maxScore', filters.maxScore);
      if (filters.hasIssues === 'true') params.append('hasIssues', 'true');

      const response = await fetch(`/api/admin/seo/analysis?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnalyses(data.data.analyses || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Phân tích SEO
        </h1>
        <p className="text-gray-600">
          Xem và quản lý phân tích SEO cho sản phẩm và bài viết
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại entity
              </label>
              <Select
                value={filters.entityType}
                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="product">Sản phẩm</option>
                <option value="post">Bài viết</option>
                <option value="page">Trang</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm tối thiểu
              </label>
              <input
                type="number"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm tối đa
              </label>
              <input
                type="number"
                value={filters.maxScore}
                onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Có vấn đề
              </label>
              <Select
                value={filters.hasIssues}
                onChange={(e) => setFilters({ ...filters, hasIssues: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="true">Có vấn đề</option>
                <option value="false">Không có vấn đề</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyses List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách phân tích</CardTitle>
              <CardDescription>
                {pagination.total} phân tích được tìm thấy
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalyses}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Chưa có phân tích nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {analysis.entityType}: {analysis.entitySlug || analysis.entityId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          analysis.overallScore >= 80
                            ? 'bg-green-100 text-green-700'
                            : analysis.overallScore >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {analysis.overallScore}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>SEO: {analysis.seoScore || 0}</span>
                        <span>Readability: {analysis.readabilityScore || 0}</span>
                        {analysis.issues && analysis.issues.length > 0 && (
                          <span className="text-orange-600">
                            {analysis.issues.length} vấn đề
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/seo/analysis/${analysis.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


