'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';

interface MediaFilterBarProps {
  filterType: string;
  setFilterType: (type: string) => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MediaFilterBar({
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  searchQuery,
  setSearchQuery,
}: MediaFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700">Lọc media:</span>

      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="w-40"
      >
        <option value="all">Tất cả loại</option>
        <option value="image">Hình ảnh</option>
        <option value="video">Video</option>
        <option value="document">Tài liệu</option>
        <option value="other">Khác</option>
      </Select>

      <Select
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="w-48"
      >
        <option value="all">Tất cả thời gian</option>
        <option value="today">Hôm nay</option>
        <option value="week">Tuần này</option>
        <option value="month">Tháng này</option>
      </Select>

      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Tìm kiếm tệp media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}

