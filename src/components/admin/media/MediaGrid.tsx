'use client';

import Image from 'next/image';
import { Check, FileIcon, Film, File } from 'lucide-react';
import { MediaFile } from '@/lib/types/media';

interface MediaGridProps {
  files: MediaFile[];
  selectedFiles: Set<string>;
  onToggleSelect: (fileId: string) => void;
}

export default function MediaGrid({
  files,
  selectedFiles,
  onToggleSelect,
}: MediaGridProps) {
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return null; // Will show image preview
      case 'video':
        return <Film className="h-12 w-12 text-gray-400" />;
      case 'document':
        return <File className="h-12 w-12 text-gray-400" />;
      default:
        return <FileIcon className="h-12 w-12 text-gray-400" />;
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FileIcon className="h-16 w-16 mb-4" />
        <p className="text-lg">Không có tệp media nào</p>
        <p className="text-sm mt-2">Tải lên tệp đầu tiên của bạn</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => {
        const isSelected = selectedFiles.has(file._id || '');
        const fileId = file._id || '';

        return (
          <div
            key={fileId}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
              isSelected
                ? 'border-blue-600 shadow-lg ring-2 ring-blue-600/20'
                : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
            }`}
            onClick={() => onToggleSelect(fileId)}
          >
            {/* File Preview */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              {file.type === 'image' ? (
                <Image
                  src={file.url}
                  alt={file.alt || file.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              ) : (
                getFileIcon(file.type)
              )}
            </div>

            {/* Selection Overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
            )}

            {/* Hover Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate font-medium">
                {file.title || file.filename}
              </p>
              <p className="text-white/80 text-xs">
                {(file.size / 1024).toFixed(0)} KB
                {file.width && file.height && (
                  <span className="ml-2">
                    {file.width} × {file.height}
                  </span>
                )}
              </p>
            </div>

            {/* Selection Checkbox (always visible on mobile) */}
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected
                    ? 'bg-blue-600'
                    : 'bg-white/90 border-2 border-gray-300'
                }`}
              >
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



