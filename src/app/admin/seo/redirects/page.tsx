'use client';

// Redirect Manager Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Badge } from '@/components/admin/ui/badge';
import { Alert } from '@/components/admin/ui/alert';

interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  type: '301' | '302' | '307' | '308';
  matchType: 'exact' | 'regex' | 'prefix';
  status: 'active' | 'inactive';
  priority: number;
  hitCount?: number;
  lastHit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SEORedirectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    matchType: '',
    source: '',
    sort: 'priority',
    order: 'desc',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<RedirectRule | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRedirects();
    }
  }, [status, pagination.page, filters]);

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        order: filters.order,
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.matchType) params.append('matchType', filters.matchType);
      if (filters.source) params.append('source', filters.source);

      const response = await fetch(`/api/admin/seo/redirects?${params}`);
      const data = await response.json();

      if (data.success) {
        setRedirects(data.data.redirects || []);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching redirects:', error);
      setMessage({ type: 'error', text: 'Lỗi khi tải danh sách redirects' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa redirect này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Xóa redirect thành công' });
        fetchRedirects();
      } else {
        setMessage({ type: 'error', text: data.error || 'Lỗi khi xóa redirect' });
      }
    } catch (error) {
      console.error('Error deleting redirect:', error);
      setMessage({ type: 'error', text: 'Lỗi khi xóa redirect' });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/seo/redirects/bulk?format=csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `redirects-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage({ type: 'success', text: 'Xuất file thành công' });
    } catch (error) {
      console.error('Error exporting redirects:', error);
      setMessage({ type: 'error', text: 'Lỗi khi xuất file' });
    }
  };

  const handleDetectChains = async () => {
    try {
      const response = await fetch('/api/admin/seo/redirects/chains');
      const data = await response.json();

      if (data.success && data.data.chains.length > 0) {
        alert(`Phát hiện ${data.data.chains.length} redirect chain(s). Kiểm tra console để xem chi tiết.`);
        console.log('Redirect chains:', data.data.chains);
      } else {
        setMessage({ type: 'success', text: 'Không phát hiện redirect chain nào' });
      }
    } catch (error) {
      console.error('Error detecting chains:', error);
      setMessage({ type: 'error', text: 'Lỗi khi kiểm tra redirect chains' });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      '301': 'bg-blue-100 text-blue-800',
      '302': 'bg-yellow-100 text-yellow-800',
      '307': 'bg-purple-100 text-purple-800',
      '308': 'bg-indigo-100 text-indigo-800',
    };
    return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  const getMatchTypeBadge = (matchType: string) => {
    const labels: Record<string, string> = {
      exact: 'Chính xác',
      regex: 'Regex',
      prefix: 'Tiền tố',
    };
    return <Badge variant="secondary">{labels[matchType] || matchType}</Badge>;
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
          Redirect Manager
        </h1>
        <p className="text-gray-600">
          Quản lý các quy tắc redirect cho website
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

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Redirect
        </Button>
        <Button onClick={handleExport} variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Xuất CSV
        </Button>
        <Button onClick={handleDetectChains} variant="secondary">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Kiểm tra Chains
        </Button>
        <Button onClick={fetchRedirects} variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
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
                Trạng thái
              </label>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại Redirect
              </label>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="301">301 - Permanent</option>
                <option value="302">302 - Temporary</option>
                <option value="307">307 - Temporary</option>
                <option value="308">308 - Permanent</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại Match
              </label>
              <Select
                value={filters.matchType}
                onChange={(e) => setFilters({ ...filters, matchType: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="exact">Chính xác</option>
                <option value="regex">Regex</option>
                <option value="prefix">Tiền tố</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm Source
              </label>
              <Input
                placeholder="Nhập source URL..."
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redirects List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Redirects ({pagination.total})</CardTitle>
          <CardDescription>
            Tổng cộng {pagination.total} redirect rule(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {redirects.length === 0 ? (
            <div className="text-center py-12">
              <ArrowRight className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Chưa có redirect nào</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Redirect đầu tiên
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-700">Source</th>
                      <th className="text-left p-3 font-medium text-gray-700">Destination</th>
                      <th className="text-left p-3 font-medium text-gray-700">Type</th>
                      <th className="text-left p-3 font-medium text-gray-700">Match</th>
                      <th className="text-left p-3 font-medium text-gray-700">Priority</th>
                      <th className="text-left p-3 font-medium text-gray-700">Hits</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-right p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.map((redirect) => (
                      <tr key={redirect.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {redirect.source}
                          </code>
                        </td>
                        <td className="p-3">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {redirect.destination}
                          </code>
                        </td>
                        <td className="p-3">{getTypeBadge(redirect.type)}</td>
                        <td className="p-3">{getMatchTypeBadge(redirect.matchType)}</td>
                        <td className="p-3">{redirect.priority}</td>
                        <td className="p-3">{redirect.hitCount || 0}</td>
                        <td className="p-3">{getStatusBadge(redirect.status)}</td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingRedirect(redirect)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDelete(redirect.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
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

      {/* Add/Edit Modal - Simplified for now, can be enhanced */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl m-4">
            <CardHeader>
              <CardTitle>Thêm Redirect Mới</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tính năng form sẽ được triển khai trong bước tiếp theo.
                Vui lòng sử dụng API để thêm redirect.
              </p>
              <Button onClick={() => setShowAddModal(false)}>Đóng</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
