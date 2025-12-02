'use client';

// Component bộ lọc
// Filter by: Price Range, Character, Size, Occasion
import { useState } from 'react';
import { CATEGORIES, SIZES, OCCASIONS, PRICE_RANGES } from '@/lib/constants';
import { formatPriceRange } from '@/lib/utils';
import { X, Filter } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: string[];
  categories: string[];
  sizes: string[];
  occasions: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onApplyFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    categories: [],
    sizes: [],
    occasions: [],
  });

  const toggleFilter = (
    type: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: newValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [],
      categories: [],
      sizes: [],
      occasions: [],
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const hasActiveFilters =
    filters.priceRange.length > 0 ||
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.occasions.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:z-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto lg:relative lg:shadow-none lg:w-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Khoảng giá</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => {
                const isChecked = filters.priceRange.includes(range.value);
                return (
                  <label
                    key={range.value}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                      ${isChecked 
                        ? 'bg-pink-100 border-2 border-pink-400' 
                        : 'border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter('priceRange', range.value)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'text-pink-700' : 'text-gray-700'}`}>
                      {range.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Character/Category */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Loại gấu</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const isChecked = filters.categories.includes(category.value);
                return (
                  <label
                    key={category.value}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                      ${isChecked 
                        ? 'bg-pink-100 border-2 border-pink-400' 
                        : 'border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter('categories', category.value)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'text-pink-700' : 'text-gray-700'}`}>
                      {category.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Kích thước</h3>
            <div className="space-y-2">
              {SIZES.map((size) => {
                const isChecked = filters.sizes.includes(size.value);
                return (
                  <label
                    key={size.value}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                      ${isChecked 
                        ? 'bg-pink-100 border-2 border-pink-400' 
                        : 'border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter('sizes', size.value)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'text-pink-700' : 'text-gray-700'}`}>
                      {size.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Dịp</h3>
            <div className="space-y-2">
              {OCCASIONS.map((occasion) => {
                const isChecked = filters.occasions.includes(occasion.value);
                return (
                  <label
                    key={occasion.value}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                      ${isChecked 
                        ? 'bg-pink-100 border-2 border-pink-400' 
                        : 'border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilter('occasions', occasion.value)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'text-pink-700' : 'text-gray-700'}`}>
                      {occasion.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <button
              onClick={handleApply}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Áp dụng ({Object.values(filters).flat().length})
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
