'use client';

import { FileText, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function SitemapPage() {
  const handleView = () => {
    window.open('/api/admin/seo/sitemap', '_blank');
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/admin/seo/sitemap');
      const xml = await response.text();
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
    } catch (error) {
      alert('Không thể download sitemap!');
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-7 w-7" />
          XML Sitemap
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý sitemap cho Google Search Console
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg mb-1">Sitemap của bạn</h3>
            <p className="text-sm text-gray-600">
              Sitemap tự động generate từ tất cả posts, products, và pages đã publish
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleView} variant="secondary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
          <p className="text-gray-600">/api/admin/seo/sitemap</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          📝 Submit to Google Search Console
        </h3>
        <ol className="text-sm text-blue-700 space-y-2">
          <li>1. Mở <a href="https://search.google.com/search-console" target="_blank" className="underline">Google Search Console</a></li>
          <li>2. Chọn property của bạn</li>
          <li>3. Vào Sitemaps ở sidebar</li>
          <li>4. Nhập URL: <code className="bg-blue-100 px-2 py-1 rounded">api/admin/seo/sitemap</code></li>
          <li>5. Click Submit</li>
        </ol>
      </div>

      <div className="mt-6 bg-white rounded-lg border p-6">
        <h3 className="font-bold mb-4">Sitemap Content</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Homepage</span>
            <span className="text-gray-600">Priority: 1.0</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Blog Posts (published)</span>
            <span className="text-gray-600">Priority: 0.8</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Products (published)</span>
            <span className="text-gray-600">Priority: 0.9</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Pages (published)</span>
            <span className="text-gray-600">Priority: 0.7</span>
          </div>
        </div>
      </div>
    </div>
  );
}




