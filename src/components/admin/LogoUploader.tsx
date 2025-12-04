'use client';

// Logo Uploader Component
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LogoUploaderProps {
  currentLogo?: string;
  onUpload: (file: File) => Promise<string>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
  type?: 'logo' | 'favicon';
}

export default function LogoUploader({
  currentLogo,
  onUpload,
  onDelete,
  isLoading = false,
  type = 'logo',
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = type === 'logo'
      ? ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
      : ['image/png', 'image/x-icon', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 500 * 1024;
    if (file.size > maxSize) {
      alert(`File too large. Max size: ${maxSize / 1024}KB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      const url = await onUpload(file);
      setPreview(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Có lỗi xảy ra khi upload file');
      setPreview(currentLogo || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${type === 'logo' ? 'logo' : 'favicon'}?`)) {
      return;
    }

    try {
      await onDelete();
      setPreview(null);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Có lỗi xảy ra khi xóa file');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          {type === 'logo' ? 'Logo' : 'Favicon'}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {type === 'logo'
            ? 'Upload logo cho website (PNG, JPG, SVG, WebP, max 2MB)'
            : 'Upload favicon cho website (PNG, ICO, SVG, max 500KB)'}
        </p>
      </div>

      {preview ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={`
                  flex items-center justify-center border-2 border-gray-200 rounded-lg
                  ${type === 'logo' ? 'w-32 h-32' : 'w-16 h-16'}
                  bg-gray-50
                `}
              >
                <img
                  src={preview}
                  alt={type}
                  className={`
                    ${type === 'logo' ? 'max-w-32 max-h-32' : 'max-w-16 max-h-16'}
                    object-contain
                  `}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {type === 'logo' ? 'Logo hiện tại' : 'Favicon hiện tại'}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {preview.startsWith('data:') ? 'Preview' : preview}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Thay thế
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading || uploading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Chưa có {type === 'logo' ? 'logo' : 'favicon'}
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {type === 'logo' ? 'Logo' : 'Favicon'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'logo' ? 'image/png,image/jpeg,image/jpg,image/svg+xml,image/webp' : 'image/png,image/x-icon,image/svg+xml'}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading || uploading}
      />
    </div>
  );
}



