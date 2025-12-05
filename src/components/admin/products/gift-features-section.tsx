'use client';

/**
 * Gift Features Section
 * Form section để cấu hình tính năng quà tặng
 */

import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import type { ProductFormData } from '@/lib/schemas/product';

// Các loại gói quà mặc định
const DEFAULT_GIFT_WRAPPING_OPTIONS = [
  'Hộp giấy',
  'Túi vải',
  'Hộp cao cấp',
  'Bao bì đặc biệt',
  'Hộp gỗ',
];

// Các dịp đặc biệt mặc định
const DEFAULT_SPECIAL_OCCASIONS = [
  'Valentine',
  'Sinh nhật',
  '8/3',
  '20/10',
  'Giáng sinh',
  'Tết',
  'Trung thu',
  'Ngày của mẹ',
  'Ngày của cha',
  'Tốt nghiệp',
];

export default function GiftFeaturesSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const giftWrapping = watch('giftWrapping') || false;
  const giftMessageEnabled = watch('giftMessageEnabled') || false;
  const giftWrappingOptions = watch('giftWrappingOptions') || [];
  const specialOccasions = watch('specialOccasions') || [];

  // Toggle gift wrapping option
  const toggleGiftWrappingOption = (option: string) => {
    const current = giftWrappingOptions;
    if (current.includes(option)) {
      setValue(
        'giftWrappingOptions',
        current.filter((item) => item !== option)
      );
    } else {
      setValue('giftWrappingOptions', [...current, option]);
    }
  };

  // Add custom gift wrapping option
  const [customOption, setCustomOption] = useState('');
  const addCustomGiftWrappingOption = () => {
    if (customOption.trim() && !giftWrappingOptions.includes(customOption.trim())) {
      setValue('giftWrappingOptions', [...giftWrappingOptions, customOption.trim()]);
      setCustomOption('');
    }
  };

  // Toggle special occasion
  const toggleSpecialOccasion = (occasion: string) => {
    const current = specialOccasions;
    if (current.includes(occasion)) {
      setValue(
        'specialOccasions',
        current.filter((item) => item !== occasion)
      );
    } else {
      setValue('specialOccasions', [...current, occasion]);
    }
  };

  // Add custom special occasion
  const [customOccasion, setCustomOccasion] = useState('');
  const addCustomSpecialOccasion = () => {
    if (customOccasion.trim() && !specialOccasions.includes(customOccasion.trim())) {
      setValue('specialOccasions', [...specialOccasions, customOccasion.trim()]);
      setCustomOccasion('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tính năng quà tặng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gift Wrapping Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="giftWrapping">Hỗ trợ gói quà</Label>
            <p className="text-sm text-gray-500">
              Cho phép khách hàng chọn gói quà khi mua sản phẩm
            </p>
          </div>
          <Controller
            name="giftWrapping"
            control={control}
            render={({ field }) => (
              <Switch
                id="giftWrapping"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Gift Wrapping Options - Chỉ hiện khi giftWrapping = true */}
        {giftWrapping && (
          <div className="space-y-3 pl-4 border-l-2 border-gray-200">
            <Label>Các loại gói quà</Label>
            <div className="space-y-2">
              {/* Default options */}
              <div className="flex flex-wrap gap-2">
                {DEFAULT_GIFT_WRAPPING_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={giftWrappingOptions.includes(option)}
                      onChange={() => toggleGiftWrappingOption(option)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>

              {/* Custom options */}
              {giftWrappingOptions
                .filter((opt) => !DEFAULT_GIFT_WRAPPING_OPTIONS.includes(opt))
                .map((option) => (
                  <div
                    key={option}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md"
                  >
                    <span className="text-sm">{option}</span>
                    <button
                      type="button"
                      onClick={() => toggleGiftWrappingOption(option)}
                      className="text-red-600 hover:text-red-700"
                      aria-label={`Xóa ${option}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

              {/* Add custom option */}
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm loại gói quà tùy chỉnh"
                  value={customOption}
                  onChange={(e) => setCustomOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomGiftWrappingOption();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomGiftWrappingOption}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {errors.giftWrappingOptions && (
              <p className="text-sm text-red-600">
                {errors.giftWrappingOptions.message}
              </p>
            )}
          </div>
        )}

        {/* Gift Message Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="giftMessageEnabled">Cho phép ghi lời chúc</Label>
            <p className="text-sm text-gray-500">
              Khách hàng có thể nhập lời chúc khi đặt hàng
            </p>
          </div>
          <Controller
            name="giftMessageEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="giftMessageEnabled"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Gift Message Template - Chỉ hiện khi giftMessageEnabled = true */}
        {giftMessageEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            <Label htmlFor="giftMessageTemplate">Template lời chúc mặc định</Label>
            <Textarea
              id="giftMessageTemplate"
              {...register('giftMessageTemplate')}
              rows={3}
              placeholder="VD: Chúc mừng sinh nhật! Chúc bạn luôn vui vẻ và hạnh phúc!"
            />
            <p className="text-xs text-gray-500">
              Template này sẽ được hiển thị mặc định, khách hàng có thể chỉnh sửa
            </p>
            {errors.giftMessageTemplate && (
              <p className="text-sm text-red-600">
                {errors.giftMessageTemplate.message}
              </p>
            )}
          </div>
        )}

        {/* Special Occasions */}
        <div className="space-y-3">
          <Label>Dịp đặc biệt</Label>
          <p className="text-sm text-gray-500">
            Chọn các dịp đặc biệt mà sản phẩm phù hợp làm quà tặng
          </p>
          <div className="space-y-2">
            {/* Default occasions */}
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SPECIAL_OCCASIONS.map((occasion) => (
                <label
                  key={occasion}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={specialOccasions.includes(occasion)}
                    onChange={() => toggleSpecialOccasion(occasion)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm">{occasion}</span>
                </label>
              ))}
            </div>

            {/* Custom occasions */}
            {specialOccasions
              .filter((occ) => !DEFAULT_SPECIAL_OCCASIONS.includes(occ))
              .map((occasion) => (
                <div
                  key={occasion}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md"
                >
                  <span className="text-sm">{occasion}</span>
                  <button
                    type="button"
                    onClick={() => toggleSpecialOccasion(occasion)}
                    className="text-red-600 hover:text-red-700"
                    aria-label={`Xóa ${occasion}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {/* Add custom occasion */}
            <div className="flex gap-2">
              <Input
                placeholder="Thêm dịp đặc biệt tùy chỉnh"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSpecialOccasion();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSpecialOccasion}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {errors.specialOccasions && (
            <p className="text-sm text-red-600">
              {errors.specialOccasions.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

