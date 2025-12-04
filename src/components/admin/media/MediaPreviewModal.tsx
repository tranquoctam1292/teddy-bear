'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/admin/ui/dialog';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { MediaFile } from '@/lib/types/media';
import { formatDateLong } from '@/lib/utils/format';
import {
  Copy,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  Maximize2,
} from 'lucide-react';

interface MediaPreviewModalProps {
  file: MediaFile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (fileId: string, data: Partial<MediaFile>) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
}

export default function MediaPreviewModal({
  file,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: MediaPreviewModalProps) {
  const [editedFile, setEditedFile] = useState<Partial<MediaFile>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!file) return null;

  const handleSave = async () => {
    if (!file._id) return;

    try {
      setIsSaving(true);
      await onUpdate(file._id, editedFile);
      setEditedFile({});
      onClose();
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Không thể cập nhật tệp');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!file._id) return;
    if (!confirm('Bạn có chắc muốn xóa tệp này?')) return;

    try {
      await onDelete(file._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Không thể xóa tệp');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="flex h-[85vh]">
          {/* Left Panel - Preview */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
            {file.type === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={file.url}
                  alt={file.alt || file.filename}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Maximize2 className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Preview không khả dụng</p>
                <Button
                  onClick={() => window.open(file.url, '_blank')}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Mở tệp
                </Button>
              </div>
            )}
          </div>

          {/* Right Panel - Details */}
          <div className="w-96 bg-white flex flex-col border-l">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-lg">Chi tiết tệp</DialogTitle>
            </DialogHeader>

            {/* File Info */}
            <div className="p-6 border-b space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {file.originalName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateLong(file.uploadedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <HardDrive className="h-4 w-4" />
                  <span>{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              </div>

              {file.width && file.height && (
                <p className="text-sm text-gray-600">
                  Kích thước: {file.width} × {file.height} px
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(file.url)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  onClick={() => window.open(file.url, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải về
                </Button>
              </div>
            </div>

            {/* Metadata Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Văn bản thay thế (Alt Text)
                </label>
                <textarea
                  value={editedFile.alt ?? file.alt ?? ''}
                  onChange={(e) =>
                    setEditedFile({ ...editedFile, alt: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả ảnh cho accessibility..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Quan trọng cho SEO và người khuyết tật
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <Input
                  value={editedFile.title ?? file.title ?? ''}
                  onChange={(e) =>
                    setEditedFile({ ...editedFile, title: e.target.value })
                  }
                  className="text-sm"
                  placeholder="Tiêu đề tệp..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chú thích
                </label>
                <textarea
                  value={editedFile.caption ?? file.caption ?? ''}
                  onChange={(e) =>
                    setEditedFile({ ...editedFile, caption: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chú thích ngắn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={editedFile.description ?? file.description ?? ''}
                  onChange={(e) =>
                    setEditedFile({
                      ...editedFile,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL của tệp
                </label>
                <Input
                  value={file.url}
                  readOnly
                  className="text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t space-y-2">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || Object.keys(editedFile).length === 0
                }
                className="w-full"
              >
                {isSaving ? 'Đang lưu...' : 'Cập nhật thông tin'}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tệp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


