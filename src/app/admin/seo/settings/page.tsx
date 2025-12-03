'use client';

// SEO Settings Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import SitemapManager from '@/components/admin/seo/SitemapManager';

export default function SEOSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    siteName: '',
    siteDescription: '',
    siteKeywords: [],
    sitemapEnabled: true,
    robotsTxtContent: '',
    googleAnalyticsId: '',
    googleSearchConsole: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data.settings || {});
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/seo/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        alert('Cài đặt đã được lưu thành công!');
      } else {
        alert('Có lỗi xảy ra khi lưu cài đặt');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cài đặt SEO
          </h1>
          <p className="text-gray-600">
            Cấu hình các thiết lập SEO toàn cục cho website
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>

      {/* General Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cài đặt chung</CardTitle>
          <CardDescription>
            Thông tin cơ bản về website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên website
            </label>
            <Input
              value={settings.siteName || ''}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="The Emotional House"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả website
            </label>
            <textarea
              value={settings.siteDescription || ''}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Mô tả ngắn về website..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ khóa (phân cách bằng dấu phẩy)
            </label>
            <Input
              value={Array.isArray(settings.siteKeywords) ? settings.siteKeywords.join(', ') : (settings.siteKeywords || '')}
              onChange={(e) => setSettings({ 
                ...settings, 
                siteKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
              })}
              placeholder="gấu bông, teddy bear, quà tặng"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sitemap Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cài đặt Sitemap</CardTitle>
          <CardDescription>
            Cấu hình sitemap.xml
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sitemapEnabled"
              checked={settings.sitemapEnabled || false}
              onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">
              Bật sitemap tự động
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Sitemap
            </label>
            <Input
              value={settings.sitemapUrl || '/sitemap.xml'}
              onChange={(e) => setSettings({ ...settings, sitemapUrl: e.target.value })}
              placeholder="/sitemap.xml"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sitemap Manager */}
      <div className="mb-6">
        <SitemapManager sitemapUrl={settings.sitemapUrl || '/sitemap.xml'} />
      </div>

      {/* Robots.txt Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cài đặt Robots.txt</CardTitle>
          <CardDescription>
            Nội dung file robots.txt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung Robots.txt
            </label>
            <textarea
              value={settings.robotsTxtContent || ''}
              onChange={(e) => setSettings({ ...settings, robotsTxtContent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={8}
              placeholder="User-agent: *&#10;Allow: /&#10;&#10;Sitemap: https://yoursite.com/sitemap.xml"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cài đặt Analytics</CardTitle>
          <CardDescription>
            Tích hợp Google Analytics và các công cụ phân tích khác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Analytics ID
            </label>
            <Input
              value={settings.googleAnalyticsId || ''}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Search Console Verification
            </label>
            <Input
              value={settings.googleSearchConsole || ''}
              onChange={(e) => setSettings({ ...settings, googleSearchConsole: e.target.value })}
              placeholder="Verification code"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu tất cả cài đặt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

