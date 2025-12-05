'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BlogFiltersProps {
  categories?: string[];
  defaultCategory?: string;
}

export function BlogFilters({ categories = [], defaultCategory }: BlogFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Get current values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || defaultCategory || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.delete('page');

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateFilters({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync local state with URL on mount
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    updateFilters({ search: null, category: null, sort: null });
  };

  const hasActiveFilters =
    currentSearch !== '' || currentCategory !== 'all' || currentSort !== 'newest';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Select value={currentCategory} onValueChange={handleCategoryChange} disabled={isPending}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort Filter */}
        <Select value={currentSort} onValueChange={handleSortChange} disabled={isPending}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="popular">Phổ biến</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isPending}
            className="w-full md:w-auto"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Bộ lọc đang áp dụng:</span>
          {currentSearch && (
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
              Tìm kiếm: &quot;{currentSearch}&quot;
            </span>
          )}
          {currentCategory && currentCategory !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              Danh mục: {currentCategory}
            </span>
          )}
          {currentSort !== 'newest' && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
              Sắp xếp: {currentSort === 'popular' ? 'Phổ biến' : 'Cũ nhất'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

