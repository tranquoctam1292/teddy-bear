// Shared Mock Navigation Menus Data
// In production, replace with MongoDB queries
import type { NavigationMenu } from '@/lib/schemas/navigation';
import { MENU_LOCATIONS } from '@/lib/schemas/navigation';

export const mockMenus: NavigationMenu[] = [
  {
    id: 'menu-main-header',
    location: MENU_LOCATIONS.MAIN_HEADER,
    name: 'Main Shop Navigation',
    isActive: true,
    items: [
      {
        id: 'nav-home',
        label: 'Trang chủ',
        url: '/',
        type: 'internal_page',
        order: 1,
      },
      {
        id: 'nav-products',
        label: 'Sản phẩm',
        url: '/products',
        type: 'internal_page',
        order: 2,
        children: [
          {
            id: 'nav-products-teddy',
            label: 'Gấu Teddy',
            url: '/products?category=teddy',
            type: 'category',
            order: 1,
          },
          {
            id: 'nav-products-capybara',
            label: 'Capybara',
            url: '/products?category=capybara',
            type: 'category',
            order: 2,
          },
          {
            id: 'nav-products-all',
            label: 'Tất cả sản phẩm',
            url: '/products',
            type: 'internal_page',
            order: 3,
          },
        ],
      },
      {
        id: 'nav-blog',
        label: 'Góc của Gấu',
        url: '/blog',
        type: 'internal_page',
        order: 3,
      },
      {
        id: 'nav-about',
        label: 'Về chúng tôi',
        url: '/about',
        type: 'internal_page',
        order: 4,
      },
      {
        id: 'nav-store',
        label: 'Cửa hàng',
        url: '/store',
        type: 'internal_page',
        order: 5,
      },
    ],
    createdAt: new Date('2025-01-01T00:00:00'),
    updatedAt: new Date('2025-01-01T00:00:00'),
  },
  {
    id: 'menu-footer-sitemap',
    location: MENU_LOCATIONS.FOOTER_SITEMAP,
    name: 'Footer Sitemap',
    isActive: true,
    items: [
      {
        id: 'footer-products',
        label: 'Sản phẩm',
        url: '/products',
        type: 'internal_page',
        order: 1,
      },
      {
        id: 'footer-blog',
        label: 'Góc của Gấu',
        url: '/blog',
        type: 'internal_page',
        order: 2,
      },
      {
        id: 'footer-about',
        label: 'Về chúng tôi',
        url: '/about',
        type: 'internal_page',
        order: 3,
      },
    ],
    createdAt: new Date('2025-01-01T00:00:00'),
    updatedAt: new Date('2025-01-01T00:00:00'),
  },
];


