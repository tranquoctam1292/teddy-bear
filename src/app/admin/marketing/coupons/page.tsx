'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Ticket, Trash2, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Select } from '@/components/admin/ui/select';
import { Coupon, COUPON_TYPES } from '@/lib/types/marketing';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/ui/dialog';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as any,
    value: 0,
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    loadCoupons();
  }, [filterStatus, searchQuery]);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ status: filterStatus, search: searchQuery });
      const response = await fetch(`/api/admin/marketing/coupons?${params}`);
      if (!response.ok) throw new Error('Failed to load');
      
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải coupons!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon 
        ? `/api/admin/marketing/coupons/${editingCoupon._id}`
        : '/api/admin/marketing/coupons';
      
      const response = await fetch(url, {
        method: editingCoupon ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert(editingCoupon ? 'Cập nhật thành công!' : 'Tạo coupon thành công!');
      setIsFormOpen(false);
      setEditingCoupon(null);
      resetForm();
      loadCoupons();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa coupon này?')) return;

    try {
      const response = await fetch(`/api/admin/marketing/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      loadCoupons();
    } catch (error) {
      alert('Không thể xóa!');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      perUserLimit: coupon.perUserLimit?.toString() || '',
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validTo: new Date(coupon.validTo).toISOString().split('T')[0],
      description: coupon.description || '',
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      perUserLimit: '',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: '',
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Đã copy mã coupon!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      expired: 'bg-red-100 text-red-700',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Ticket className="h-7 w-7" />
              Quản lý Coupons
            </h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý mã giảm giá</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadCoupons} variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo coupon mới
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-48">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm dừng</option>
            <option value="expired">Hết hạn</option>
          </Select>
          <Input
            type="search"
            placeholder="Tìm mã coupon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Coupons List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có coupon nào</h3>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Tạo coupon đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                      {coupon.code}
                    </code>
                    <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-gray-600">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(coupon.status)}`}>
                    {coupon.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giảm:</span>
                  <span className="font-bold text-green-600">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                  </span>
                </div>
                {coupon.minPurchase && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Đơn tối thiểu:</span>
                    <span>{formatCurrency(coupon.minPurchase)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Đã sử dụng:</span>
                  <span>{coupon.usageCount} / {coupon.usageLimit || '∞'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Từ: {new Date(coupon.validFrom).toLocaleDateString('vi-VN')}</p>
                  <p>Đến: {new Date(coupon.validTo).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleEdit(coupon)} size="sm" variant="secondary" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button onClick={() => handleDelete(coupon._id || '')} size="sm" variant="secondary" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Chỉnh sửa coupon' : 'Tạo coupon mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mã coupon *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  required
                  className="mt-1 uppercase"
                />
              </div>
              <div>
                <Label>Loại giảm giá *</Label>
                <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="mt-1">
                  {COUPON_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giá trị giảm *</Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="any"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Đơn hàng tối thiểu</Label>
                <Input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giới hạn sử dụng</Label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="mt-1"
                  placeholder="Không giới hạn"
                />
              </div>
              <div>
                <Label>Giới hạn / khách hàng</Label>
                <Input
                  type="number"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                  className="mt-1"
                  placeholder="Không giới hạn"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu *</Label>
                <Input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Ngày kết thúc *</Label>
                <Input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Mô tả</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg mt-1"
                placeholder="Mô tả ngắn về coupon..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" onClick={() => { setIsFormOpen(false); resetForm(); }} variant="secondary">
                Hủy
              </Button>
              <Button type="submit">
                {editingCoupon ? 'Cập nhật' : 'Tạo coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}



