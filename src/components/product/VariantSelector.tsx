'use client';

// Chọn Size/Màu (Logic phức tạp ở đây)
// Changing size MUST update displayed Price and Product Image automatically
import { useState, useMemo, useRef, useEffect } from 'react';
import type { Product, Variant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface VariantSelectorProps {
  product: Product;
  selectedVariantId?: string;
  onVariantChange: (variant: Variant) => void;
}

export default function VariantSelector({
  product,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  // Compute current variant based on props (derived state)
  const currentVariant = useMemo(() => {
    if (selectedVariantId) {
      return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0] || null;
    }
    return product.variants[0] || null;
  }, [selectedVariantId, product.variants]);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(currentVariant);
  const prevVariantIdRef = useRef<string | undefined>(currentVariant?.id);

  // Sync state when variant changes - use callback to avoid synchronous setState
  useEffect(() => {
    if (currentVariant && prevVariantIdRef.current !== currentVariant.id) {
      prevVariantIdRef.current = currentVariant.id;
      // Use requestAnimationFrame to defer state update
      requestAnimationFrame(() => {
        setSelectedVariant(currentVariant);
        onVariantChange(currentVariant);
      });
    }
  }, [currentVariant, onVariantChange]);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

  if (!selectedVariant || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kích thước
        </label>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant)}
              disabled={variant.stock === 0}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all
                ${
                  selectedVariant.id === variant.id
                    ? 'border-pink-400 bg-pink-50 text-pink-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-pink-200'
                }
                ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {variant.size}
              {variant.stock === 0 && (
                <span className="ml-1 text-xs text-red-500">(Hết hàng)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">Giá:</span>
          <span className="text-2xl font-bold text-pink-600">
            {formatCurrency(selectedVariant.price)}
          </span>
        </div>
        {product.basePrice !== selectedVariant.price && (
          <p className="text-xs text-gray-500 mt-1">
            Giá gốc: <span className="line-through">{formatCurrency(product.basePrice)}</span>
          </p>
        )}
        {selectedVariant.stock > 0 && (
          <p className="text-xs text-green-600 mt-2">
            Còn {selectedVariant.stock} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
