'use client';

import { useState } from 'react';
import { Search, Image, Link, FileText, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';

export default function SEOToolsPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [imageAudit, setImageAudit] = useState<any>(null);
  const [linkAudit, setLinkAudit] = useState<any>(null);

  const scanImages = async () => {
    try {
      setIsScanning(true);
      const response = await fetch('/api/admin/seo/audit/images');
      const data = await response.json();
      setImageAudit(data);
    } catch (error) {
      alert('Không thể quét images!');
    } finally {
      setIsScanning(false);
    }
  };

  const scanLinks = async () => {
    try {
      setIsScanning(true);
      const response = await fetch('/api/admin/seo/audit/links');
      const data = await response.json();
      setLinkAudit(data);
    } catch (error) {
      alert('Không thể quét links!');
    } finally {
      setIsScanning(false);
    }
  };

  const generateSitemap = async () => {
    window.open('/api/admin/seo/sitemap', '_blank');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="h-7 w-7" />
          SEO Tools
        </h1>
        <p className="text-gray-600 mt-1">Công cụ kiểm tra và tối ưu SEO</p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Image Alt Text Audit
            </CardTitle>
            <CardDescription>
              Kiểm tra tất cả hình ảnh thiếu alt text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={scanImages} disabled={isScanning} className="w-full">
              {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Quét Images
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Broken Links Checker
            </CardTitle>
            <CardDescription>
              Tìm các liên kết bị hỏng trong nội dung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={scanLinks} disabled={isScanning} className="w-full">
              {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Quét Links
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              XML Sitemap Generator
            </CardTitle>
            <CardDescription>
              Tạo sitemap.xml cho Google Search Console
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateSitemap} className="w-full" variant="secondary">
              <FileText className="h-4 w-4 mr-2" />
              Xem Sitemap
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Image Audit Results */}
      {imageAudit && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kết quả Image Alt Text Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Tổng hình ảnh</p>
                <p className="text-2xl font-bold text-blue-900">{imageAudit.stats?.totalImages || 0}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Thiếu alt text</p>
                <p className="text-2xl font-bold text-red-900">{imageAudit.stats?.totalIssues || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-green-900">
                  {imageAudit.stats?.totalImages > 0
                    ? ((1 - imageAudit.stats.totalIssues / imageAudit.stats.totalImages) * 100).toFixed(1)
                    : 100}%
                </p>
              </div>
            </div>

            {imageAudit.issues?.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Vấn đề cần khắc phục:</h3>
                {imageAudit.issues.slice(0, 10).map((issue: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {issue.filename || issue.name || issue.title}
                      </p>
                      <p className="text-xs text-gray-600">{issue.issue}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                      {issue.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Tất cả hình ảnh đều có alt text! ✨</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Link Audit Results */}
      {linkAudit && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Broken Links Check</CardTitle>
          </CardHeader>
          <CardContent>
            {linkAudit.brokenLinks?.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Tìm thấy {linkAudit.stats?.totalLinks || 0} liên kết có vấn đề
                </p>
                {linkAudit.brokenLinks.slice(0, 10).map((link: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {link.title || link.name}
                      </p>
                      <p className="text-xs text-gray-600">Link: <code className="bg-gray-200 px-1 rounded">{link.link}</code></p>
                      <p className="text-xs text-red-600 mt-1">{link.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Không tìm thấy broken links! ✨</span>
              </div>
            )}
            {linkAudit.note && (
              <p className="text-xs text-gray-500 mt-4 italic">{linkAudit.note}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


