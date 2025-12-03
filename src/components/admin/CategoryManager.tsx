'use client';

// Category Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import type { ProductCategory } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CategoryManagerProps {
  categories: ProductCategory[];
  onCreate: () => void;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  isLoading?: boolean;
}

export default function CategoryManager({
  categories,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (category: ProductCategory) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      return;
    }

    setDeletingId(category.id);
    try {
      await onDelete(category);
    } finally {
      setDeletingId(null);
    }
  };

  const activeCategories = categories.filter((cat) => cat.isActive);
  const inactiveCategories = categories.filter((cat) => !cat.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Danh mục sản phẩm</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý các danh mục sản phẩm của cửa hàng ({categories.length} danh mục)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {activeCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Danh mục đang hoạt động</h4>
          <div className="space-y-2">
            {activeCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      {category.icon && (
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{category.name}</h5>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Thứ tự: {category.order}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        disabled={isLoading}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
                        disabled={isLoading || deletingId === category.id}
                      >
                        {deletingId === category.id ? (
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
        </div>
      )}

      {inactiveCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Danh mục không hoạt động</h4>
          <div className="space-y-2">
            {inactiveCategories.map((category) => (
              <Card key={category.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {category.icon && (
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-gray-900">{category.name}</h5>
                        <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        disabled={isLoading}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
                        disabled={isLoading || deletingId === category.id}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo danh mục đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


