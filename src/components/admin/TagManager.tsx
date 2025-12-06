'use client';

// Tag Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { ProductTag } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface TagManagerProps {
  tags: ProductTag[];
  onCreate: () => void;
  onEdit: (tag: ProductTag) => void;
  onDelete: (tag: ProductTag) => void;
  isLoading?: boolean;
}

export default function TagManager({
  tags,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: TagManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (tag: ProductTag) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tag "${tag.name}"?`)) {
      return;
    }

    setDeletingId(tag.id);
    try {
      await onDelete(tag);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tags sản phẩm</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý các tags để phân loại và tìm kiếm sản phẩm ({tags.length} tags)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tag
        </Button>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: tag.color || '#6b7280' }}
                      >
                        {tag.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({tag.productCount} sản phẩm)
                      </span>
                    </div>
                    {tag.description && (
                      <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Slug: {tag.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tag)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tag)}
                      disabled={isLoading || deletingId === tag.id}
                    >
                      {deletingId === tag.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Chưa có tag nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo tag đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}








