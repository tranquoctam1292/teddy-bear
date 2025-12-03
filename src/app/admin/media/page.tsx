'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Grid3x3, 
  List, 
  Trash2, 
  Download,
  RefreshCw,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { MediaFile } from '@/lib/types/media';
import {
  MediaGrid,
  MediaListView,
  MediaUploader,
  MediaPreviewModal,
  MediaFilterBar,
  StorageIndicator,
} from '@/components/admin/media';

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    loadMedia();
  }, [filterType, filterDate, searchQuery]);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        type: filterType,
        dateRange: filterDate,
        search: searchQuery,
        limit: '100',
      });

      const response = await fetch(`/api/admin/media?${params}`);
      if (!response.ok) throw new Error('Failed to load media');

      const data = await response.json();
      setFiles(data.files || []);
      setTotalFiles(data.total || 0);
      setStorageUsed(data.storageUsed || 0);
    } catch (error) {
      console.error('Error loading media:', error);
      alert('Không thể tải media. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f._id || '')));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    
    if (
      !confirm(
        `Bạn có chắc muốn xóa ${selectedFiles.size} tệp đã chọn?`
      )
    ) {
      return;
    }

    try {
      const ids = Array.from(selectedFiles).join(',');
      const response = await fetch(`/api/admin/media?ids=${ids}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      alert('Xóa thành công!');
      setSelectedFiles(new Set());
      loadMedia();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Không thể xóa. Vui lòng thử lại!');
    }
  };

  const handleFileClick = (file: MediaFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleUpdateFile = async (
    fileId: string,
    data: Partial<MediaFile>
  ) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update');

      await loadMedia();
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      await loadMedia();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Thư viện Media
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả hình ảnh và tệp tin của bạn
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={loadMedia}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button onClick={() => setIsUploading(!isUploading)}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Đóng Upload' : 'Tải lên'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            <strong>{totalFiles}</strong> tệp
          </span>
          <span>•</span>
          <span>
            <strong>{(storageUsed / (1024 * 1024)).toFixed(2)} MB</strong> đã
            sử dụng
          </span>
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="mb-6">
        <StorageIndicator used={storageUsed} />
      </div>

      {/* Upload Area */}
      {isUploading && (
        <div className="mb-6">
          <MediaUploader
            onUploadComplete={() => {
              loadMedia();
              setIsUploading(false);
            }}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {selectedFiles.size > 0 && (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Đã chọn {selectedFiles.size} tệp
                </span>
                <Button
                  onClick={handleBulkDelete}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
                <button
                  onClick={() => setSelectedFiles(new Set())}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Bỏ chọn
                </button>
              </>
            )}
            {selectedFiles.size === 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Chọn tất cả
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <MediaFilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Media Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600">Đang tải media...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ImageIcon className="h-16 w-16 mb-4" />
            <p className="text-lg mb-2">Chưa có tệp media nào</p>
            <p className="text-sm mb-4">
              {searchQuery || filterType !== 'all' || filterDate !== 'all'
                ? 'Không tìm thấy kết quả phù hợp'
                : 'Tải lên tệp đầu tiên của bạn'}
            </p>
            {!searchQuery && filterType === 'all' && filterDate === 'all' && (
              <Button onClick={() => setIsUploading(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên ngay
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <MediaGrid
            files={files}
            selectedFiles={selectedFiles}
            onToggleSelect={(fileId) => {
              toggleSelectFile(fileId);
              const file = files.find((f) => f._id === fileId);
              if (file) handleFileClick(file);
            }}
          />
        ) : (
          <MediaListView
            files={files}
            selectedFiles={selectedFiles}
            onToggleSelect={(fileId) => {
              toggleSelectFile(fileId);
              const file = files.find((f) => f._id === fileId);
              if (file) handleFileClick(file);
            }}
          />
        )}
      </div>

      {/* Preview Modal */}
      <MediaPreviewModal
        file={selectedFile}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedFile(null);
        }}
        onUpdate={handleUpdateFile}
        onDelete={handleDeleteFile}
      />
    </div>
  );
}
