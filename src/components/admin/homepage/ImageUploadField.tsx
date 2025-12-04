'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = 'Image',
  required = false,
  aspectRatio = '16/9',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  // Handle file upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setUrlInput(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  // Handle URL input
  function handleUrlSubmit() {
    if (urlInput && urlInput.startsWith('http')) {
      onChange(urlInput);
    }
  }

  // Clear image
  function handleClear() {
    onChange('');
    setUrlInput('');
  }

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Current Image Preview */}
      {value && (
        <div className="relative rounded-lg border overflow-hidden bg-gray-50">
          <div
            className="relative w-full"
            style={{ aspectRatio: aspectRatio }}
          >
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      {!value && (
        <div className="space-y-3">
          {/* File Upload */}
          <div>
            <label
              htmlFor={`file-upload-${label}`}
              className={cn(
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors',
                uploading && 'pointer-events-none opacity-50'
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                  <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </>
              )}
            </label>
            <input
              id={`file-upload-${label}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Or URL Input */}
          <div className="relative flex items-center gap-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              OR
            </div>
            <Input
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
              className="pl-12"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleUrlSubmit}
              disabled={!urlInput || !urlInput.startsWith('http')}
            >
              Use URL
            </Button>
          </div>
        </div>
      )}

      {/* Change Image */}
      {value && (
        <div className="flex gap-2">
          <label htmlFor={`file-change-${label}`} className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </>
                )}
              </span>
            </Button>
          </label>
          <input
            id={`file-change-${label}`}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}

