'use client';

// Keyword Tracking Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Plus, RefreshCw, TrendingUp, TrendingDown, Minus, BarChart3, Folder } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Select } from '@/components/admin/ui/select';
import KeywordGrouping from '@/components/admin/seo/KeywordGrouping';

export default function SEOKeywordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    entityType: '',
    keyword: '',
    sort: 'trackedAt',
    order: 'desc',
  });
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchKeywords();
    }
  }, [status, pagination.page, filters]);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        order: filters.order,
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.keyword) params.append('keyword', filters.keyword);

      const response = await fetch(`/api/admin/seo/keywords?${params}`);
      const data = await response.json();

      if (data.success) {
        setKeywords(data.data.keywords || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankChange = (keyword: any) => {
    if (!keyword.rankingHistory || keyword.rankingHistory.length < 2) {
      return null;
    }
    const current = keyword.currentRank;
    const previous = keyword.previousRank;
    if (current === null || previous === null) return null;
    return current - previous;
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Theo dõi Từ khóa
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi thứ hạng từ khóa trên Google
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'list' ? 'grouped' : 'list')}
          >
            {viewMode === 'list' ? (
              <>
                <Folder className="h-4 w-4 mr-2" />
                Nhóm
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Danh sách
              </>
            )}
          </Button>
          <Button onClick={() => router.push('/admin/seo/keywords/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm từ khóa
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="tracking">Đang theo dõi</option>
                <option value="paused">Tạm dừng</option>
                <option value="archived">Đã lưu trữ</option>
              </Select>
            </div>
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
                Tìm kiếm từ khóa
              </label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập từ khóa..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords List or Grouped View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {viewMode === 'list' ? 'Danh sách từ khóa' : 'Nhóm từ khóa'}
              </CardTitle>
              <CardDescription>
                {pagination.total} từ khóa đang được theo dõi
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchKeywords}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grouped' ? (
            <KeywordGrouping keywords={keywords} />
          ) : keywords.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Chưa có từ khóa nào được theo dõi</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/admin/seo/keywords/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm từ khóa đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {keywords.map((keyword) => {
                const rankChange = getRankChange(keyword);
                return (
                  <div
                    key={keyword.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {keyword.keyword}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            keyword.status === 'tracking'
                              ? 'bg-green-100 text-green-700'
                              : keyword.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {keyword.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                          <span>{keyword.entityType}: {keyword.entitySlug || keyword.entityId}</span>
                          {keyword.currentRank !== null && (
                            <span className="flex items-center gap-1">
                              Thứ hạng: <strong className="text-gray-900">{keyword.currentRank}</strong>
                              {rankChange !== null && rankChange !== 0 && (
                                <span className={`flex items-center ${
                                  rankChange < 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {rankChange < 0 ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                  {Math.abs(rankChange)}
                                </span>
                              )}
                              {rankChange === 0 && (
                                <Minus className="h-4 w-4 text-gray-400" />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {keyword.searchVolume && (
                            <span>Lượng tìm kiếm: {keyword.searchVolume.toLocaleString()}/tháng</span>
                          )}
                          {keyword.difficulty && (
                            <span>Độ khó: {keyword.difficulty}/100</span>
                          )}
                          {keyword.lastChecked && (
                            <span>Kiểm tra lần cuối: {new Date(keyword.lastChecked).toLocaleDateString('vi-VN')}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/seo/keywords/${keyword.id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                );
              })}
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

