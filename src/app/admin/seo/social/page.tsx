'use client';

// Social Media Preview Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import SocialPreview from '@/components/admin/seo/SocialPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Label } from '@/components/admin/ui/label';

export default function SocialPreviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    type: 'website' as 'website' | 'article' | 'product',
    siteName: 'The Emotional House',
    publishedTime: '',
    author: '',
  });

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
          Social Media Preview
        </h1>
        <p className="text-gray-600">
          Xem trước và tối ưu hóa cách nội dung hiển thị trên social media
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Thông tin Social Media
            </CardTitle>
            <CardDescription>
              Nhập thông tin để xem preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Tiêu đề bài viết/sản phẩm"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn..."
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Khuyến nghị: 1200x630px cho Facebook, 1200x675px cho Twitter
                </p>
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://emotionalhouse.vn/products/..."
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'website' | 'article' | 'product',
                    })
                  }
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="product">Product</option>
                </Select>
              </div>

              {formData.type === 'article' && (
                <>
                  <div>
                    <Label htmlFor="publishedTime">Published Time</Label>
                    <Input
                      id="publishedTime"
                      type="datetime-local"
                      value={formData.publishedTime}
                      onChange={(e) =>
                        setFormData({ ...formData, publishedTime: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Tác giả"
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div>
          <SocialPreview {...formData} />
        </div>
      </div>
    </div>
  );
}





