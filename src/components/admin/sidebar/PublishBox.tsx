'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Save, Eye, Upload, Calendar, Clock } from 'lucide-react';

interface PublishBoxProps {
  status: 'draft' | 'published' | 'archived';
  onStatusChange: (status: string) => void;
  publishDate?: string;
  onDateChange?: (date: string) => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview?: () => void;
  isLoading?: boolean;
  isSaving?: boolean; // Alias for isLoading
  isDirty?: boolean;
  lastSaved?: Date | null;
}

export default function PublishBox({
  status,
  onStatusChange,
  publishDate,
  onDateChange,
  onSave,
  onPublish,
  onPreview,
  isLoading = false,
  isDirty = false,
  lastSaved,
}: PublishBoxProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Xuất bản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Đã lưu {lastSaved.toLocaleTimeString('vi-VN')}
          </div>
        )}

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Trạng thái
          </label>
          <Select value={status} onChange={(e) => onStatusChange(e.target.value)}>
            <option value="draft">📝 Bản nháp</option>
            <option value="published">✅ Đã xuất bản</option>
            <option value="archived">📦 Lưu trữ</option>
          </Select>
        </div>

        {/* Publish Date */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Ngày xuất bản
          </label>
          <Input
            type="date"
            value={publishDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Để trống để xuất bản ngay
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-3 border-t">
          <Button 
            type="button"
            onClick={onSave} 
            variant="outline" 
            className="w-full text-sm"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Đang lưu...' : 'Lưu nháp'}
          </Button>
          
          <Button 
            type="button"
            onClick={onPublish} 
            className="w-full text-sm bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {status === 'published' ? 'Cập nhật' : 'Xuất bản'}
          </Button>

          {onPreview && (
            <Button 
              type="button"
              onClick={onPreview}
              variant="ghost" 
              className="w-full text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem trước
            </Button>
          )}
        </div>

        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Có thay đổi chưa lưu
          </div>
        )}
      </CardContent>
    </Card>
  );
}

