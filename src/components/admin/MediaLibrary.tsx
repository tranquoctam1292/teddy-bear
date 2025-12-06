'use client';

// WordPress-style Media Library Component
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Search, Check, Image as ImageIcon } from 'lucide-react';
import { Select } from './ui/select';

interface MediaFile {
  id?: string;
  _id?: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  caption?: string;
  description?: string;
  uploadedAt: Date | string;
}

// Helper to get file ID (support both id and _id)
const getFileId = (file: MediaFile): string => {
  return file.id || file._id || file.url;
};

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: MediaFile) => void;
  multiple?: boolean;
  accept?: string;
}

export default function MediaLibrary({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  accept = 'image/*',
}: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles();
    }
  }, [isOpen]);

  const loadMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.files) {
          // Normalize files: ensure id field exists, convert uploadedAt to Date
          const normalizedFiles = data.files.map((file: MediaFile) => ({
            ...file,
            id: file._id || file.id || file.url,
            uploadedAt:
              typeof file.uploadedAt === 'string'
                ? new Date(file.uploadedAt)
                : file.uploadedAt || new Date(),
          }));
          setFiles(normalizedFiles);
        } else {
          setFiles([]);
        }
      }
    } catch (error) {
      console.error('Failed to load media files:', error);
      setFiles([]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    try {
      setIsUploading(true);

      for (const file of Array.from(uploadFiles)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.file) {
            // Add uploaded file immediately to the list
            const newFile = {
              ...data.file,
              id: data.file._id || data.file.id || data.file.url,
              uploadedAt:
                typeof data.file.uploadedAt === 'string'
                  ? new Date(data.file.uploadedAt)
                  : data.file.uploadedAt || new Date(),
            };
            setFiles((prev) => [newFile, ...prev]);
          }
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const toggleSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      if (!multiple) {
        newSelected.clear();
      }
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleInsert = () => {
    const selected = files.filter((f) => selectedFiles.has(getFileId(f)));
    if (selected.length > 0) {
      if (multiple) {
        selected.forEach((file) => onSelect(file));
      } else {
        onSelect(selected[0]);
      }
      onClose();
    }
  };

  const filteredFiles = files.filter((file) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        file.filename.toLowerCase().includes(query) ||
        file.alt?.toLowerCase().includes(query) ||
        file.title?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedFile = files.find((f) => selectedFiles.has(getFileId(f)));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0">
        <div className="flex h-[85vh]">
          {/* Left Panel - Media Grid */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-xl">Thư viện Media</DialogTitle>
              <DialogDescription className="sr-only">
                Quản lý và chọn ảnh từ thư viện media
              </DialogDescription>
            </DialogHeader>

            {/* Tabs */}
            <Tabs defaultValue="library" className="flex-1 flex flex-col">
              <TabsList className="px-6 pt-4 justify-start bg-transparent border-b rounded-none">
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Tải lên tệp mới
                </TabsTrigger>
                <TabsTrigger
                  value="library"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Chọn từ thư viện Media
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="flex-1 p-6">
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
                  {isUploading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                      <p>Đang tải lên...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Kéo thả tệp để tải lên</h3>
                      <p className="text-sm text-gray-500 mb-4">hoặc</p>
                      <label>
                        <Button
                          type="button"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Chọn tệp
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept={accept}
                          onChange={handleUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-4">Kích thước tối đa: 10MB</p>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Library Tab */}
              <TabsContent value="library" className="flex-1 flex flex-col">
                {/* Filters */}
                <section
                  className="px-6 py-3 border-b bg-gray-50 flex items-center gap-4"
                  aria-label="Media filters"
                >
                  <span className="text-sm font-medium text-gray-700">Lọc media</span>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Tất cả</option>
                    <option value="images">Hình ảnh</option>
                    <option value="videos">Video</option>
                  </Select>
                  <Select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-48"
                  >
                    <option value="all">Tất cả các ngày</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                  </Select>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Tìm tệp media"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </section>

                {/* Media Grid */}
                <section className="flex-1 overflow-y-auto p-6" aria-label="Media gallery">
                  {filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="h-16 w-16 mb-4" />
                      <p>Không có tệp media nào</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {filteredFiles.map((file) => {
                        const fileId = getFileId(file);
                        return (
                          <div
                            key={fileId}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              selectedFiles.has(fileId)
                                ? 'border-blue-600 shadow-lg'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => toggleSelect(fileId)}
                          >
                            <Image
                              src={file.url}
                              alt={file.alt || file.filename}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 200px"
                            />
                            {selectedFiles.has(fileId) && (
                              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Check className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Attachment Details */}
          {selectedFile && (
            <div className="w-80 border-l bg-white flex flex-col h-full">
              {/* Header Section - Fixed */}
              <div className="p-6 border-b flex-shrink-0">
                <h3 className="font-medium text-sm text-gray-700 mb-4">CHI TIẾT TỆP ĐÍNH KÈM</h3>

                {/* Image Preview */}
                <div className="relative h-32 mb-4 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.alt || selectedFile.filename}
                    fill
                    className="object-contain"
                    sizes="320px"
                  />
                </div>

                {/* File Info */}
                <div className="space-y-2 text-sm mb-4">
                  <p className="font-medium truncate">{selectedFile.filename}</p>
                  <p className="text-gray-500">
                    {new Date(selectedFile.uploadedAt).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  {selectedFile.width && selectedFile.height && (
                    <p className="text-gray-500">
                      {selectedFile.width} × {selectedFile.height} pixel
                    </p>
                  )}
                </div>

                <div className="flex gap-2 text-sm">
                  <button className="text-blue-600 hover:underline">Sửa ảnh</button>
                  <button className="text-red-600 hover:underline">Xóa vĩnh viễn</button>
                </div>
              </div>

              {/* Metadata Form - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Văn bản thay thế
                  </label>
                  <textarea
                    value={selectedFile.alt || ''}
                    readOnly
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Mô tả ảnh cho accessibility"
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-2 text-xs">
                    Tạo văn bản thay thế
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <Input value={selectedFile.title || ''} readOnly className="text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chú thích</label>
                  <textarea
                    value={selectedFile.caption || ''}
                    readOnly
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={selectedFile.description || ''}
                    readOnly
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liên kết của tệp tin
                  </label>
                  <Input value={selectedFile.url} readOnly className="text-sm bg-gray-50" />
                </div>
              </div>

              {/* Sticky Footer with Insert Button */}
              <div className="flex-shrink-0 border-t bg-white p-4">
                <Button
                  onClick={handleInsert}
                  disabled={selectedFiles.size === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  size="lg"
                >
                  {selectedFiles.size === 0
                    ? 'Chọn ảnh để chèn'
                    : selectedFiles.size === 1
                    ? 'Chèn vào bài viết'
                    : `Chèn ${selectedFiles.size} ảnh`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Insert Button - Only show when no file selected in sidebar */}
        {selectedFiles.size > 0 && !selectedFile && (
          <div className="absolute bottom-4 right-4 z-[130]">
            <Button
              onClick={handleInsert}
              disabled={selectedFiles.size === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {`Chèn ${selectedFiles.size} ảnh`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
