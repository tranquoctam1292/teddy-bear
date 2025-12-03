'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Page } from '@/lib/types/page';
import RichTextEditor from '@/components/admin/RichTextEditor';
import EditorLayout from '@/components/admin/EditorLayout';
import { PublishBox, FeaturedImageBox } from '@/components/admin/sidebar';
import {
  PageAttributesBox,
  PageSEOBox,
  PageTemplateSelector,
} from '@/components/admin/pages';

export default function NewPagePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    template: 'default',
    order: 0,
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    customCSS: '',
    customJS: '',
  });

  const updatePage = (field: keyof Page, value: any) => {
    setPage((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === 'title' && !page.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setPage((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!page.title || !page.slug) {
      alert('Vui lòng nhập tiêu đề và slug!');
      return;
    }

    try {
      setIsSaving(true);

      const saveData = {
        ...page,
        status: status || page.status,
        seoTitle: page.seoTitle || page.title,
        seoDescription: page.seoDescription || page.excerpt,
      };

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      const data = await response.json();
      alert('Lưu trang thành công!');
      router.push('/admin/pages');
    } catch (error: any) {
      console.error('Save error:', error);
      alert(error.message || 'Không thể lưu trang!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/pages">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tạo trang mới
                </h1>
                <p className="text-sm text-gray-600">
                  {page.slug ? `/${page.slug}` : 'Chưa có slug'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleSave('draft')}
                variant="outline"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu nháp
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Xuất bản'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <EditorLayout
        title="Tạo trang mới"
        subtitle={page.slug ? `/${page.slug}` : 'Chưa có slug'}
        mainContent={
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Input
                type="text"
                value={page.title}
                onChange={(e) => updatePage('title', e.target.value)}
                placeholder="Nhập tiêu đề trang..."
                className="text-2xl font-bold border-0 px-0 focus:ring-0"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Permalink:</span>
              <span className="text-gray-400">website.com/</span>
              <Input
                type="text"
                value={page.slug}
                onChange={(e) => updatePage('slug', e.target.value)}
                className="flex-1 max-w-md h-8 text-sm"
                placeholder="page-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label>Mô tả ngắn</Label>
              <textarea
                value={page.excerpt}
                onChange={(e) => updatePage('excerpt', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả ngắn về trang này..."
              />
            </div>

            {/* Content Editor */}
            <div>
              <Label className="mb-2 block">Nội dung</Label>
              <RichTextEditor
                content={page.content || ''}
                onChange={(content) => updatePage('content', content)}
                placeholder="Viết nội dung trang tại đây..."
              />
            </div>

            {/* Template Selector */}
            <div>
              <Label className="mb-3 block">Chọn Template</Label>
              <PageTemplateSelector
                selected={page.template || 'default'}
                onChange={(template) => updatePage('template', template)}
              />
            </div>

            {/* Custom CSS/JS (Advanced) */}
            <details className="bg-gray-50 rounded-lg border border-gray-200">
              <summary className="p-4 cursor-pointer font-medium text-gray-900">
                🔧 Tùy chỉnh nâng cao (CSS/JS)
              </summary>
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div>
                  <Label>Custom CSS</Label>
                  <textarea
                    value={page.customCSS || ''}
                    onChange={(e) => updatePage('customCSS', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=".custom-class { color: blue; }"
                  />
                </div>

                <div>
                  <Label>Custom JavaScript</Label>
                  <textarea
                    value={page.customJS || ''}
                    onChange={(e) => updatePage('customJS', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="console.log('Hello');"
                  />
                </div>
              </div>
            </details>
          </div>
        }
        sidebar={
          <div className="space-y-6">
            {/* Publish Box */}
            <PublishBox
              status={(page.status || 'draft') as 'draft' | 'published' | 'archived'}
              onStatusChange={(status) => updatePage('status', status)}
              publishDate=""
              onSave={() => handleSave()}
              onPublish={() => handleSave('published')}
              isSaving={isSaving}
            />

            {/* Featured Image */}
            <FeaturedImageBox
              imageUrl={page.featuredImage}
              onImageChange={(url) => updatePage('featuredImage', url)}
            />

            {/* Page Attributes */}
            <PageAttributesBox page={page} onChange={updatePage} />

            {/* SEO */}
            <PageSEOBox page={page} onChange={updatePage} />
          </div>
        }
      />
    </div>
  );
}

