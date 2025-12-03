// WordPress-Style Admin Menu Configuration
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  MessageSquare,
  Image,
  FileText,
  MessageCircle,
  DollarSign,
  BarChart3,
  Megaphone,
  Search,
  Paintbrush,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface SubMenuItem {
  label: string;
  href: string;
  badge?: number;
  icon?: LucideIcon;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  badge?: number | 'pin';
  submenu?: SubMenuItem[];
  permissions?: string[];
}

export const ADMIN_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  
  {
    id: 'posts',
    icon: BookOpen,
    label: 'Bài viết',
    badge: 'pin',
    submenu: [
      { label: 'Tất cả bài viết', href: '/admin/posts' },
      { label: 'Thêm Bài Viết', href: '/admin/posts/new' },
      { label: 'Danh mục', href: '/admin/posts/categories' },
      { label: 'Thẻ', href: '/admin/posts/tags' },
    ],
  },
  
  {
    id: 'media',
    icon: Image,
    label: 'Media',
    submenu: [
      { label: 'Thư viện', href: '/admin/media' },
      { label: 'Thêm tệp tin Media', href: '/admin/media/upload' },
    ],
  },
  
  {
    id: 'pages',
    icon: FileText,
    label: 'Trang',
    submenu: [
      { label: 'Tất cả các trang', href: '/admin/pages' },
      { label: 'Thêm Trang', href: '/admin/pages/new' },
    ],
  },
  
  {
    id: 'products',
    icon: Package,
    label: 'Sản phẩm',
    submenu: [
      { label: 'Tất cả sản phẩm', href: '/admin/products' },
      { label: 'Thêm sản phẩm mới', href: '/admin/products/new' },
      { label: 'Thương hiệu', href: '/admin/products/brands' },
      { label: 'Danh mục', href: '/admin/settings/products' },
      { label: 'Thẻ', href: '/admin/products/tags' },
      { label: 'Các thuộc tính', href: '/admin/settings/products' },
      { label: 'Đánh giá', href: '/admin/products/reviews' },
    ],
  },
  
  {
    id: 'orders',
    icon: ShoppingCart,
    label: 'Đơn hàng',
    submenu: [
      { label: 'Tất cả đơn hàng', href: '/admin/orders' },
      { label: 'Đơn mới', href: '/admin/orders?status=pending', badge: 5 },
      { label: 'Đang xử lý', href: '/admin/orders?status=processing' },
      { label: 'Hoàn thành', href: '/admin/orders?status=completed' },
    ],
  },
  
  {
    id: 'messages',
    icon: MessageSquare,
    label: 'Tin nhắn',
    badge: 39,
    submenu: [
      { label: 'Hộp thư đến', href: '/admin/contacts', badge: 39 },
      { label: 'Đã trả lời', href: '/admin/contacts?status=replied' },
      { label: 'Lưu trữ', href: '/admin/contacts?status=archived' },
    ],
  },
  
  {
    id: 'comments',
    icon: MessageCircle,
    label: 'Bình luận',
    badge: 12,
    submenu: [
      { label: 'Tất cả bình luận', href: '/admin/comments' },
      { label: 'Chờ duyệt', href: '/admin/comments/pending', badge: 12 },
      { label: 'Đã duyệt', href: '/admin/comments/approved' },
      { label: 'Spam', href: '/admin/comments/spam' },
    ],
  },
  
  {
    id: 'payments',
    icon: DollarSign,
    label: 'Thanh toán',
    submenu: [
      { label: 'Giao dịch', href: '/admin/payments' },
      { label: 'Phương thức', href: '/admin/settings/orders' },
      { label: 'Cổng thanh toán', href: '/admin/payments/gateways' },
    ],
  },
  
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Phân tích',
    submenu: [
      { label: 'Tổng quan', href: '/admin/analytics' },
      { label: 'Báo cáo bán hàng', href: '/admin/analytics/sales' },
      { label: 'Khách hàng', href: '/admin/analytics/customers' },
      { label: 'Sản phẩm', href: '/admin/analytics/products' },
    ],
  },
  
  {
    id: 'marketing',
    icon: Megaphone,
    label: 'Tiếp thị',
    submenu: [
      { label: 'Chiến dịch', href: '/admin/marketing/campaigns' },
      { label: 'Email Marketing', href: '/admin/marketing/emails' },
      { label: 'Coupon', href: '/admin/marketing/coupons' },
      { label: 'Khuyến mãi', href: '/admin/marketing/promotions' },
    ],
  },
  
  {
    id: 'seo',
    icon: Search,
    label: 'SEO',
    submenu: [
      { label: 'Tổng quan', href: '/admin/seo' },
      { label: 'Từ khóa', href: '/admin/seo/keywords' },
      { label: 'Phân tích', href: '/admin/seo/analysis' },
      { label: 'Redirects', href: '/admin/seo/redirects' },
      { label: 'Sitemap', href: '/admin/seo/sitemap' },
    ],
  },
  
  {
    id: 'appearance',
    icon: Paintbrush,
    label: 'Giao diện',
    badge: 7,
    submenu: [
      { label: 'Thiết kế', href: '/admin/settings/appearance' },
      { label: 'Tùy chỉnh', href: '/admin/appearance/customize' },
      { label: 'Tiện ích', href: '/admin/appearance/widgets' },
      { label: 'Menu', href: '/admin/settings/navigation' },
      { label: 'Nền', href: '/admin/appearance/background' },
      { label: 'Sửa tập tin giao diện', href: '/admin/appearance/editor' },
    ],
  },
  
  {
    id: 'settings',
    icon: Settings,
    label: 'Cài đặt',
    submenu: [
      { label: 'Chung', href: '/admin/settings' },
      { label: 'Sản phẩm', href: '/admin/settings/products' },
      { label: 'Đơn hàng', href: '/admin/settings/orders' },
      { label: 'Bảo mật', href: '/admin/settings/security' },
      { label: 'Email (SMTP)', href: '/admin/settings/smtp' },
      { label: 'Thông báo', href: '/admin/settings/notifications' },
    ],
  },
];

