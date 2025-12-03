'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Image as ImageIcon } from 'lucide-react';
import FeaturedImageUploader from '../FeaturedImageUploader';

interface FeaturedImageBoxProps {
  value?: string;
  imageUrl?: string; // Alias for value
  onChange?: (url: string) => void;
  onImageChange?: (url: string) => void; // Alias for onChange
  onRemove?: () => void;
}

export default function FeaturedImageBox({
  value,
  imageUrl,
  onChange,
  onImageChange,
  onRemove,
}: FeaturedImageBoxProps) {
  const currentImage = value || imageUrl;
  const handleChange = onChange || onImageChange || (() => {});
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
          value={currentImage}
          onChange={handleChange}
          onRemove={onRemove}
        />
      </CardContent>
    </Card>
  );
}

