'use client';

// Competitors Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import CompetitorAnalysis from '@/components/admin/seo/CompetitorAnalysis';

export default function CompetitorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'analysis'>('list');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCompetitors();
    }
  }, [status]);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/competitors');
      const data = await response.json();

      if (data.success) {
        setCompetitors(data.data.competitors || []);
      }
    } catch (error) {
      console.error('Error fetching competitors:', error);
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Competitor Analysis
          </h1>
          <p className="text-gray-600">
            Theo dõi và phân tích competitors
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setView(view === 'list' ? 'analysis' : 'list')}
          >
            {view === 'list' ? (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Phân tích
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Danh sách
              </>
            )}
          </Button>
          <Button onClick={() => router.push('/admin/seo/competitors/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm Competitor
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'analysis' ? (
        <CompetitorAnalysis />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Competitors</CardTitle>
            <CardDescription>
              {competitors.length} competitors đang được theo dõi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {competitors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Chưa có competitor nào</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/admin/seo/competitors/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm competitor đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {competitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{competitor.name}</h3>
                        <p className="text-sm text-gray-600">{competitor.domain}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {competitor.domainAuthority && (
                            <span>DA: {competitor.domainAuthority}</span>
                          )}
                          {competitor.backlinks && (
                            <span>Backlinks: {competitor.backlinks.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setView('analysis');
                          // Could set selected competitor here
                        }}
                      >
                        Xem phân tích
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}








