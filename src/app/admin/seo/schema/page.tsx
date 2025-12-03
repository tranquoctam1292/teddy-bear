'use client';

// Schema Builder Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Code, FileText, CheckCircle2 } from 'lucide-react';
import SchemaBuilder from '@/components/admin/seo/SchemaBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';

export default function SchemaBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSave = (schema: Record<string, any>) => {
    // Handle schema save
    console.log('Saving schema:', schema);
    // Could integrate with bulk apply API here
  };

  const handleValidate = (valid: boolean, errors: string[]) => {
    console.log('Validation result:', { valid, errors });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Schema Builder
        </h1>
        <p className="text-gray-600">
          Tạo và quản lý Schema.org structured data cho SEO
        </p>
      </div>

      {/* Schema Builder */}
      <SchemaBuilder onSave={handleSave} onValidate={handleValidate} />

      {/* Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Về Schema.org
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Schema.org structured data giúp Google hiểu rõ hơn về nội dung của bạn và có thể hiển thị Rich Snippets trong kết quả tìm kiếm.
            </p>
            <p>
              Sử dụng Schema Builder để tạo và validate schema cho products, articles, và các loại nội dung khác.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => window.open('https://schema.org', '_blank')}
              >
                <Code className="h-4 w-4 mr-2" />
                Tìm hiểu thêm về Schema.org
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


