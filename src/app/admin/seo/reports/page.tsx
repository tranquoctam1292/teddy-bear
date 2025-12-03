'use client';

// Reports Page
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FileText, BarChart3 } from 'lucide-react';
import ReportGenerator from '@/components/admin/seo/ReportGenerator';

export default function SEOReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
          SEO Reports
        </h1>
        <p className="text-gray-600">
          Tạo và xuất báo cáo SEO chi tiết
        </p>
      </div>

      {/* Report Generator */}
      <ReportGenerator />
    </div>
  );
}


