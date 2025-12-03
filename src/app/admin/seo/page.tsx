'use client';

// SEO Management Center - Main Dashboard
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  BarChart3, 
  Search, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';

export default function SEODashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    trackedKeywords: 0,
    issuesFound: 0,
    recentAnalyses: [] as any[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch analyses
      const analysesRes = await fetch('/api/admin/seo/analysis?limit=10&sort=analyzedAt&order=desc');
      const analysesData = await analysesRes.json();
      
      // Fetch keywords
      const keywordsRes = await fetch('/api/admin/seo/keywords?limit=1');
      const keywordsData = await keywordsRes.json();

      // Calculate stats
      const analyses = analysesData.data?.analyses || [];
      const totalAnalyses = analysesData.data?.pagination?.total || 0;
      const averageScore = analyses.length > 0
        ? analyses.reduce((sum: number, a: any) => sum + (a.overallScore || 0), 0) / analyses.length
        : 0;
      const trackedKeywords = keywordsData.data?.pagination?.total || 0;
      const issuesFound = analyses.filter((a: any) => 
        a.issues && Array.isArray(a.issues) && a.issues.length > 0
      ).length;

      setStats({
        totalAnalyses,
        averageScore: Math.round(averageScore),
        trackedKeywords,
        issuesFound,
        recentAnalyses: analyses.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching SEO stats:', error);
    } finally {
      setLoading(false);
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

  const seoSections = [
    {
      title: 'Phân tích SEO',
      description: 'Xem và quản lý phân tích SEO cho sản phẩm, bài viết',
      icon: BarChart3,
      href: '/admin/seo/analysis',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Theo dõi Từ khóa',
      description: 'Theo dõi thứ hạng từ khóa và lịch sử ranking',
      icon: TrendingUp,
      href: '/admin/seo/keywords',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Cài đặt SEO',
      description: 'Cấu hình sitemap, robots.txt, schema markup',
      icon: Settings,
      href: '/admin/seo/settings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Redirects & 404',
      description: 'Quản lý redirects và theo dõi lỗi 404',
      icon: AlertCircle,
      href: '/admin/seo/redirects',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SEO Management Center
        </h1>
        <p className="text-gray-600">
          Quản lý và tối ưu hóa SEO cho website
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng số phân tích
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</div>
            <p className="text-xs text-gray-500 mt-1">Sản phẩm & Bài viết đã phân tích</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Điểm trung bình
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.averageScore}</div>
            <p className="text-xs text-gray-500 mt-1">Điểm SEO trung bình</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Từ khóa đang theo dõi
            </CardTitle>
            <Search className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.trackedKeywords}</div>
            <p className="text-xs text-gray-500 mt-1">Từ khóa đang tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vấn đề cần xử lý
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.issuesFound}</div>
            <p className="text-xs text-gray-500 mt-1">Phân tích có vấn đề</p>
          </CardContent>
        </Card>
      </div>

      {/* SEO Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {seoSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${section.bgColor}`}>
                      <Icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phân tích gần đây</CardTitle>
              <CardDescription>
                Các phân tích SEO được thực hiện gần đây
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentAnalyses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có phân tích nào. Bắt đầu phân tích sản phẩm hoặc bài viết để xem kết quả.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentAnalyses.map((analysis: any) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {analysis.entityType}: {analysis.entitySlug || analysis.entityId}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        analysis.overallScore >= 80
                          ? 'bg-green-100 text-green-700'
                          : analysis.overallScore >= 60
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {analysis.overallScore}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>SEO: {analysis.seoScore || 0}</span>
                      <span>Readability: {analysis.readabilityScore || 0}</span>
                      {analysis.issues && analysis.issues.length > 0 && (
                        <span className="text-orange-600">
                          {analysis.issues.length} vấn đề
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.overallScore >= 80 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : analysis.issues && analysis.issues.length > 0 ? (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


