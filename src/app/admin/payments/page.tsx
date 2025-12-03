'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CreditCard, Download, DollarSign } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { TransactionWithOrder, TransactionStats } from '@/lib/types/payment';
import { StatusTabs } from '@/components/admin/list';
import {
  TransactionItem,
  RefundModal,
} from '@/components/admin/payments';

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionWithOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refundingTransaction, setRefundingTransaction] =
    useState<TransactionWithOrder | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionWithOrder | null>(null);

  // Stats
  const [stats, setStats] = useState<TransactionStats>({
    all: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
    totalRevenue: 0,
    totalRefunded: 0,
  });

  useEffect(() => {
    loadTransactions();
  }, [currentStatus, searchQuery, filterMethod, dateFrom, dateTo]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: currentStatus,
        search: searchQuery,
        limit: '100',
      });

      if (filterMethod) params.append('paymentMethod', filterMethod);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await fetch(`/api/admin/payments?${params}`);
      if (!response.ok) throw new Error('Failed to load transactions');

      const data = await response.json();
      setTransactions(data.transactions || []);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error('Error loading transactions:', error);
      alert('Không thể tải giao dịch!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (transaction: TransactionWithOrder) => {
    setSelectedTransaction(transaction);
    // TODO: Open details modal
  };

  const handleRefund = (transaction: TransactionWithOrder) => {
    setRefundingTransaction(transaction);
    setIsRefundModalOpen(true);
  };

  const handleSubmitRefund = async (
    transactionId: string,
    amount: number,
    reason: string
  ) => {
    try {
      const response = await fetch(
        `/api/admin/payments/${transactionId}/refund`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, reason }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert('Hoàn tiền thành công!');
      setIsRefundModalOpen(false);
      setRefundingTransaction(null);
      loadTransactions();
    } catch (error: any) {
      console.error('Refund error:', error);
      throw error;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const statusTabs = [
    { id: 'all', value: 'all', label: 'Tất cả', count: stats.all },
    { id: 'pending', value: 'pending', label: 'Đang chờ', count: stats.pending },
    { id: 'completed', value: 'completed', label: 'Thành công', count: stats.completed },
    { id: 'failed', value: 'failed', label: 'Thất bại', count: stats.failed },
    { id: 'refunded', value: 'refunded', label: 'Đã hoàn', count: stats.refunded },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-7 w-7" />
              Quản lý Giao dịch
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các giao dịch thanh toán
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadTransactions} variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tổng doanh thu</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Đã hoàn tiền</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(stats.totalRefunded)}
                </p>
              </div>
              <CreditCard className="h-12 w-12 text-purple-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Tổng giao dịch</p>
                <p className="text-3xl font-bold mt-1">{stats.all}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.completed} thành công
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-blue-100 text-xs">đang chờ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <StatusTabs
          tabs={statusTabs}
          currentStatus={currentStatus}
          baseUrl="/admin/payments"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="">Tất cả phương thức</option>
            <option value="vnpay">🏦 VNPay</option>
            <option value="momo">📱 MoMo</option>
            <option value="paypal">💳 PayPal</option>
            <option value="stripe">💰 Stripe</option>
            <option value="cod">💵 COD</option>
          </Select>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="Từ ngày"
          />

          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="Đến ngày"
          />

          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải giao dịch...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có giao dịch nào
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterMethod || dateFrom || dateTo
                ? 'Không tìm thấy giao dịch phù hợp'
                : 'Các giao dịch thanh toán sẽ hiển thị tại đây'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onViewDetails={handleViewDetails}
                onRefund={handleRefund}
              />
            ))}
          </div>
        )}
      </div>

      {/* Refund Modal */}
      <RefundModal
        transaction={refundingTransaction}
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setRefundingTransaction(null);
        }}
        onSubmit={handleSubmitRefund}
      />
    </div>
  );
}

