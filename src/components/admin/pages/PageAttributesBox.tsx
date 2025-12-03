'use client';

import { Label } from '@/components/admin/ui/label';
import { Select } from '@/components/admin/ui/select';
import { Input } from '@/components/admin/ui/input';
import { Page, PAGE_TEMPLATES } from '@/lib/types/page';
import { useEffect, useState } from 'react';

interface PageAttributesBoxProps {
  page?: Partial<Page>;
  onChange: (field: keyof Page, value: any) => void;
}

export default function PageAttributesBox({
  page,
  onChange,
}: PageAttributesBoxProps) {
  const [parentPages, setParentPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadParentPages();
  }, []);

  const loadParentPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pages?status=published&limit=100');
      if (response.ok) {
        const data = await response.json();
        // Filter out current page if editing
        const filtered = page?._id
          ? data.pages.filter((p: Page) => p._id !== page._id)
          : data.pages;
        setParentPages(filtered);
      }
    } catch (error) {
      console.error('Failed to load parent pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Thuộc tính trang</h3>

      {/* Parent Page */}
      <div>
        <Label>Trang cha</Label>
        <Select
          value={page?.parentId || ''}
          onChange={(e) => onChange('parentId', e.target.value || undefined)}
          disabled={isLoading}
          className="mt-1"
        >
          <option value="">Không có (Trang cấp cao nhất)</option>
          {parentPages.map((parent) => (
            <option key={parent._id} value={parent._id}>
              {parent.title}
            </option>
          ))}
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Chọn trang cha để tạo cấu trúc phân cấp
        </p>
      </div>

      {/* Template */}
      <div>
        <Label>Template</Label>
        <Select
          value={page?.template || 'default'}
          onChange={(e) => onChange('template', e.target.value)}
          className="mt-1"
        >
          {PAGE_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          {PAGE_TEMPLATES.find((t) => t.id === page?.template)?.description ||
            'Chọn template hiển thị'}
        </p>
      </div>

      {/* Order */}
      <div>
        <Label>Thứ tự</Label>
        <Input
          type="number"
          value={page?.order || 0}
          onChange={(e) => onChange('order', parseInt(e.target.value) || 0)}
          className="mt-1"
          min={0}
        />
        <p className="text-xs text-gray-500 mt-1">
          Số thứ tự để sắp xếp trang (nhỏ hơn = lên trước)
        </p>
      </div>
    </div>
  );
}

