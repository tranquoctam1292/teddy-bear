'use client';

/**
 * Gift Features Section (Frontend)
 * Component hiển thị options quà tặng cho user chọn
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gift, MessageSquare } from 'lucide-react';
import type { Product } from '@/lib/schemas/product';

interface GiftFeaturesSectionProps {
  product: Product;
  onGiftOptionChange?: (option: {
    wrappingOption?: string;
    message?: string;
  }) => void;
}

export default function GiftFeaturesSection({
  product,
  onGiftOptionChange,
}: GiftFeaturesSectionProps) {
  const [selectedWrappingOption, setSelectedWrappingOption] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>(
    product.giftMessageTemplate || ''
  );

  // Notify parent component when gift options change
  useEffect(() => {
    if (onGiftOptionChange) {
      onGiftOptionChange({
        wrappingOption: selectedWrappingOption || undefined,
        message: giftMessage || undefined,
      });
    }
  }, [selectedWrappingOption, giftMessage, onGiftOptionChange]);

  // Chỉ hiển thị nếu giftWrapping = true
  if (!product.giftWrapping) {
    return null;
  }

  const giftWrappingOptions = product.giftWrappingOptions || [];
  const specialOccasions = product.specialOccasions || [];

  return (
    <div className="bg-pink-50 rounded-xl p-6 space-y-4 border-2 border-pink-200">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-pink-600" />
        <h3 className="font-semibold text-gray-900">Tùy chọn quà tặng</h3>
      </div>

      {/* Gift Wrapping Options */}
      {giftWrappingOptions.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Chọn loại gói quà
          </Label>
          <RadioGroup
            value={selectedWrappingOption}
            onValueChange={setSelectedWrappingOption}
          >
            {giftWrappingOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`gift-${option}`} />
                <Label
                  htmlFor={`gift-${option}`}
                  className="font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Gift Message */}
      {product.giftMessageEnabled && (
        <div className="space-y-2">
          <Label htmlFor="giftMessage" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Lời chúc (tùy chọn)
          </Label>
          <Textarea
            id="giftMessage"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder={product.giftMessageTemplate || 'Nhập lời chúc của bạn...'}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Lời chúc sẽ được in trên thiệp kèm theo quà
          </p>
        </div>
      )}

      {/* Special Occasions Badges */}
      {specialOccasions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Phù hợp cho dịp
          </Label>
          <div className="flex flex-wrap gap-2">
            {specialOccasions.map((occasion) => (
              <Badge
                key={occasion}
                variant="secondary"
                className="bg-pink-100 text-pink-700 hover:bg-pink-200"
              >
                {occasion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

