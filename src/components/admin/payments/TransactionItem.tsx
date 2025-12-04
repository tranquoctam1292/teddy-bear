'use client';

import { TransactionWithOrder } from '@/lib/types/payment';
import { Calendar, DollarSign, CreditCard, User, Mail } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

interface TransactionItemProps {
  transaction: TransactionWithOrder;
  onViewDetails: (transaction: TransactionWithOrder) => void;
  onRefund: (transaction: TransactionWithOrder) => void;
}

export default function TransactionItem({
  transaction,
  onViewDetails,
  onRefund,
}: TransactionItemProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: transaction.currency || 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Thành công', className: 'bg-green-100 text-green-700' },
      failed: { label: 'Thất bại', className: 'bg-red-100 text-red-700' },
      refunded: { label: 'Đã hoàn', className: 'bg-purple-100 text-purple-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      vnpay: '🏦',
      momo: '📱',
      paypal: '💳',
      stripe: '💰',
      cod: '💵',
    };
    return icons[method] || '💳';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Transaction ID */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-blue-600">
              #{transaction.gatewayTxnId || transaction._id?.slice(-8)}
            </span>
            {getStatusBadge(transaction.status)}
          </div>

          {/* Order Info */}
          {transaction.order && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{transaction.order.customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{transaction.order.customerEmail}</span>
              </div>
            </div>
          )}

          {/* Date & Payment Method */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
              <span className="capitalize">{transaction.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
            <DollarSign className="h-6 w-6" />
            {formatCurrency(transaction.amount)}
          </div>
          {transaction.refundAmount && transaction.refundAmount > 0 && (
            <div className="text-sm text-purple-600 mt-1">
              Đã hoàn: {formatCurrency(transaction.refundAmount)}
            </div>
          )}
        </div>
      </div>

      {/* Refund Info */}
      {transaction.status === 'refunded' && transaction.refundReason && (
        <div className="p-3 bg-purple-50 rounded-lg text-sm mb-3">
          <p className="text-purple-900 font-medium">Lý do hoàn tiền:</p>
          <p className="text-purple-700">{transaction.refundReason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={() => onViewDetails(transaction)} size="sm" variant="outline">
          Xem chi tiết
        </Button>
        {transaction.status === 'completed' && (
          <Button
            onClick={() => onRefund(transaction)}
            size="sm"
            variant="outline"
            className="text-purple-600 hover:text-purple-700"
          >
            Hoàn tiền
          </Button>
        )}
      </div>
    </div>
  );
}


