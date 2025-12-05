'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HomepageToolbarProps {
  statusCounts?: {
    all: number;
    published: number;
    draft: number;
    archived: number;
    scheduled?: number;
  };
  selectedCount?: number;
  onBulkAction?: (action: string) => void;
}

export function HomepageToolbar({
  statusCounts = {
    all: 0,
    published: 0,
    draft: 0,
    archived: 0,
    scheduled: 0,
  },
  selectedCount = 0,
  onBulkAction,
}: HomepageToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [bulkAction, setBulkAction] = useState('');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');

  const currentStatus = searchParams.get('status') || 'all';

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Handle search
  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to page 1
    router.push(`/admin/homepage?${params.toString()}`);
  }

  // Handle Enter key in search input
  function handleSearchKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  // Handle bulk action apply
  function handleBulkApply() {
    if (bulkAction && selectedCount > 0 && onBulkAction) {
      onBulkAction(bulkAction);
      setBulkAction('');
    }
  }

  // Handle filter apply
  function handleFilterApply() {
    const params = new URLSearchParams(searchParams.toString());
    
    if (dateFilter) {
      params.set('date', dateFilter);
    } else {
      params.delete('date');
    }
    
    if (categoryFilter) {
      params.set('category', categoryFilter);
    } else {
      params.delete('category');
    }
    
    params.delete('page'); // Reset to page 1
    router.push(`/admin/homepage?${params.toString()}`);
  }

  // Build status tab URL
  function getStatusUrl(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.delete('page'); // Reset to page 1
    return `/admin/homepage${params.toString() ? `?${params.toString()}` : ''}`;
  }

  return (
    <div className="space-y-4 bg-white rounded-lg border p-4">
      {/* Status Tabs - Top Row */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
        <Link
          href={getStatusUrl('all')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentStatus === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tất cả ({statusCounts.all})
        </Link>
        <Link
          href={getStatusUrl('published')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentStatus === 'published'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Đã xuất bản ({statusCounts.published})
        </Link>
        <Link
          href={getStatusUrl('draft')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentStatus === 'draft'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bản nháp ({statusCounts.draft})
        </Link>
        {statusCounts.scheduled !== undefined && (
          <Link
            href={getStatusUrl('scheduled')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              currentStatus === 'scheduled'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đã lên lịch ({statusCounts.scheduled})
          </Link>
        )}
        <Link
          href={getStatusUrl('archived')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentStatus === 'archived'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Thùng rác ({statusCounts.archived})
        </Link>
      </div>

      {/* Filters and Search - Bottom Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Bulk Actions + Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <Select value={bulkAction || undefined} onValueChange={setBulkAction}>
              <SelectTrigger className="w-[180px] h-9 text-sm" disabled={selectedCount === 0}>
                <SelectValue placeholder="Hành động hàng loạt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">Xóa vĩnh viễn</SelectItem>
                <SelectItem value="trash">Chuyển vào thùng rác</SelectItem>
                <SelectItem value="restore">Khôi phục</SelectItem>
                <SelectItem value="publish">Xuất bản</SelectItem>
                <SelectItem value="draft">Chuyển thành nháp</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleBulkApply}
              variant="outline"
              size="sm"
              disabled={!bulkAction || selectedCount === 0}
            >
              Áp dụng
            </Button>
          </div>

          {/* Date Filter */}
          <Select value={dateFilter || undefined} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Tất cả các ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter (placeholder - can be implemented later) */}
          <Select value={categoryFilter || undefined} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              {/* Categories can be added here when available */}
            </SelectContent>
          </Select>

          {/* Filter Button */}
          <Button
            type="button"
            onClick={handleFilterApply}
            variant="outline"
            size="sm"
          >
            Lọc
          </Button>
        </div>

        {/* Right Side: Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="flex-1 sm:w-64 h-9 text-sm"
          />
          <Button
            type="button"
            onClick={handleSearch}
            size="sm"
            className="h-9"
          >
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}

