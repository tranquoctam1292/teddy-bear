'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Image as ImageIcon, X, Star, Upload, GripVertical, FileText } from 'lucide-react';

interface ImageWithCaption {
  url: string;
  caption?: string;
}

interface GalleryBoxProps {
  images: string[] | ImageWithCaption[];
  onAdd: (urls: string[]) => void;
  onRemove: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
  onSetFeatured?: (index: number) => void;
  onCaptionChange?: (index: number, caption: string) => void;
  featuredIndex?: number;
  maxImages?: number;
  showCaptions?: boolean;
}

export default function GalleryBox({
  images,
  onAdd,
  onRemove,
  onReorder,
  onSetFeatured,
  onCaptionChange,
  featuredIndex,
  maxImages = 10,
  showCaptions = false,
}: GalleryBoxProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const urls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          urls.push(data.url);
        }
      }

      if (urls.length > 0) {
        onAdd(urls);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Tải ảnh lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDragging(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragging !== null && dragging !== index && onReorder) {
      onReorder(dragging, index);
      setDragging(index);
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const getImageUrl = (item: string | ImageWithCaption): string => {
    return typeof item === 'string' ? item : item.url;
  };

  const getImageCaption = (item: string | ImageWithCaption): string => {
    return typeof item === 'string' ? '' : (item.caption || '');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Album ảnh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((item, index) => {
              const url = getImageUrl(item);
              const caption = getImageCaption(item);
              
              return (
                <div 
                  key={index} 
                  className={`relative aspect-square group ${dragging === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src={url}
                    alt={caption || `Image ${index + 1}`}
                    fill
                    className="object-cover rounded border border-gray-200"
                    sizes="150px"
                  />
                  
                  {/* Drag Handle */}
                  {onReorder && (
                    <div className="absolute top-1 left-1 bg-white bg-opacity-80 p-1 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Featured Star */}
                  {featuredIndex === index && (
                    <div className="absolute top-1 right-1 bg-yellow-500 p-1 rounded">
                      <Star className="w-3 h-3 text-white" fill="currentColor" />
                    </div>
                  )}
                  
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded flex items-center justify-center gap-1">
                    {onSetFeatured && featuredIndex !== index && (
                      <button
                        type="button"
                        onClick={() => onSetFeatured(index)}
                        className="p-1 bg-white text-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500 hover:text-white"
                        title="Đặt làm ảnh đại diện"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    
                    {showCaptions && onCaptionChange && (
                      <button
                        type="button"
                        onClick={() => setEditingCaption(editingCaption === index ? null : index)}
                        className="p-1 bg-white text-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white"
                        title="Thêm chú thích"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Xóa"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Caption Editor */}
                  {showCaptions && onCaptionChange && editingCaption === index && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-white border-t">
                      <Input
                        type="text"
                        placeholder="Chú thích ảnh..."
                        value={caption}
                        onChange={(e) => onCaptionChange(index, e.target.value)}
                        onBlur={() => setEditingCaption(null)}
                        className="text-xs"
                        autoFocus
                      />
                    </div>
                  )}
                  
                  {/* Caption Display */}
                  {showCaptions && caption && editingCaption !== index && (
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-60 text-white text-xs truncate">
                      {caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Button */}
        {images.length < maxImages && (
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload">
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm"
                disabled={isUploading}
                onClick={() => document.getElementById('gallery-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Đang tải...' : 'Tải lên ảnh'}
              </Button>
            </label>
          </div>
        )}

        {/* Image count */}
        <p className="text-xs text-gray-500 text-center">
          {images.length} / {maxImages} ảnh
        </p>
      </CardContent>
    </Card>
  );
}

