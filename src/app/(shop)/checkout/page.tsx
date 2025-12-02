'use client';

// Trang thanh toán với form đầy đủ
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import type { ShippingInfo, PaymentMethod } from '@/types';
import { CreditCard, Truck, MapPin, User, Phone, Mail, FileText, Lock } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import UpsellServices from '@/components/cart/UpsellServices';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    upsellServices,
    getSubtotal,
    getUpsellTotal,
    getShippingFee,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const subtotal = getSubtotal();
  const upsellTotal = getUpsellTotal();
  const shippingFee = getShippingFee();
  const total = getTotalPrice();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    if (!shippingInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã';
    }
    if (!shippingInfo.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'Vui lòng nhập thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestEmail: shippingInfo.email,
          items,
          shippingAddress: shippingInfo,
          shippingMethod: upsellServices.expressShipping ? 'express' : 'standard',
          upsellServices: {
            vacuumSealing: upsellServices.vacuumSealing,
            isGiftWrapped: upsellServices.giftWrapping,
            giftWrapFee: upsellServices.giftWrapping ? 30000 : 0,
            expressShipping: upsellServices.expressShipping,
          },
          paymentDetails: {
            method: paymentMethod,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi xử lý đơn hàng');
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${data.data.orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ShippingInfo,
    value: string
  ) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất thông tin để đặt hàng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Truck className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0901234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Địa chỉ cụ thể *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Phường 1"
                    />
                    {errors.ward && (
                      <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quận 1"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="TP. Hồ Chí Minh"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Note */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={shippingInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Lưu ý cho người giao hàng..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💰' },
                    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                    { value: 'momo', label: 'Ví MoMo', icon: '💳' },
                    { value: 'vnpay', label: 'VNPay', icon: '💳' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.value
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cart Items Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sản phẩm đã chọn ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </div>
              </div>

              {/* Upsell Services */}
              <UpsellServices />
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-pink-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {upsellTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Dịch vụ bổ sung</span>
                      <span>{formatCurrency(upsellTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold text-pink-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Đặt hàng
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc đặt hàng, bạn đồng ý với{' '}
                  <a href="/terms" className="text-pink-600 hover:underline">
                    Điều khoản sử dụng
                  </a>{' '}
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
