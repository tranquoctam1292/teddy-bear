'use client';

// Featured Image Uploader Component
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeaturedImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export default function FeaturedImageUploader({
  value,
  onChange,
  onRemove,
}: FeaturedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh phải nhỏ hơn 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Check response status first
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Tải lên thất bại';
        try {
          // Clone response to read body without consuming it
          const errorData = await response.clone().json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If response is not JSON, use status-based message
          if (response.status === 401) {
            errorMessage = 'Bạn cần đăng nhập với quyền admin để tải ảnh lên';
          } else if (response.status === 400) {
            errorMessage =
              'File không hợp lệ. Vui lòng kiểm tra định dạng và kích thước (tối đa 5MB)';
          } else if (response.status === 500) {
            errorMessage =
              'Lỗi server. Vui lòng kiểm tra cấu hình BLOB_READ_WRITE_TOKEN trong .env.local';
          } else {
            errorMessage = `Tải lên thất bại (HTTP ${response.status})`;
          }
        }
        // Set error and return early instead of throwing
        setError(errorMessage);
        setIsUploading(false);
        return;
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError('Không thể đọc phản hồi từ server');
        setIsUploading(false);
        return;
      }
      if (data.url) {
        onChange(data.url);
        setError(null); // Clear any previous errors
      } else {
        throw new Error('Không nhận được URL từ server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Set error message (this will only be used if error wasn't already set above)
      const errorMessage =
        err instanceof Error ? err.message : 'Tải ảnh lên thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Vui lòng nhập URL hợp lệ');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      setUrlInput('');
      setError(null);
    } catch {
      setError('Định dạng URL không hợp lệ');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Create a fake input event
    const fakeEvent = {
      target: {
        files: [file],
      },
    } as any;

    await handleFileSelect(fakeEvent);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        /* Image Preview */
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={value}
                alt="Featured image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized={value.includes('blob.vercel-storage.com')}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 truncate">{value}</p>
          </CardContent>
        </Card>
      ) : (
        /* Upload Interface */
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3">
                <TabsTrigger value="upload" className="text-xs">
                  <Upload className="h-3 w-3 mr-1" />
                  Tải lên
                </TabsTrigger>
                <TabsTrigger value="url" className="text-xs">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  URL
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      <p className="text-sm text-gray-600">Đang tải lên...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Nhấp để tải lên hoặc kéo thả
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>
              </TabsContent>

              {/* URL Tab */}
              <TabsContent value="url">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim()}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Đặt URL ảnh
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <p className="font-medium">⚠️ Lỗi tải lên:</p>
                <p>{error}</p>
                {error.includes('BLOB_READ_WRITE_TOKEN') && (
                  <div className="text-xs mt-2 space-y-1">
                    <p className="font-medium">💡 Hướng dẫn:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Vào Vercel Dashboard: https://vercel.com/dashboard</li>
                      <li>Chọn project → Settings → Storage → Blob</li>
                      <li>Tạo Blob store mới (nếu chưa có)</li>
                      <li>Copy BLOB_READ_WRITE_TOKEN</li>
                      <li>Thêm vào file .env.local: BLOB_READ_WRITE_TOKEN=your_token_here</li>
                    </ol>
                  </div>
                )}
                {(error.includes('store does not exist') ||
                  error.includes('store chưa được tạo')) && (
                  <div className="text-xs mt-2 space-y-1">
                    <p className="font-medium">💡 Giải pháp:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Vào Vercel Dashboard: https://vercel.com/dashboard</li>
                      <li>Chọn project → Storage → Blob</li>
                      <li>Click "Create Store" để tạo Blob store mới</li>
                      <li>Sau khi tạo, copy BLOB_READ_WRITE_TOKEN</li>
                      <li>Thêm vào .env.local và restart dev server</li>
                    </ol>
                  </div>
                )}
                {(error.includes('Unauthorized') || error.includes('đăng nhập')) && (
                  <p className="text-xs mt-1 text-red-600">
                    💡 Vui lòng đăng nhập lại với tài khoản admin
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
