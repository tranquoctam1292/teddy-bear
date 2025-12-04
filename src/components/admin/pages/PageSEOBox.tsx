'use client';

import { Label } from '@/components/admin/ui/label';
import { Input } from '@/components/admin/ui/input';
import { Page } from '@/lib/types/page';
import { Search, FileText } from 'lucide-react';

interface PageSEOBoxProps {
  page?: Partial<Page>;
  onChange: (field: keyof Page, value: any) => void;
}

export default function PageSEOBox({ page, onChange }: PageSEOBoxProps) {
  const seoTitle = page?.seoTitle || page?.title || '';
  const seoDescription = page?.seoDescription || page?.excerpt || '';
  const slug = page?.slug || '';

  // Calculate character counts
  const titleLength = seoTitle.length;
  const descLength = seoDescription.length;

  // Google SERP preview limits
  const titleLimit = 60;
  const descLimit = 160;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">SEO</h3>
      </div>

      {/* Google Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-2">Preview trên Google:</p>
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-700 font-medium truncate">
                {seoTitle || 'Tiêu đề trang của bạn'}
              </p>
              <p className="text-xs text-green-700 truncate">
                website.com/{slug || 'page-slug'}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                {seoDescription || 'Mô tả trang sẽ hiển thị tại đây...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Tiêu đề SEO</Label>
          <span
            className={`text-xs ${
              titleLength > titleLimit ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {titleLength} / {titleLimit}
          </span>
        </div>
        <Input
          value={page?.seoTitle || ''}
          onChange={(e) => onChange('seoTitle', e.target.value)}
          placeholder={page?.title || 'Tiêu đề trang...'}
          className="mt-1"
        />
        {titleLength > titleLimit && (
          <p className="text-xs text-red-600 mt-1">
            Tiêu đề quá dài, có thể bị cắt trên Google
          </p>
        )}
      </div>

      {/* SEO Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Mô tả SEO</Label>
          <span
            className={`text-xs ${
              descLength > descLimit ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {descLength} / {descLimit}
          </span>
        </div>
        <textarea
          value={page?.seoDescription || ''}
          onChange={(e) => onChange('seoDescription', e.target.value)}
          placeholder={page?.excerpt || 'Mô tả ngắn về trang này...'}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {descLength > descLimit && (
          <p className="text-xs text-red-600 mt-1">
            Mô tả quá dài, có thể bị cắt trên Google
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-900 font-medium mb-1">💡 SEO Tips:</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Tiêu đề nên 50-60 ký tự</li>
          <li>• Mô tả nên 150-160 ký tự</li>
          <li>• Bao gồm từ khóa quan trọng</li>
          <li>• Viết tự nhiên, thu hút click</li>
        </ul>
      </div>
    </div>
  );
}


