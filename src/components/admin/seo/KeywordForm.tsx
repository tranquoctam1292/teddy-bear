'use client';

/**
 * Keyword Form Component
 * Add/Edit keyword tracking
 */
import { useState, useEffect } from 'react';
import { X, Loader2, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Label } from '@/components/admin/ui/label';
import { Badge } from '@/components/admin/ui/badge';

interface KeywordFormProps {
  keyword?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function KeywordForm({ keyword, onSave, onCancel, isLoading }: KeywordFormProps) {
  const [formData, setFormData] = useState({
    keyword: keyword?.keyword || '',
    entityType: keyword?.entityType || 'product',
    entityId: keyword?.entityId || '',
    entitySlug: keyword?.entitySlug || '',
    searchVolume: keyword?.searchVolume || '',
    difficulty: keyword?.difficulty || '',
    cpc: keyword?.cpc || '',
    competition: keyword?.competition || 'low',
    checkFrequency: keyword?.checkFrequency || 'weekly',
    targetRank: keyword?.targetRank || '',
    targetDate: keyword?.targetDate ? new Date(keyword.targetDate).toISOString().split('T')[0] : '',
    notes: keyword?.notes || '',
    tags: keyword?.tags?.join(', ') || '',
  });

  const [fetchingMetrics, setFetchingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Fetch keyword metrics when keyword changes
  const fetchKeywordMetrics = async (keywordText: string) => {
    if (!keywordText || keywordText.length < 2) return;

    try {
      setFetchingMetrics(true);
      setMetricsError(null);

      const response = await fetch(`/api/admin/seo/keywords/metrics?keyword=${encodeURIComponent(keywordText)}`);
      const data = await response.json();

      if (data.success && data.data) {
        const metrics = data.data;
        setFormData(prev => ({
          ...prev,
          searchVolume: metrics.searchVolume || prev.searchVolume,
          difficulty: metrics.difficulty || prev.difficulty,
          cpc: metrics.cpc || prev.cpc,
          competition: metrics.competition || prev.competition,
        }));
      }
    } catch (error) {
      console.error('Error fetching keyword metrics:', error);
      setMetricsError('Không thể lấy thông tin từ khóa. Bạn có thể nhập thủ công.');
    } finally {
      setFetchingMetrics(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      searchVolume: formData.searchVolume ? Number(formData.searchVolume) : undefined,
      difficulty: formData.difficulty ? Number(formData.difficulty) : undefined,
      cpc: formData.cpc ? Number(formData.cpc) : undefined,
      targetRank: formData.targetRank ? Number(formData.targetRank) : undefined,
      targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
      tags: formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
    };

    await onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Keyword Input */}
      <div>
        <Label htmlFor="keyword">Từ khóa *</Label>
        <div className="flex gap-2">
          <Input
            id="keyword"
            value={formData.keyword}
            onChange={(e) => {
              setFormData({ ...formData, keyword: e.target.value });
              // Auto-fetch metrics after 1 second delay
              const timeoutId = setTimeout(() => {
                if (e.target.value.length >= 2) {
                  fetchKeywordMetrics(e.target.value);
                }
              }, 1000);
              return () => clearTimeout(timeoutId);
            }}
            placeholder="Nhập từ khóa..."
            required
            disabled={!!keyword}
          />
          {fetchingMetrics && (
            <div className="flex items-center px-3">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        {metricsError && (
          <div className="flex items-center gap-2 mt-1 text-xs text-yellow-600">
            <AlertCircle className="h-3 w-3" />
            {metricsError}
          </div>
        )}
      </div>

      {/* Entity Type */}
      <div>
        <Label htmlFor="entityType">Loại Entity *</Label>
        <Select
          id="entityType"
          value={formData.entityType}
          onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
          required
        >
          <option value="product">Sản phẩm</option>
          <option value="post">Bài viết</option>
          <option value="page">Trang</option>
          <option value="global">Global</option>
        </Select>
      </div>

      {/* Entity ID & Slug */}
      {formData.entityType !== 'global' && (
        <>
          <div>
            <Label htmlFor="entityId">Entity ID</Label>
            <Input
              id="entityId"
              value={formData.entityId}
              onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
              placeholder="ID của sản phẩm/bài viết..."
            />
          </div>
          <div>
            <Label htmlFor="entitySlug">Entity Slug</Label>
            <Input
              id="entitySlug"
              value={formData.entitySlug}
              onChange={(e) => setFormData({ ...formData, entitySlug: e.target.value })}
              placeholder="slug-cua-san-pham"
            />
          </div>
        </>
      )}

      {/* Keyword Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="searchVolume">Search Volume (tháng)</Label>
          <Input
            id="searchVolume"
            type="number"
            value={formData.searchVolume}
            onChange={(e) => setFormData({ ...formData, searchVolume: e.target.value })}
            placeholder="1000"
          />
        </div>
        <div>
          <Label htmlFor="difficulty">Độ khó (0-100)</Label>
          <Input
            id="difficulty"
            type="number"
            min="0"
            max="100"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            placeholder="50"
          />
        </div>
        <div>
          <Label htmlFor="cpc">CPC (VND)</Label>
          <Input
            id="cpc"
            type="number"
            value={formData.cpc}
            onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
            placeholder="10000"
          />
        </div>
        <div>
          <Label htmlFor="competition">Competition</Label>
          <Select
            id="competition"
            value={formData.competition}
            onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </Select>
        </div>
      </div>

      {/* Tracking Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkFrequency">Tần suất kiểm tra</Label>
          <Select
            id="checkFrequency"
            value={formData.checkFrequency}
            onChange={(e) => setFormData({ ...formData, checkFrequency: e.target.value })}
          >
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="monthly">Hàng tháng</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="targetRank">Mục tiêu thứ hạng</Label>
          <Input
            id="targetRank"
            type="number"
            min="1"
            max="100"
            value={formData.targetRank}
            onChange={(e) => setFormData({ ...formData, targetRank: e.target.value })}
            placeholder="10"
          />
        </div>
      </div>

      {/* Target Date */}
      <div>
        <Label htmlFor="targetDate">Ngày đạt mục tiêu</Label>
        <Input
          id="targetDate"
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
        />
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Ghi chú về từ khóa..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            keyword ? 'Cập nhật' : 'Thêm từ khóa'
          )}
        </Button>
      </div>
    </form>
  );
}








