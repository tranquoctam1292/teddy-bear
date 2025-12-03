'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Image as ImageIcon } from 'lucide-react';
import FeaturedImageUploader from '../FeaturedImageUploader';

interface FeaturedImageBoxProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export default function FeaturedImageBox({
  value,
  onChange,
  onRemove,
}: FeaturedImageBoxProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Ảnh đại diện
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FeaturedImageUploader
          value={value}
          onChange={onChange}
          onRemove={onRemove}
        />
      </CardContent>
    </Card>
  );
}

