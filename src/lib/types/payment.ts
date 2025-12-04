// Payment & Transaction Types for MongoDB
export interface Transaction {
  _id?: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string; // vnpay, momo, paypal, stripe, cod
  gatewayTxnId?: string;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionWithOrder extends Transaction {
  order?: {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
  };
}

export interface TransactionFilter {
  status?: 'all' | 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface TransactionStats {
  all: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  totalRevenue: number;
  totalRefunded: number;
}

export interface PaymentGateway {
  _id?: string;
  name: string; // vnpay, momo, paypal, stripe, cod
  displayName: string;
  enabled: boolean;
  testMode: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
    webhookSecret?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

export const PAYMENT_GATEWAYS = [
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Cổng thanh toán VNPay',
    icon: '🏦',
    fields: ['tmnCode', 'hashSecret'],
  },
  {
    id: 'momo',
    name: 'MoMo',
    description: 'Ví điện tử MoMo',
    icon: '📱',
    fields: ['partnerCode', 'accessKey', 'secretKey'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Thanh toán quốc tế PayPal',
    icon: '💳',
    fields: ['clientId', 'clientSecret'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Stripe Payment Gateway',
    icon: '💰',
    fields: ['publicKey', 'secretKey', 'webhookSecret'],
  },
  {
    id: 'cod',
    name: 'COD',
    description: 'Thanh toán khi nhận hàng',
    icon: '💵',
    fields: [],
  },
];


