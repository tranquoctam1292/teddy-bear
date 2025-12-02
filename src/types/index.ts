// Định nghĩa kiểu dữ liệu (Product, Variant, CartItem)

export type Variant = {
  id: string;
  size: string;      // e.g., "1m2"
  price: number;     // e.g., 350000
  stock: number;
  image?: string;    // Specific image for this size
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;     // e.g., "Teddy", "Cartoon"
  tags: string[];       // e.g., "Birthday", "Best Seller"
  basePrice: number;    // Lowest price for display
  maxPrice?: number;    // Highest price for display range
  images: string[];     // Main gallery
  variants: Variant[];  // Array of size/price options
  isHot: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string; // Specific size selected
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

// Upsell Services Types
export type UpsellService = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type UpsellServices = {
  vacuumSealing: boolean;  // Free
  giftWrapping: boolean;   // Paid (+30,000 VND)
  expressShipping: boolean; // Conditional
};

// Checkout Types
export type ShippingInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
};

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';

export type Order = {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  upsellTotal: number;
  shippingFee: number;
  total: number;
  upsellServices: UpsellServices;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
};

