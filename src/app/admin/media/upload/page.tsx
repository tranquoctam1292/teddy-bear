'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { MediaUploader } from '@/components/admin/media';
import Link from 'next/link';

export default function MediaUploadPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/media">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Upload className="h-7 w-7" />
              Upload Media Files
            </h1>
            <p className="text-gray-600 mt-1">
              Tải lên hình ảnh, video và tài liệu
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <MediaUploader
          onUploadComplete={() => {
            alert('Upload thành công!');
            router.push('/admin/media');
          }}
        />
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium mb-2">
          💡 Hỗ trợ:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Kích thước tối đa: 10MB/file</li>
          <li>• Hỗ trợ: Images (JPG, PNG, GIF, WebP), Videos (MP4), Documents (PDF)</li>
          <li>• Kéo thả nhiều files cùng lúc</li>
          <li>• Files được lưu trên Vercel Blob</li>
        </ul>
      </div>
    </div>
  );
}







