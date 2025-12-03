'use client';

// New Keyword Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import KeywordForm from '@/components/admin/seo/KeywordForm';

export default function NewKeywordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/admin/seo/keywords/${data.data.keyword.id}`);
      } else {
        alert(data.error || 'Lỗi khi tạo từ khóa');
      }
    } catch (error) {
      console.error('Error creating keyword:', error);
      alert('Lỗi khi tạo từ khóa');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="p-8">
      <Button
        variant="secondary"
        onClick={() => router.push('/admin/seo/keywords')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Thêm từ khóa mới</CardTitle>
        </CardHeader>
        <CardContent>
          <KeywordForm
            onSave={handleSave}
            onCancel={() => router.push('/admin/seo/keywords')}
            isLoading={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
}

