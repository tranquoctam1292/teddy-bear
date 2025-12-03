'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Ruler } from 'lucide-react';

interface AttributesBoxProps {
  sizes?: string[];
  colors?: { name: string; code: string }[];
  onSizesChange?: (sizes: string[]) => void;
  onColorsChange?: (colors: { name: string; code: string }[]) => void;
}

export default function AttributesBox({
  sizes = [],
  colors = [],
}: AttributesBoxProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Thuộc tính
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Sizes */}
        {sizes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">
              Kích thước:
            </p>
            <div className="flex flex-wrap gap-1">
              {sizes.map((size, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">
              Màu sắc:
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sizes.length === 0 && colors.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">
            Chưa có thuộc tính
          </p>
        )}
      </CardContent>
    </Card>
  );
}

