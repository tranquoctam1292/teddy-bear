// Marketing Types
export interface Coupon {
  _id?: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: Date;
  validTo: Date;
  status: 'active' | 'inactive' | 'expired';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponUsage {
  couponId: string;
  orderId: string;
  userId?: string;
  discountAmount: number;
  usedAt: Date;
}

export interface EmailCampaign {
  _id?: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[] | any; // Array of emails or segment criteria
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: Date;
  sentAt?: Date;
  openRate?: number;
  clickRate?: number;
  totalSent?: number;
  totalOpened?: number;
  totalClicked?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  _id?: string;
  name: string;
  type: 'email' | 'social' | 'ads';
  status: 'active' | 'paused' | 'completed';
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  _id?: string;
  name: string;
  type: 'flash_sale' | 'bundle' | 'free_shipping' | 'loyalty';
  productIds?: string[];
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  conditions?: any;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export const COUPON_TYPES = [
  { value: 'percentage', label: 'Giảm theo %', icon: '%' },
  { value: 'fixed_amount', label: 'Giảm cố định', icon: '₫' },
  { value: 'free_shipping', label: 'Freeship', icon: '🚚' },
];




