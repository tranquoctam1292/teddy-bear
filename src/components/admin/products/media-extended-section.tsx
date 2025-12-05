'use client';

/**
 * Media Extended Section
 * Form section để upload media nâng cao (video, 360 images, lifestyle images)
 */

import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X, Upload, Video, RotateCw } from 'lucide-react';
import Image from 'next/image';
import type { ProductFormData } from '@/lib/schemas/product';

interface ImageUploaderProps {
  images: string[];
  onAdd: (urls: string[]) => void;
  onRemove: (index: number) => void;
  label: string;
  maxImages?: number;
}

function ImageUploader({ images, onAdd, onRemove, label, maxImages = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    try {
      setIsUploading(true);
      const urls: string[] = [];

      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} không phải là file ảnh`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} vượt quá 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          urls.push(data.url);
        } else {
          alert(`Tải ${file.name} lên thất bại`);
        }
      }

      if (urls.length > 0) {
        onAdd(urls);
      } else {
        alert('Không có ảnh nào được tải lên thành công');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={url}
                alt={`${label} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Xóa ảnh ${index + 1}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">
              Thêm ảnh
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      {isUploading && (
        <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
      )}
      <p className="text-xs text-gray-500">
        Đã upload {images.length}/{maxImages} ảnh
      </p>
    </div>
  );
}

export default function MediaExtendedSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const videoUrl = watch('videoUrl') || '';
  const videoThumbnail = watch('videoThumbnail') || '';
  const images360 = watch('images360') || [];
  const lifestyleImages = watch('lifestyleImages') || [];

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Handle video thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh phải nhỏ hơn 5MB');
      return;
    }

    try {
      setIsUploadingThumbnail(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setValue('videoThumbnail', data.url);
      } else {
        alert('Tải ảnh lên thất bại');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Tải ảnh lên thất bại');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media mở rộng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video URL */}
        <div className="space-y-2">
          <Label htmlFor="videoUrl">
            <Video className="w-4 h-4 inline mr-2" />
            Video giới thiệu (YouTube/Vimeo)
          </Label>
          <Input
            id="videoUrl"
            type="url"
            {...register('videoUrl')}
            placeholder="https://www.youtube.com/watch?v=... hoặc https://vimeo.com/..."
          />
          <p className="text-xs text-gray-500">
            Nhập URL video từ YouTube hoặc Vimeo
          </p>
          {errors.videoUrl && (
            <p className="text-sm text-red-600">{errors.videoUrl.message}</p>
          )}
        </div>

        {/* Video Thumbnail */}
        <div className="space-y-2">
          <Label>Thumbnail video</Label>
          {videoThumbnail ? (
            <div className="relative w-full max-w-md">
              <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={videoThumbnail}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setValue('videoThumbnail', '')}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                aria-label="Xóa thumbnail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block w-full max-w-md aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Tải ảnh thumbnail lên</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                disabled={isUploadingThumbnail}
              />
            </label>
          )}
          {isUploadingThumbnail && (
            <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
          )}
          {errors.videoThumbnail && (
            <p className="text-sm text-red-600">
              {errors.videoThumbnail.message}
            </p>
          )}
        </div>

        {/* 360 Images */}
        <div className="space-y-3">
          <Label>
            <RotateCw className="w-4 h-4 inline mr-2" />
            Hình ảnh 360 độ
          </Label>
          <p className="text-sm text-gray-500">
            Upload nhiều ảnh để tạo hiệu ứng xoay 360 độ (tối đa 36 ảnh)
          </p>
          <Controller
            name="images360"
            control={control}
            render={({ field }) => (
              <ImageUploader
                images={field.value || []}
                onAdd={(urls) => {
                  setValue('images360', [...(field.value || []), ...urls]);
                }}
                onRemove={(index) => {
                  const newImages = [...(field.value || [])];
                  newImages.splice(index, 1);
                  setValue('images360', newImages);
                }}
                label="Ảnh 360 độ"
                maxImages={36}
              />
            )}
          />
          {errors.images360 && (
            <p className="text-sm text-red-600">{errors.images360.message}</p>
          )}
        </div>

        {/* Lifestyle Images */}
        <div className="space-y-3">
          <Label>
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Hình ảnh lifestyle
          </Label>
          <p className="text-sm text-gray-500">
            Ảnh thực tế sản phẩm trong đời sống (tối đa 10 ảnh)
          </p>
          <Controller
            name="lifestyleImages"
            control={control}
            render={({ field }) => (
              <ImageUploader
                images={field.value || []}
                onAdd={(urls) => {
                  setValue('lifestyleImages', [...(field.value || []), ...urls]);
                }}
                onRemove={(index) => {
                  const newImages = [...(field.value || [])];
                  newImages.splice(index, 1);
                  setValue('lifestyleImages', newImages);
                }}
                label="Ảnh lifestyle"
                maxImages={10}
              />
            )}
          />
          {errors.lifestyleImages && (
            <p className="text-sm text-red-600">
              {errors.lifestyleImages.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

