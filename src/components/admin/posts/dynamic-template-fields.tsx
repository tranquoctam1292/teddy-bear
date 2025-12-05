'use client';

/**
 * Dynamic Template Fields Component
 * 
 * Render các trường nhập liệu riêng biệt dựa trên template đang chọn
 * Lưu dữ liệu vào field templateData
 */

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PostFormData } from '@/lib/schemas/post';
import type { PostTemplate } from '@/lib/schemas/post';
import GiftGuideBuilder from './gift-guide-builder';
import ComparisonTableBuilder from './comparison-table-builder';

interface DynamicTemplateFieldsProps {
  className?: string;
}

export default function DynamicTemplateFields({ className }: DynamicTemplateFieldsProps) {
  const { watch } = useFormContext<PostFormData>();
  const template: PostTemplate = watch('template') || 'default';

  // Chỉ hiển thị builder cho các template có custom fields
  const hasCustomFields = ['gift-guide', 'review'].includes(template);

  if (!hasCustomFields) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Cấu hình Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="template-config" className="w-full">
          <AccordionItem value="template-config">
            <AccordionTrigger className="text-sm">
              {template === 'gift-guide' && '⚙️ Cấu hình Hướng dẫn Quà tặng'}
              {template === 'review' && '⚙️ Cấu hình Đánh giá & So sánh'}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                {template === 'gift-guide' && <GiftGuideBuilder />}
                {template === 'review' && <ComparisonTableBuilder />}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

