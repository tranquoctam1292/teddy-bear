'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Select } from '../ui/select';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
  actions?: { value: string; label: string }[];
}

export default function BulkActions({
  selectedCount,
  onAction,
  actions = [
    { value: '', label: 'Hành động hàng loạt' },
    { value: 'delete', label: 'Xóa' },
    { value: 'trash', label: 'Chuyển vào thùng rác' },
    { value: 'restore', label: 'Khôi phục' },
    { value: 'publish', label: 'Xuất bản' },
    { value: 'draft', label: 'Chuyển thành nháp' },
  ],
}: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState('');

  const handleApply = () => {
    if (selectedAction && selectedCount > 0) {
      onAction(selectedAction);
      setSelectedAction('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        className="text-sm"
        disabled={selectedCount === 0}
      >
        {actions.map((action) => (
          <option key={action.value} value={action.value}>
            {action.label}
          </option>
        ))}
      </Select>
      
      <Button
        type="button"
        onClick={handleApply}
        variant="outline"
        size="sm"
        disabled={!selectedAction || selectedCount === 0}
      >
        Áp dụng
      </Button>

      {selectedCount > 0 && (
        <span className="text-sm text-gray-600 ml-2">
          Đã chọn {selectedCount} mục
        </span>
      )}
    </div>
  );
}




