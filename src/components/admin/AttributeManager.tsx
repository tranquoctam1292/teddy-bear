'use client';

// Attribute Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import type { ProductAttribute } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AttributeManagerProps {
  attributes: ProductAttribute[];
  onCreate: () => void;
  onEdit: (attribute: ProductAttribute) => void;
  onDelete: (attribute: ProductAttribute) => void;
  isLoading?: boolean;
}

export default function AttributeManager({
  attributes,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: AttributeManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (attribute: ProductAttribute) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thuộc tính "${attribute.name}"?`)) {
      return;
    }

    setDeletingId(attribute.id);
    try {
      await onDelete(attribute);
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeLabel = (type: ProductAttribute['type']) => {
    const labels: Record<ProductAttribute['type'], string> = {
      text: 'Văn bản',
      select: 'Chọn một',
      multiselect: 'Chọn nhiều',
      number: 'Số',
      boolean: 'Có/Không',
    };
    return labels[type];
  };

  const sortedAttributes = [...attributes].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thuộc tính sản phẩm</h3>
          <p className="text-sm text-gray-600 mt-1">
            Cấu hình các thuộc tính như kích thước, màu sắc, chất liệu ({attributes.length} thuộc tính)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuộc tính
        </Button>
      </div>

      {sortedAttributes.length > 0 ? (
        <div className="space-y-3">
          {sortedAttributes.map((attribute) => (
            <Card key={attribute.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900">{attribute.name}</h5>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {getTypeLabel(attribute.type)}
                        </span>
                        {attribute.isRequired && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                            Bắt buộc
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>Slug: {attribute.slug}</span>
                        <span>•</span>
                        <span>Thứ tự: {attribute.order}</span>
                        <span>•</span>
                        <span>{attribute.values.length} giá trị</span>
                      </div>
                      {attribute.values.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attribute.values.slice(0, 5).map((val) => (
                            <span
                              key={val.id}
                              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                              style={
                                val.color
                                  ? {
                                      backgroundColor: `${val.color}20`,
                                      borderColor: val.color,
                                      color: val.color,
                                    }
                                  : {}
                              }
                            >
                              {val.label}
                            </span>
                          ))}
                          {attribute.values.length > 5 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{attribute.values.length - 5} khác
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(attribute)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attribute)}
                      disabled={isLoading || deletingId === attribute.id}
                    >
                      {deletingId === attribute.id ? (
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
            <p className="text-gray-500 mb-4">Chưa có thuộc tính nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo thuộc tính đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



