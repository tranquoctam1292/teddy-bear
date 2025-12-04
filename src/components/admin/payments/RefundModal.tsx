'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/admin/ui/dialog';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { formatCurrency } from '@/lib/utils/format';
import { Label } from '@/components/admin/ui/label';
import { TransactionWithOrder } from '@/lib/types/payment';
import { AlertTriangle } from 'lucide-react';

interface RefundModalProps {
  transaction: TransactionWithOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionId: string, amount: number, reason: string) => Promise<void>;
}

export default function RefundModal({
  transaction,
  isOpen,
  onClose,
  onSubmit,
}: RefundModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    const refundAmount = parseFloat(amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      alert('Số tiền không hợp lệ!');
      return;
    }

    if (refundAmount > transaction.amount) {
      alert('Số tiền hoàn không được lớn hơn số tiền giao dịch!');
      return;
    }

    if (!reason.trim()) {
      alert('Vui lòng nhập lý do hoàn tiền!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(transaction._id || '', refundAmount, reason);
      setAmount('');
      setReason('');
      onClose();
    } catch (error) {
      console.error('Failed to refund:', error);
      alert('Không thể hoàn tiền!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hoàn tiền giao dịch</DialogTitle>
        </DialogHeader>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">Lưu ý:</p>
            <p className="text-sm text-yellow-700 mt-1">
              Hành động này sẽ hoàn tiền cho khách hàng. Vui lòng kiểm tra kỹ trước
              khi xác nhận.
            </p>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mã giao dịch:</span>
            <span className="font-medium">
              #{transaction.gatewayTxnId || transaction._id?.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Khách hàng:</span>
            <span className="font-medium">{transaction.order?.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số tiền gốc:</span>
            <span className="font-bold text-lg">
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>

        {/* Refund Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Số tiền hoàn (VNĐ)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Tối đa: ${transaction.amount}`}
              required
              min="1"
              max={transaction.amount}
              step="1000"
              className="mt-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(transaction.amount.toString())}
              className="mt-2 text-xs"
            >
              Hoàn toàn bộ
            </Button>
          </div>

          <div>
            <Label>Lý do hoàn tiền</Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập lý do hoàn tiền..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="outline">
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hoàn tiền'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


