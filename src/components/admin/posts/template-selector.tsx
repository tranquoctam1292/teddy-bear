'use client';

/**
 * Template Selector Component
 * 
 * Cho phép chọn loại template cho bài viết
 * Templates: default, gift-guide, review, care-guide, story
 */

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Gift, Star, Heart, BookOpen, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import type { PostFormData } from '@/lib/schemas/post';
import type { PostTemplate } from '@/lib/schemas/post';

interface TemplateOption {
  value: PostTemplate;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    value: 'default',
    label: 'Bài viết thường',
    description: 'Template mặc định cho bài viết blog thông thường',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-gray-600',
  },
  {
    value: 'gift-guide',
    label: 'Hướng dẫn quà tặng',
    description: 'Template cho bài viết hướng dẫn chọn quà tặng theo dịp',
    icon: <Gift className="w-5 h-5" />,
    color: 'text-pink-600',
  },
  {
    value: 'review',
    label: 'Đánh giá sản phẩm',
    description: 'Template cho bài viết đánh giá và so sánh sản phẩm',
    icon: <Star className="w-5 h-5" />,
    color: 'text-yellow-600',
  },
  {
    value: 'care-guide',
    label: 'Hướng dẫn chăm sóc',
    description: 'Template cho bài viết hướng dẫn bảo quản và chăm sóc',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-red-600',
  },
  {
    value: 'story',
    label: 'Câu chuyện',
    description: 'Template cho bài viết kể chuyện, chia sẻ trải nghiệm',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-blue-600',
  },
];

interface TemplateSelectorProps {
  className?: string;
}

export default function TemplateSelector({ className }: TemplateSelectorProps) {
  const { watch, setValue } = useFormContext<PostFormData>();
  const currentTemplate = watch('template') || 'default';
  const templateData = watch('templateData');
  const [showWarning, setShowWarning] = useState(false);
  const [previousTemplate, setPreviousTemplate] = useState<PostTemplate | null>(null);

  const handleTemplateChange = (newTemplate: PostTemplate) => {
    // Nếu đang có templateData và đổi template, hiển thị cảnh báo
    if (templateData && Object.keys(templateData).length > 0 && currentTemplate !== newTemplate) {
      setPreviousTemplate(currentTemplate);
      setShowWarning(true);
      
      // Auto-hide warning after 5 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }

    // Update template
    setValue('template', newTemplate, { shouldDirty: true });

    // Nếu đổi template, có thể reset templateData (tùy chọn)
    // Hoặc giữ nguyên để user có thể quay lại
  };

  const handleConfirmChange = () => {
    // Reset templateData khi đổi template
    setValue('templateData', {}, { shouldDirty: true });
    setShowWarning(false);
    setPreviousTemplate(null);
  };

  const handleCancelChange = () => {
    // Quay lại template cũ
    if (previousTemplate) {
      setValue('template', previousTemplate, { shouldDirty: true });
    }
    setShowWarning(false);
    setPreviousTemplate(null);
  };

  const selectedTemplate = TEMPLATE_OPTIONS.find((opt) => opt.value === currentTemplate);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {selectedTemplate?.icon && (
            <span className={selectedTemplate.color}>{selectedTemplate.icon}</span>
          )}
          Loại bài viết
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Template Selector */}
        <Select value={currentTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger>
            <SelectValue>
              {selectedTemplate ? (
                <div className="flex items-center gap-2">
                  <span className={selectedTemplate.color}>{selectedTemplate.icon}</span>
                  <span>{selectedTemplate.label}</span>
                </div>
              ) : (
                'Chọn loại bài viết'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span className={option.color}>{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Template Description */}
        {selectedTemplate && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {selectedTemplate.description}
          </div>
        )}

        {/* Warning Alert */}
        {showWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="font-medium mb-1">Cảnh báo: Đổi template</div>
              <div className="mb-2">
                Bạn đang có dữ liệu template cũ. Dữ liệu này có thể không tương thích với template mới.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmChange}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Xác nhận đổi
                </button>
                <button
                  type="button"
                  onClick={handleCancelChange}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Template Info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>
            💡 Mỗi template có các trường nhập liệu riêng. Chọn template phù hợp để có trải nghiệm tốt nhất.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

