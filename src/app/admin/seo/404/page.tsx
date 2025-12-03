'use client';

// 404 Monitor Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  BarChart3,
  FileX,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Badge } from '@/components/admin/ui/badge';
import { Alert } from '@/components/admin/ui/alert';

interface Error404 {
  id: string;
  url: string;
  normalizedUrl: string;
  referer?: string;
  userAgent?: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'active' | 'resolved' | 'ignored';
  resolved?: boolean;
  redirectTo?: string;
  likelyCause?: string;
  notes?: string;
}

interface Statistics {
  totalErrors: number;
  activeErrors: number;
  resolvedErrors: number;
  ignoredErrors: number;
  topErrors: Array<{
    url: string;
    count: number;
    lastSeen: string;
  }>;
  errorsByCause: Record<string, number>;
  errorsByDay: Array<{
    date: string;
    count: number;
  }>;
}

export default function SEO404Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Error404[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    resolved: '',
    likelyCause: '',
    url: '',
    sort: 'lastSeen',
    order: 'desc',
  });
  const [showStatistics, setShowStatistics] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchErrors();
      fetchStatistics();
    }
  }, [status, pagination.page, filters]);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        order: filters.order,
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.resolved) params.append('resolved', filters.resolved);
      if (filters.likelyCause) params.append('likelyCause', filters.likelyCause);
      if (filters.url) params.append('url', filters.url);

      const response = await fetch(`/api/admin/seo/404?${params}`);
      const data = await response.json();

      if (data.success) {
        setErrors(data.data.errors || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching 404 errors:', error);
      setMessage({ type: 'error', text: 'Lỗi khi tải danh sách lỗi 404' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/seo/404/statistics');
      const data = await response.json();

      if (data.success) {
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleCreateRedirect = async (errorId: string, url: string) => {
    const destination = prompt('Nhập URL đích cho redirect:', url.replace(/\/$/, ''));
    if (!destination) return;

    try {
      const response = await fetch('/api/admin/seo/404/create-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorId,
          destination,
          type: '301',
          matchType: 'exact',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Tạo redirect thành công và đã đánh dấu lỗi 404 là đã giải quyết' });
        fetchErrors();
        fetchStatistics();
      } else {
        setMessage({ type: 'error', text: data.error || 'Lỗi khi tạo redirect' });
      }
    } catch (error) {
      console.error('Error creating redirect:', error);
      setMessage({ type: 'error', text: 'Lỗi khi tạo redirect' });
    }
  };

  const handleMarkResolved = async (errorId: string) => {
    try {
      const response = await fetch(`/api/admin/seo/404/${errorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolved: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Đã đánh dấu lỗi 404 là đã giải quyết' });
        fetchErrors();
        fetchStatistics();
      } else {
        setMessage({ type: 'error', text: data.error || 'Lỗi khi cập nhật' });
      }
    } catch (error) {
      console.error('Error marking as resolved:', error);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật' });
    }
  };

  const handleIgnore = async (errorId: string) => {
    try {
      const response = await fetch(`/api/admin/seo/404/${errorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ignored',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Đã bỏ qua lỗi 404' });
        fetchErrors();
        fetchStatistics();
      } else {
        setMessage({ type: 'error', text: data.error || 'Lỗi khi cập nhật' });
      }
    } catch (error) {
      console.error('Error ignoring error:', error);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật' });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') {
      return <Badge className="bg-green-100 text-green-800">Đã giải quyết</Badge>;
    }
    if (status === 'ignored') {
      return <Badge className="bg-gray-100 text-gray-800">Đã bỏ qua</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Đang hoạt động</Badge>;
  };

  const getCauseLabel = (cause?: string) => {
    const labels: Record<string, string> = {
      broken_link: 'Link bị hỏng',
      typo: 'Lỗi chính tả',
      old_url: 'URL cũ',
      deleted_content: 'Nội dung đã xóa',
      unknown: 'Không xác định',
    };
    return labels[cause || 'unknown'] || cause || 'Không xác định';
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
          404 Monitor
        </h1>
        <p className="text-gray-600">
          Theo dõi và quản lý các lỗi 404 trên website
        </p>
      </div>

      {/* Message */}
      {message && (
        <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng lỗi</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalErrors}</p>
                </div>
                <FileX className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.activeErrors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã giải quyết</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.resolvedErrors}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã bỏ qua</p>
                  <p className="text-2xl font-bold text-gray-600">{statistics.ignoredErrors}</p>
                </div>
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={() => setShowStatistics(!showStatistics)} variant="secondary">
          <BarChart3 className="h-4 w-4 mr-2" />
          {showStatistics ? 'Ẩn' : 'Hiển thị'} Thống kê
        </Button>
        <Button onClick={fetchErrors} variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Statistics Panel */}
      {showStatistics && statistics && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thống kê chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Lỗi theo nguyên nhân</h3>
                <div className="space-y-2">
                  {Object.entries(statistics.errorsByCause).map(([cause, count]) => (
                    <div key={cause} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{getCauseLabel(cause)}</span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Top 10 lỗi phổ biến</h3>
                <div className="space-y-2">
                  {statistics.topErrors.slice(0, 10).map((error, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
                        {error.url}
                      </code>
                      <Badge>{error.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                Trạng thái
              </label>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="ignored">Đã bỏ qua</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nguyên nhân
              </label>
              <Select
                value={filters.likelyCause}
                onChange={(e) => setFilters({ ...filters, likelyCause: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="broken_link">Link bị hỏng</option>
                <option value="typo">Lỗi chính tả</option>
                <option value="old_url">URL cũ</option>
                <option value="deleted_content">Nội dung đã xóa</option>
                <option value="unknown">Không xác định</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm URL
              </label>
              <Input
                placeholder="Nhập URL..."
                value={filters.url}
                onChange={(e) => setFilters({ ...filters, url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp
              </label>
              <Select
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setFilters({ ...filters, sort, order });
                }}
              >
                <option value="lastSeen-desc">Mới nhất</option>
                <option value="lastSeen-asc">Cũ nhất</option>
                <option value="count-desc">Nhiều nhất</option>
                <option value="count-asc">Ít nhất</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lỗi 404 ({pagination.total})</CardTitle>
          <CardDescription>
            Tổng cộng {pagination.total} lỗi 404
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <p className="text-gray-600 mb-4">Không có lỗi 404 nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-700">URL</th>
                      <th className="text-left p-3 font-medium text-gray-700">Số lần</th>
                      <th className="text-left p-3 font-medium text-gray-700">Lần cuối</th>
                      <th className="text-left p-3 font-medium text-gray-700">Nguyên nhân</th>
                      <th className="text-left p-3 font-medium text-gray-700">Trạng thái</th>
                      <th className="text-right p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((error) => (
                      <tr key={error.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                            {error.url}
                          </code>
                          {error.referer && (
                            <p className="text-xs text-gray-500 mt-1">
                              Từ: {error.referer}
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge>{error.count}</Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(error.lastSeen).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600">
                            {getCauseLabel(error.likelyCause)}
                          </span>
                        </td>
                        <td className="p-3">{getStatusBadge(error.status)}</td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            {error.status === 'active' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleCreateRedirect(error.id, error.url)}
                                >
                                  <ArrowRight className="h-4 w-4 mr-1" />
                                  Tạo Redirect
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleMarkResolved(error.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleIgnore(error.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Trang {pagination.page} / {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

