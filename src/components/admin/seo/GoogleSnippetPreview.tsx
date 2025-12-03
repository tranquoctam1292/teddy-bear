'use client';

// Google Snippet Preview Component
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Monitor, Smartphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs';

interface GoogleSnippetPreviewProps {
  title: string;
  description: string;
  url: string;
  siteName?: string;
}

export default function GoogleSnippetPreview({
  title,
  description,
  url,
  siteName = 'The Emotional House',
}: GoogleSnippetPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Calculate character counts
  const titleLength = title.length;
  const descLength = description.length;

  // Truncate for display
  const displayTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const displayDesc = description.length > 160 ? description.slice(0, 157) + '...' : description;

  // Get status colors
  const getTitleStatus = () => {
    if (titleLength === 0) return { color: 'bg-gray-300', text: 'text-gray-600', label: 'Trống' };
    if (titleLength < 30) return { color: 'bg-red-500', text: 'text-red-600', label: 'Quá ngắn' };
    if (titleLength <= 60) return { color: 'bg-green-500', text: 'text-green-600', label: 'Tốt' };
    if (titleLength <= 70) return { color: 'bg-yellow-500', text: 'text-yellow-600', label: 'Hơi dài' };
    return { color: 'bg-red-500', text: 'text-red-600', label: 'Quá dài' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { color: 'bg-gray-300', text: 'text-gray-600', label: 'Trống' };
    if (descLength < 70) return { color: 'bg-red-500', text: 'text-red-600', label: 'Quá ngắn' };
    if (descLength <= 160) return { color: 'bg-green-500', text: 'text-green-600', label: 'Tốt' };
    if (descLength <= 170) return { color: 'bg-yellow-500', text: 'text-yellow-600', label: 'Hơi dài' };
    return { color: 'bg-red-500', text: 'text-red-600', label: 'Quá dài' };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  const formatUrl = (url: string) => {
    try {
      const formatted = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return formatted.length > 50 ? formatted.slice(0, 47) + '...' : formatted;
    } catch {
      return url;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Xem trước kết quả tìm kiếm Google</CardTitle>
          <Tabs value={device} onValueChange={(v) => setDevice(v as 'desktop' | 'mobile')} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="desktop" className="text-xs px-3 py-1">
                <Monitor className="h-3 w-3 mr-1" />
                Màn hình
              </TabsTrigger>
              <TabsTrigger value="mobile" className="text-xs px-3 py-1">
                <Smartphone className="h-3 w-3 mr-1" />
                Di động
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop Preview */}
        {device === 'desktop' && (
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <span className="text-gray-900 font-medium">{siteName}</span>
              <span>›</span>
              <span className="text-green-700">{formatUrl(url || 'blog/your-post-slug')}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-1 font-normal">
              {displayTitle || 'Your post title will appear here'}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {displayDesc || 'Your meta description will appear here. Make it engaging to improve click-through rate!'}
            </p>
          </div>
        )}

        {/* Mobile Preview */}
        {device === 'mobile' && (
          <div className="p-3 bg-white border border-gray-200 rounded-lg max-w-sm">
            {/* Title (mobile shows less) */}
            <h3 className="text-lg text-blue-800 hover:underline cursor-pointer mb-1 font-normal leading-tight">
              {title.length > 55 ? title.slice(0, 52) + '...' : (displayTitle || 'Your post title will appear here')}
            </h3>

            {/* URL */}
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <span className="text-green-700">{formatUrl(url || 'blog/your-post-slug')}</span>
            </div>

            {/* Description (mobile shows less) */}
            <p className="text-sm text-gray-600 leading-snug">
              {description.length > 120 
                ? description.slice(0, 117) + '...' 
                : (displayDesc || 'Your meta description...')}
            </p>
          </div>
        )}

        {/* Character Count Indicators */}
        <div className="space-y-3">
          {/* Title Length */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">
                Độ dài tiêu đề: {titleLength} ký tự
              </span>
              <Badge variant={titleLength <= 60 && titleLength >= 30 ? 'default' : 'destructive'} className="text-xs">
                {titleStatus.label}
              </Badge>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute h-full transition-all ${titleStatus.color}`}
                style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
              />
              {/* Optimal range indicator */}
              <div 
                className="absolute h-full border-l-2 border-green-700 opacity-30"
                style={{ left: '50%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-green-600 font-medium">30-60 tối ưu</span>
              <span>70+</span>
            </div>
          </div>

          {/* Description Length */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">
                Độ dài mô tả: {descLength} ký tự
              </span>
              <Badge variant={descLength <= 160 && descLength >= 70 ? 'default' : 'destructive'} className="text-xs">
                {descStatus.label}
              </Badge>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute h-full transition-all ${descStatus.color}`}
                style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
              />
              <div 
                className="absolute h-full border-l-2 border-green-700 opacity-30"
                style={{ left: '43.75%' }} // 70/160
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-green-600 font-medium">70-160 tối ưu</span>
              <span>170+</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-gray-600 bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
          <p className="font-medium mb-1">💡 Mẹo cải thiện tỷ lệ nhấp (CTR):</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Bao gồm từ khóa chính trong tiêu đề và mô tả</li>
            <li>Tạo tiêu đề hấp dẫn và có hành động rõ ràng</li>
            <li>Mô tả nên trả lời ý định tìm kiếm của người dùng</li>
            <li>Tránh lạm dụng từ khóa</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

