'use client';

import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface FilterBarProps {
  // Date filter
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  dateOptions?: { value: string; label: string }[];

  // Category filter
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categoryOptions?: { value: string; label: string }[];

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;

  // Extra filters
  extraFilters?: React.ReactNode;
}

export default function FilterBar({
  selectedDate = '',
  onDateChange,
  dateOptions = [
    { value: '', label: 'Tất cả các ngày' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm này' },
  ],
  selectedCategory = '',
  onCategoryChange,
  categoryOptions = [{ value: '', label: 'Tất cả danh mục' }],
  searchQuery,
  onSearchChange,
  onSearch,
  extraFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date Filter */}
      {onDateChange && (
        <Select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="text-sm w-auto"
        >
          {dateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      )}

      {/* Category Filter */}
      {onCategoryChange && categoryOptions.length > 1 && (
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-sm w-auto"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      )}

      {/* Extra Filters */}
      {extraFilters}

      {/* Apply Filter Button */}
      {(onDateChange || onCategoryChange) && (
        <Button
          type="button"
          onClick={() => {/* Filters auto-apply */}}
          variant="outline"
          size="sm"
        >
          Lọc
        </Button>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 ml-auto">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-64 text-sm"
        />
        <Button
          type="button"
          onClick={onSearch}
          size="sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}


