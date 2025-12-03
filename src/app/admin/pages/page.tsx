'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  FileText,
  RefreshCw,
  Grid3x3,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Page } from '@/lib/types/page';
import { StatusTabs, BulkActions } from '@/components/admin/list';
import { PageHierarchyTree } from '@/components/admin/pages';

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'hierarchy'>('list');

  // Stats
  const [stats, setStats] = useState({
    all: 0,
    published: 0,
    draft: 0,
    trash: 0,
  });

  useEffect(() => {
    loadPages();
  }, [currentStatus, searchQuery]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: currentStatus,
        search: searchQuery,
        limit: '100',
      });

      const response = await fetch(`/api/admin/pages?${params}`);
      if (!response.ok) throw new Error('Failed to load pages');

      const data = await response.json();
      setPages(data.pages || []);

      // Calculate stats
      const allPages = await fetch('/api/admin/pages?limit=1000').then((r) =>
        r.json()
      );
      if (allPages.success) {
        const newStats = {
          all: allPages.pages.length,
          published: allPages.pages.filter((p: Page) => p.status === 'published')
            .length,
          draft: allPages.pages.filter((p: Page) => p.status === 'draft').length,
          trash: allPages.pages.filter((p: Page) => p.status === 'trash').length,
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      alert('Không thể tải danh sách pages!');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectPage = (pageId: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPages.size === pages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(pages.map((p) => p._id || '')));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPages.size === 0) return;

    const confirmMessages: Record<string, string> = {
      publish: `Xuất bản ${selectedPages.size} trang?`,
      draft: `Chuyển ${selectedPages.size} trang về Draft?`,
      trash: `Chuyển ${selectedPages.size} trang vào Trash?`,
      delete: `XÓA VĨNH VIỄN ${selectedPages.size} trang? Không thể hoàn tác!`,
    };

    if (!confirm(confirmMessages[action])) return;

    try {
      const ids = Array.from(selectedPages);

      if (action === 'delete') {
        const response = await fetch(`/api/admin/pages?ids=${ids.join(',')}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Delete failed');
      } else {
        const response = await fetch('/api/admin/pages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, action }),
        });
        if (!response.ok) throw new Error('Bulk action failed');
      }

      setSelectedPages(new Set());
      loadPages();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Xóa trang này?')) return;

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      loadPages();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.message || 'Không thể xóa trang!');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const statusTabs = [
    { id: 'all', value: 'all', label: 'Tất cả', count: stats.all },
    { id: 'published', value: 'published', label: 'Đã xuất bản', count: stats.published },
    { id: 'draft', value: 'draft', label: 'Bản nháp', count: stats.draft },
    { id: 'trash', value: 'trash', label: 'Thùng rác', count: stats.trash },
  ];

  const bulkActions = [
    { value: 'publish', label: 'Xuất bản' },
    { value: 'draft', label: 'Chuyển về Draft' },
    { value: 'trash', label: 'Chuyển vào Trash' },
    ...(currentStatus === 'trash'
      ? [{ value: 'delete', label: 'Xóa vĩnh viễn' }]
      : []),
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Trang</h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các landing pages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadPages} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Link href="/admin/pages/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo trang mới
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Tabs */}
        <StatusTabs
          tabs={statusTabs}
          currentStatus={currentStatus}
          baseUrl="/admin/pages"
        />
      </div>

      {/* Toolbar */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Bulk Actions */}
          {selectedPages.size > 0 && (
            <BulkActions
              selectedCount={selectedPages.size}
              actions={bulkActions}
              onAction={handleBulkAction}
            />
          )}

          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Danh sách
            </Button>
            <Button
              onClick={() => setViewMode('hierarchy')}
              variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
              size="sm"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Phân cấp
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      ) : viewMode === 'hierarchy' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <PageHierarchyTree />
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có trang nào
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Không tìm thấy trang phù hợp'
              : 'Tạo trang đầu tiên của bạn'}
          </p>
          {!searchQuery && (
            <Link href="/admin/pages/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo trang mới
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPages.size === pages.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                  Tiêu đề
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                  Trang cha
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                  Template
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                  Ngày tạo
                </th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr
                  key={page._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedPages.has(page._id || '') ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page._id || '')}
                      onChange={() => toggleSelectPage(page._id || '')}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <Link
                        href={`/admin/pages/${page._id}/edit`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {page.title}
                      </Link>
                      <p className="text-xs text-gray-500">/{page.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {page.parentId ? '↳ Trang con' : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {page.template}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : page.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(page.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/pages/${page._id}/edit`}>
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(page._id || '')}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
