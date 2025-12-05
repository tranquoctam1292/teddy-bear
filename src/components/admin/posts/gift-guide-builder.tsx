'use client';

/**
 * Gift Guide Builder Component
 * 
 * Builder cho bài viết hướng dẫn quà tặng
 * Lưu dữ liệu vào templateData.giftGuide
 */

import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { X, Plus } from 'lucide-react';
import type { PostFormData } from '@/lib/schemas/post';

interface GiftGuideData {
  occasions?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  deliveryOptions?: string[];
  recommendedProducts?: string[];
}

const OCCASION_OPTIONS = [
  'Sinh nhật',
  'Valentine',
  '8/3',
  '20/10',
  'Giáng sinh',
  'Tết',
  'Kỷ niệm',
  'Tốt nghiệp',
  'Khác',
];

const DELIVERY_OPTIONS = [
  'Giao hàng nhanh',
  'Giao hàng tiêu chuẩn',
  'Giao hàng quốc tế',
  'Nhận tại cửa hàng',
  'Gói quà miễn phí',
];

export default function GiftGuideBuilder() {
  const { watch, setValue } = useFormContext<PostFormData>();
  const templateData = watch('templateData') || {};
  const giftGuideData: GiftGuideData = templateData.giftGuide || {};

  const updateGiftGuideData = (updates: Partial<GiftGuideData>) => {
    const newTemplateData = {
      ...templateData,
      giftGuide: {
        ...giftGuideData,
        ...updates,
      },
    };
    setValue('templateData', newTemplateData, { shouldDirty: true });
  };

  const handleOccasionToggle = (occasion: string) => {
    const currentOccasions = giftGuideData.occasions || [];
    const newOccasions = currentOccasions.includes(occasion)
      ? currentOccasions.filter((o) => o !== occasion)
      : [...currentOccasions, occasion];
    updateGiftGuideData({ occasions: newOccasions });
  };

  const handleDeliveryToggle = (option: string) => {
    const currentOptions = giftGuideData.deliveryOptions || [];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter((o) => o !== option)
      : [...currentOptions, option];
    updateGiftGuideData({ deliveryOptions: newOptions });
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    updateGiftGuideData({
      priceRange: {
        ...giftGuideData.priceRange,
        [field]: numValue,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Occasions */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Dịp lễ <span className="text-gray-500 text-xs">(Chọn nhiều)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {OCCASION_OPTIONS.map((occasion) => {
            const isSelected = giftGuideData.occasions?.includes(occasion) ?? false;
            return (
              <button
                key={occasion}
                type="button"
                onClick={() => handleOccasionToggle(occasion)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-pink-100 text-pink-700 border border-pink-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {occasion}
              </button>
            );
          })}
        </div>
        {giftGuideData.occasions && giftGuideData.occasions.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Đã chọn: {giftGuideData.occasions.join(', ')}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Khoảng giá (₫)
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-gray-600 mb-1 block">Từ</Label>
            <Input
              type="number"
              placeholder="0"
              value={giftGuideData.priceRange?.min || ''}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="pt-5 text-gray-400">-</div>
          <div className="flex-1">
            <Label className="text-xs text-gray-600 mb-1 block">Đến</Label>
            <Input
              type="number"
              placeholder="Không giới hạn"
              value={giftGuideData.priceRange?.max || ''}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Để trống nếu không giới hạn giá
        </p>
      </div>

      {/* Delivery Options */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Tùy chọn giao hàng <span className="text-gray-500 text-xs">(Chọn nhiều)</span>
        </Label>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((option) => {
            const isSelected = giftGuideData.deliveryOptions?.includes(option) ?? false;
            return (
              <label
                key={option}
                className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleDeliveryToggle(option)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
        <p className="text-xs text-pink-800">
          <strong>💡 Lưu ý:</strong> Dữ liệu này sẽ được sử dụng để hiển thị các sản phẩm phù hợp
          trong bài viết hướng dẫn quà tặng. Bạn có thể liên kết sản phẩm cụ thể ở phần "Sản phẩm liên kết".
        </p>
      </div>
    </div>
  );
}

