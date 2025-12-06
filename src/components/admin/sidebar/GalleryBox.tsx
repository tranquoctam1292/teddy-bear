'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Upload, Star, X } from 'lucide-react';

interface GalleryBoxProps {
  images: string[];
  onAdd: (urls: string[]) => void;
  onRemove: (index: number) => void;
  onSetFeatured?: (index: number) => void;
  featuredIndex?: number;
  maxImages?: number;
}

export default function GalleryBox({
  images,
  onAdd,
  onRemove,
  onSetFeatured,
  featuredIndex = 0,
  maxImages = 10,
}: GalleryBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const urls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const uploadedUrl = data?.file?.url || data?.url;
          if (uploadedUrl) {
            urls.push(uploadedUrl);
          }
        }
      }

      if (urls.length > 0) {
        onAdd(urls);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Album ảnh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((url, index) => (
              <div
                key={url + index}
                className="relative aspect-square rounded-lg overflow-hidden border"
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
                {featuredIndex === index && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-white p-1 rounded">
                    <Star className="w-4 h-4" fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-start justify-between p-1">
                  {onSetFeatured && featuredIndex !== index && (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                      onClick={() => onSetFeatured(index)}
                      aria-label="Đặt làm ảnh đại diện"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 ml-auto"
                    onClick={() => onRemove(index)}
                    aria-label="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-sm text-gray-600">
            <Upload className="w-6 h-6 mb-2 text-gray-400" />
            <p className="mb-2 text-center">{isUploading ? 'Đang tải ảnh...' : 'Thêm ảnh'}</p>
            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
              Chọn tệp
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <p className="text-xs text-gray-400 mt-2">
              Tối đa {maxImages} ảnh. Ảnh đã có: {images.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
