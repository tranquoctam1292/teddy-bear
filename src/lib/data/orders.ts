// Shared Mock Orders Data
// In production, replace with MongoDB queries
import type { Order } from '@/lib/schemas/order';

export const mockOrders: Order[] = [
  // Sample order for testing
  {
    orderId: 'ORD-20250102-0001',
    guestEmail: 'customer@example.com',
    items: [
      {
        productId: '1',
        variantId: 'v1-1',
        name: 'Gấu Bông Teddy Cổ Điển',
        size: '80cm',
        price: 250000,
        quantity: 1,
        image: '/images/products/teddy-80cm.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'customer@example.com',
      address: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      note: 'Giao hàng vào buổi sáng',
    },
    shippingFee: 30000,
    shippingMethod: 'standard',
    upsellServices: {
      vacuumSealing: false,
      isGiftWrapped: true,
      giftWrapFee: 30000,
      expressShipping: false,
    },
    subtotal: 250000,
    upsellTotal: 30000,
    shippingTotal: 30000,
    total: 310000,
    paymentDetails: {
      method: 'cod',
      status: 'pending',
      amount: 310000,
    },
    orderStatus: 'pending',
    createdAt: new Date('2025-01-02T10:00:00'),
    updatedAt: new Date('2025-01-02T10:00:00'),
  },
  {
    orderId: 'ORD-20250102-0002',
    guestEmail: 'customer2@example.com',
    items: [
      {
        productId: '2',
        variantId: 'v2-2',
        name: 'Gấu Bông Capybara Siêu Dễ Thương',
        size: '1m2',
        price: 380000,
        quantity: 2,
        image: '/images/products/capybara-1.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Trần Thị B',
      phone: '0907654321',
      email: 'customer2@example.com',
      address: '456 Đường XYZ',
      ward: 'Phường 2',
      district: 'Quận 2',
      city: 'TP. Hồ Chí Minh',
    },
    shippingFee: 30000,
    shippingMethod: 'standard',
    upsellServices: {
      vacuumSealing: true,
      isGiftWrapped: false,
      giftWrapFee: 0,
      expressShipping: false,
    },
    subtotal: 760000,
    upsellTotal: 0,
    shippingTotal: 30000,
    total: 790000,
    paymentDetails: {
      method: 'bank_transfer',
      status: 'completed',
      amount: 790000,
      paidAt: new Date('2025-01-02T11:00:00'),
    },
    orderStatus: 'confirmed',
    createdAt: new Date('2025-01-02T11:00:00'),
    updatedAt: new Date('2025-01-02T11:00:00'),
  },
];


