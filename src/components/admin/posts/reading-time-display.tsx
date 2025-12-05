'use client';

/**
 * Reading Time Display Widget
 * 
 * Tự động tính toán và hiển thị thời gian đọc từ content
 * Cập nhật field readingTime trong Form Context
 */

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock } from 'lucide-react';
import type { PostFormData } from '@/lib/schemas/post';

interface ReadingTimeDisplayProps {
  className?: string;
}

/**
 * Calculate reading time from HTML content
 * @param content HTML content string
 * @returns Reading time in minutes
 */
function calculateReadingTime(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, ' ');

  // Remove extra whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();

  // Count words (split by spaces)
  const wordCount = cleanText.split(' ').filter((word) => word.length > 0).length;

  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(wordCount / 200);

  return Math.max(1, readingTime); // Minimum 1 minute
}

export default function ReadingTimeDisplay({ className }: ReadingTimeDisplayProps) {
  const { watch, setValue } = useFormContext<PostFormData>();
  const content = watch('content') || '';

  // Calculate reading time whenever content changes
  useEffect(() => {
    const readingTime = calculateReadingTime(content);
    setValue('readingTime', readingTime, { shouldDirty: false }); // Don't mark as dirty for auto-calculated field
  }, [content, setValue]);

  const readingTime = watch('readingTime') || calculateReadingTime(content);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Thời gian đọc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{readingTime}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {readingTime === 1 ? 'phút' : 'phút'}
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <div>Tự động tính</div>
            <div className="text-gray-400">~200 từ/phút</div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">
            Thời gian đọc được tính tự động dựa trên số từ trong nội dung.
            Giá trị này sẽ được lưu vào database.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

