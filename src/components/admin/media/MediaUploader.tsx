'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

interface MediaUploaderProps {
  onUploadComplete: () => void;
  accept?: string;
  maxSize?: number; // in MB
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function MediaUploader({
  onUploadComplete,
  accept = 'image/*,video/*,.pdf,.doc,.docx',
  maxSize = 10,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSizeBytes = maxSize * 1024 * 1024;

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: Vượt quá ${maxSize}MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(`Một số tệp không hợp lệ:\n${errors.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    // Initialize uploading state
    const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload files
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      try {
        await uploadFile(file);

        setUploadingFiles((prev) =>
          prev.map((uf) =>
            uf.file === file
              ? { ...uf, progress: 100, status: 'success' }
              : uf
          )
        );
      } catch (error: any) {
        setUploadingFiles((prev) =>
          prev.map((uf) =>
            uf.file === file
              ? {
                  ...uf,
                  progress: 0,
                  status: 'error',
                  error: error.message || 'Upload failed',
                }
              : uf
          )
        );
      }
    }

    // Notify parent
    onUploadComplete();

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadingFiles((prev) =>
        prev.filter((uf) => uf.status === 'uploading')
      );
    }, 3000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((uf) => uf.file !== file));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload
          className={`h-16 w-16 mx-auto mb-4 ${
            isDragging ? 'text-blue-600' : 'text-gray-400'
          }`}
        />
        <h3 className="text-lg font-medium mb-2 text-gray-900">
          Kéo thả tệp để tải lên
        </h3>
        <p className="text-sm text-gray-500 mb-4">hoặc</p>
        <label>
          <Button
            type="button"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Chọn tệp
          </Button>
          <input
            id="file-upload-input"
            type="file"
            multiple
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-400 mt-4">
          Kích thước tối đa: {maxSize}MB
        </p>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Đang tải lên ({uploadingFiles.length})
          </h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadingFile.file.size / 1024).toFixed(0)} KB
                </p>
                {uploadingFile.status === 'error' && (
                  <p className="text-xs text-red-600 mt-1">
                    {uploadingFile.error}
                  </p>
                )}
              </div>

              {uploadingFile.status === 'uploading' && (
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                </div>
              )}

              {uploadingFile.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              )}

              {uploadingFile.status === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              )}

              <button
                onClick={() => removeUploadingFile(uploadingFile.file)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



