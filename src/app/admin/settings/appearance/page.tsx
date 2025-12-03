'use client';

// Admin Appearance Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Palette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import AppearanceForm from '@/components/admin/AppearanceForm';
import LogoUploader from '@/components/admin/LogoUploader';
import type { AppearanceConfig } from '@/lib/schemas/appearance-settings';

export default function AdminAppearanceSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Appearance Config state
  const [config, setConfig] = useState<AppearanceConfig | undefined>();
  const [configLoading, setConfigLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConfig();
    }
  }, [status]);

  const fetchConfig = async () => {
    try {
      setConfigLoading(true);
      const response = await fetch('/api/admin/settings/appearance');
      if (!response.ok) throw new Error('Failed to fetch appearance config');
      const data = await response.json();
      setConfig(data.config);
    } catch (error) {
      console.error('Error fetching appearance config:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSaveConfig = async (data: any) => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save appearance config');
      }

      await fetchConfig();
      alert('Cập nhật cấu hình giao diện thành công!');
    } catch (error) {
      console.error('Error saving appearance config:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadLogo = async (file: File): Promise<string> => {
    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/admin/settings/appearance/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload logo');
      }

      const data = await response.json();
      await fetchConfig();
      return data.url;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUploadFavicon = async (file: File): Promise<string> => {
    try {
      setUploadingFavicon(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'favicon');

      const response = await fetch('/api/admin/settings/appearance/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload favicon');
      }

      const data = await response.json();
      await fetchConfig();
      return data.url;
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const response = await fetch('/api/admin/settings/appearance/delete?type=logo', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete logo');
      }

      await fetchConfig();
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa logo');
      throw error;
    }
  };

  const handleDeleteFavicon = async () => {
    try {
      const response = await fetch('/api/admin/settings/appearance/delete?type=favicon', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete favicon');
      }

      await fetchConfig();
    } catch (error) {
      console.error('Error deleting favicon:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa favicon');
      throw error;
    }
  };

  if (status === 'loading' || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Giao diện</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tùy chỉnh theme và màu sắc
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Appearance Form */}
        <AppearanceForm
          config={config}
          onSubmit={handleSaveConfig}
          isLoading={isSaving}
        />

        {/* Logo & Favicon */}
        <Card>
          <CardHeader>
            <CardTitle>Logo & Favicon</CardTitle>
            <CardDescription>
              Upload và quản lý logo, favicon của website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <LogoUploader
                currentLogo={config?.logo}
                onUpload={handleUploadLogo}
                onDelete={handleDeleteLogo}
                isLoading={uploadingLogo}
                type="logo"
              />
            </div>

            <div className="border-t pt-8">
              <LogoUploader
                currentLogo={config?.favicon}
                onUpload={handleUploadFavicon}
                onDelete={handleDeleteFavicon}
                isLoading={uploadingFavicon}
                type="favicon"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

