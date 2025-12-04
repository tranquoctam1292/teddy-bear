'use client';

// Email Template Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Mail } from 'lucide-react';
import type { EmailTemplate } from '@/lib/schemas/notification-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface EmailTemplateManagerProps {
  templates: EmailTemplate[];
  onCreate: () => void;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
  onPreview?: (template: EmailTemplate) => void;
  isLoading?: boolean;
}

const CATEGORY_LABELS: Record<EmailTemplate['category'], string> = {
  order: 'Đơn hàng',
  customer: 'Khách hàng',
  system: 'Hệ thống',
  marketing: 'Marketing',
};

export default function EmailTemplateManager({
  templates,
  onCreate,
  onEdit,
  onDelete,
  onPreview,
  isLoading = false,
}: EmailTemplateManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (template: EmailTemplate) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa template "${template.name}"?`)) {
      return;
    }

    setDeletingId(template.id);
    try {
      await onDelete(template);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    const categoryOrder = ['order', 'customer', 'system', 'marketing'];
    const aOrder = categoryOrder.indexOf(a.category);
    const bOrder = categoryOrder.indexOf(b.category);
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý các mẫu email ({templates.length} templates)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm template
        </Button>
      </div>

      {sortedTemplates.length > 0 ? (
        <div className="space-y-3">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900">{template.name}</h5>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {CATEGORY_LABELS[template.category]}
                        </span>
                        {template.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Đang bật
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            Đang tắt
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>Subject: {template.subject}</span>
                        {template.variables.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{template.variables.length} biến</span>
                          </>
                        )}
                      </div>
                      {template.variables.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {template.variables.slice(0, 5).map((varName) => (
                            <span
                              key={varName}
                              className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                            >
                              {`{{${varName}}}`}
                            </span>
                          ))}
                          {template.variables.length > 5 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{template.variables.length - 5} khác
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(template)}
                        disabled={isLoading}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(template)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      disabled={isLoading || deletingId === template.id}
                    >
                      {deletingId === template.id ? (
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
            <p className="text-gray-500 mb-4">Chưa có template nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo template đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



