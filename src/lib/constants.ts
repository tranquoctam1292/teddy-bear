// Lưu các biến cố định (Danh sách Category, Phí ship, Filter options)

// Categories
export const CATEGORIES = [
  { value: 'teddy', label: 'Teddy' },
  { value: 'capybara', label: 'Capybara' },
  { value: 'lotso', label: 'Lotso' },
  { value: 'kuromi', label: 'Kuromi' },
  { value: 'cartoon', label: 'Cartoon' },
] as const;

// Size Options
export const SIZES = [
  { value: 'mini', label: 'Mini' },
  { value: 'bigsize', label: 'Bigsize' },
] as const;

// Occasion Tags
export const OCCASIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'anniversary', label: 'Kỷ niệm' },
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { value: '0-100000', label: 'Dưới 100.000đ', min: 0, max: 100000 },
  { value: '100000-500000', label: '100.000đ - 500.000đ', min: 100000, max: 500000 },
  { value: '500000-1000000', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
  { value: '1000000+', label: 'Trên 1.000.000đ', min: 1000000, max: Infinity },
] as const;

// Shipping Fees
export const SHIPPING_FEE = 30000; // VND - Standard shipping
export const EXPRESS_SHIPPING_FEE = 50000; // VND - Express shipping
export const GIFT_WRAPPING_FEE = 30000; // VND

// Upsell Services
export const UPSELL_SERVICES = {
  VACUUM_SEALING: {
    id: 'vacuum-sealing',
    name: 'Hút chân không',
    price: 0,
    description: 'Giúp giảm kích thước vận chuyển',
  },
  GIFT_WRAPPING: {
    id: 'gift-wrapping',
    name: 'Gói quà & Thiệp',
    price: GIFT_WRAPPING_FEE,
    description: 'Gói quà đẹp và kèm thiệp chúc mừng',
  },
  EXPRESS_SHIPPING: {
    id: 'express-shipping',
    name: 'Giao hàng nhanh',
    price: EXPRESS_SHIPPING_FEE,
    description: 'Giao hàng trong 24h',
  },
} as const;

