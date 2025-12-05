'use client';

// Keyword Detail Page
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import KeywordForm from '@/components/admin/seo/KeywordForm';
import KeywordRankingChart from '@/components/admin/seo/KeywordRankingChart';

export default function KeywordDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const keywordId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && keywordId) {
      fetchKeyword();
    }
  }, [status, keywordId]);

  const fetchKeyword = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/seo/keywords/${keywordId}`);
      const data = await response.json();

      if (data.success) {
        setKeyword(data.data.keyword);
      } else {
        alert('Không tìm thấy từ khóa');
        router.push('/admin/seo/keywords');
      }
    } catch (error) {
      console.error('Error fetching keyword:', error);
      alert('Lỗi khi tải từ khóa');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/seo/keywords/${keywordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setKeyword(data.data.keyword);
        setIsEditing(false);
      } else {
        alert(data.error || 'Lỗi khi cập nhật từ khóa');
      }
    } catch (error) {
      console.error('Error updating keyword:', error);
      alert('Lỗi khi cập nhật từ khóa');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa từ khóa này?')) return;

    try {
      const response = await fetch(`/api/admin/seo/keywords/${keywordId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin/seo/keywords');
      } else {
        alert(data.error || 'Lỗi khi xóa từ khóa');
      }
    } catch (error) {
      console.error('Error deleting keyword:', error);
      alert('Lỗi khi xóa từ khóa');
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

  if (status === 'unauthenticated' || !keyword) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/seo/keywords')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {keyword.keyword}
            </h1>
            <p className="text-gray-600">
              Chi tiết từ khóa và lịch sử thứ hạng
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa từ khóa</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordForm
              keyword={keyword}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              isLoading={saving}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Keyword Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin từ khóa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Từ khóa</div>
                    <div className="text-lg font-semibold">{keyword.keyword}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Loại Entity</div>
                    <div className="text-lg">{keyword.entityType}</div>
                  </div>
                  {keyword.entitySlug && (
                    <div>
                      <div className="text-sm text-gray-600">Slug</div>
                      <div className="text-lg">{keyword.entitySlug}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className={`inline-block px-2 py-1 rounded text-sm ${
                      keyword.status === 'tracking'
                        ? 'bg-green-100 text-green-700'
                        : keyword.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {keyword.status}
                    </div>
                  </div>
                  {keyword.tags && keyword.tags.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {keyword.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyword.searchVolume && (
                    <div>
                      <div className="text-sm text-gray-600">Search Volume</div>
                      <div className="text-lg font-semibold">
                        {keyword.searchVolume.toLocaleString()}/tháng
                      </div>
                    </div>
                  )}
                  {keyword.difficulty !== undefined && (
                    <div>
                      <div className="text-sm text-gray-600">Độ khó</div>
                      <div className="text-lg font-semibold">{keyword.difficulty}/100</div>
                    </div>
                  )}
                  {keyword.cpc && (
                    <div>
                      <div className="text-sm text-gray-600">CPC</div>
                      <div className="text-lg font-semibold">
                        {keyword.cpc.toLocaleString()} VND
                      </div>
                    </div>
                  )}
                  {keyword.competition && (
                    <div>
                      <div className="text-sm text-gray-600">Competition</div>
                      <div className="text-lg">{keyword.competition}</div>
                    </div>
                  )}
                  {keyword.targetRank && (
                    <div>
                      <div className="text-sm text-gray-600">Mục tiêu thứ hạng</div>
                      <div className="text-lg font-semibold">#{keyword.targetRank}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ranking Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thứ hạng</CardTitle>
              <CardDescription>
                Biểu đồ thứ hạng theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordRankingChart
                keyword={keyword.keyword}
                rankingHistory={keyword.rankingHistory || []}
                currentRank={keyword.currentRank}
                previousRank={keyword.previousRank}
              />
            </CardContent>
          </Card>

          {/* Notes */}
          {keyword.notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{keyword.notes}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}





