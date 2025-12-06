'use client';

import Image from 'next/image';
import { Check, FileIcon, Film, File, Calendar, HardDrive } from 'lucide-react';
import { MediaFile } from '@/lib/types/media';

interface MediaListViewProps {
  files: MediaFile[];
  selectedFiles: Set<string>;
  onToggleSelect: (fileId: string) => void;
}

export default function MediaListView({
  files,
  selectedFiles,
  onToggleSelect,
}: MediaListViewProps) {
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Film className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                className="rounded"
                checked={selectedFiles.size === files.length}
                onChange={(e) => {
                  files.forEach((f) => {
                    if (e.target.checked !== selectedFiles.has(f._id || '')) {
                      onToggleSelect(f._id || '');
                    }
                  });
                }}
              />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
              Preview
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
              Tên tệp
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
              Loại
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
              Kích thước
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
              Ngày tải lên
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => {
            const isSelected = selectedFiles.has(file._id || '');
            const fileId = file._id || '';

            return (
              <tr
                key={fileId}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
                onClick={() => onToggleSelect(fileId)}
              >
                <td className="px-4 py-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {file.type === 'image' ? (
                      <Image
                        src={file.url}
                        alt={file.alt || file.filename}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.title || file.filename}
                    </p>
                    {file.alt && (
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {file.alt}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {getFileIcon(file.type)}
                    {file.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    {(file.size / 1024).toFixed(0)} KB
                  </div>
                  {file.width && file.height && (
                    <p className="text-xs text-gray-500 mt-1">
                      {file.width} × {file.height} px
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(file.uploadedAt)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}







