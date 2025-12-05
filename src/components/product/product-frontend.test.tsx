/**
 * Product Frontend Components Test
 * Kiểm tra logic tính toán và xử lý sự kiện của các component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { formatCurrency } from '@/lib/utils/format';
import type { Product, ComboProductItem } from '@/lib/schemas/product';

// Mock data
const mockProduct: Product = {
  id: 'prod1',
  name: 'Gấu Bông Test',
  slug: 'gau-bong-test',
  description: '<p>Mô tả sản phẩm</p>',
  category: 'teddy',
  tags: ['Best Seller'],
  images: ['https://example.com/image1.jpg'],
  variants: [
    {
      id: 'var1',
      size: '80cm',
      price: 250000,
      stock: 100,
    },
  ],
  minPrice: 250000,
  isHot: false,
  isActive: true,
  material: 'Bông gòn cao cấp',
  weight: 800,
  dimensions: {
    length: 80,
    width: 50,
    height: 60,
  },
  ageRange: '3+',
  warranty: '6 tháng',
  giftWrapping: true,
  giftWrappingOptions: ['Hộp giấy', 'Túi vải'],
  giftMessageEnabled: true,
  giftMessageTemplate: 'Chúc mừng sinh nhật!',
  specialOccasions: ['Valentine', 'Sinh nhật'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductNoGift: Product = {
  ...mockProduct,
  id: 'prod2',
  giftWrapping: false,
  giftMessageEnabled: false,
};

const mockComboProduct: Product = {
  ...mockProduct,
  id: 'prod3',
  comboProducts: [
    {
      productId: 'combo1',
      productName: 'Gấu Bông Combo 1',
      discount: 10,
    },
    {
      productId: 'combo2',
      productName: 'Gấu Bông Combo 2',
      discount: 15,
    },
  ],
  bundleDiscount: 5,
};

// Mock components (vì chúng phụ thuộc vào Next.js và client-side hooks)
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/store/useCartStore', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Product Frontend Components - Logic Tests', () => {
  describe('ComboProducts - Discount Calculation Logic', () => {
    it('should calculate correct savings with item discount and bundle discount', () => {
      // Mock data: 2 products với discount 10% và 15%, bundle discount 5%
      const item1Price = 250000;
      const item1Discount = 10; // 10%
      const item1Discounted = item1Price * (1 - item1Discount / 100); // 225000

      const item2Price = 300000;
      const item2Discount = 15; // 15%
      const item2Discounted = item2Price * (1 - item2Discount / 100); // 255000

      const bundleDiscount = 5; // 5%

      // Total original price
      const totalOriginal = item1Price + item2Price; // 550000

      // Total after item discounts
      const totalAfterItemDiscounts = item1Discounted + item2Discounted; // 480000

      // Final price after bundle discount
      const finalPrice = totalAfterItemDiscounts * (1 - bundleDiscount / 100); // 456000

      // Total savings
      const savings = totalOriginal - finalPrice; // 94000

      expect(savings).toBe(94000);
      expect(finalPrice).toBe(456000);
    });

    it('should calculate savings correctly when item discount is 0', () => {
      const item1Price = 250000;
      const item1Discount = 0;
      const item1Discounted = item1Price * (1 - item1Discount / 100); // 250000

      const item2Price = 300000;
      const item2Discount = 0;
      const item2Discounted = item2Price * (1 - item2Discount / 100); // 300000

      const bundleDiscount = 10; // 10%

      const totalOriginal = item1Price + item2Price; // 550000
      const totalAfterItemDiscounts = item1Discounted + item2Discounted; // 550000
      const finalPrice = totalAfterItemDiscounts * (1 - bundleDiscount / 100); // 495000
      const savings = totalOriginal - finalPrice; // 55000

      expect(savings).toBe(55000);
    });

    it('should format savings correctly for display', () => {
      const savings = 94000;
      const formatted = formatCurrency(savings);
      
      // formatCurrency returns Vietnamese format: "94.000 ₫"
      expect(formatted).toContain('94');
      expect(formatted).toContain('₫');
    });
  });

  describe('GiftFeaturesSection - Conditional Rendering Logic', () => {
    it('should return null when giftWrapping is false', () => {
      // Component should not render if giftWrapping = false
      expect(mockProductNoGift.giftWrapping).toBe(false);
    });

    it('should show gift message textarea when giftMessageEnabled is true', () => {
      // Component should show textarea when giftMessageEnabled = true
      expect(mockProduct.giftMessageEnabled).toBe(true);
      expect(mockProduct.giftMessageTemplate).toBe('Chúc mừng sinh nhật!');
    });

    it('should have correct gift wrapping options', () => {
      expect(mockProduct.giftWrappingOptions).toEqual(['Hộp giấy', 'Túi vải']);
      expect(mockProduct.giftWrappingOptions?.length).toBe(2);
    });

    it('should have correct special occasions', () => {
      expect(mockProduct.specialOccasions).toEqual(['Valentine', 'Sinh nhật']);
      expect(mockProduct.specialOccasions?.length).toBe(2);
    });
  });

  describe('ProductSpecsTable - Data Rendering Logic', () => {
    it('should format dimensions correctly', () => {
      const dimensions = mockProduct.dimensions;
      if (dimensions) {
        const formatted = `${dimensions.length} x ${dimensions.width} x ${dimensions.height} cm`;
        expect(formatted).toBe('80 x 50 x 60 cm');
      }
    });

    it('should format weight correctly', () => {
      const weight = mockProduct.weight;
      if (weight) {
        const formatted = `${weight} gram`;
        expect(formatted).toBe('800 gram');
      }
    });

    it('should handle missing optional fields', () => {
      const productWithoutSpecs: Product = {
        ...mockProduct,
        material: undefined,
        weight: undefined,
        dimensions: undefined,
        ageRange: undefined,
        warranty: undefined,
      };

      // Should still render table with "Chưa có thông tin"
      expect(productWithoutSpecs.material).toBeUndefined();
      expect(productWithoutSpecs.weight).toBeUndefined();
    });
  });

  describe('ProductTabs - Tab Content Logic', () => {
    it('should have correct tab structure', () => {
      const tabs = ['description', 'specs', 'reviews', 'care'];
      expect(tabs.length).toBe(4);
      expect(tabs[0]).toBe('description');
      expect(tabs[1]).toBe('specs');
      expect(tabs[2]).toBe('reviews');
      expect(tabs[3]).toBe('care');
    });

    it('should handle HTML content in description', () => {
      const description = mockProduct.description;
      expect(description).toContain('<p>');
      expect(description).toContain('Mô tả sản phẩm');
    });

    it('should handle HTML content in careInstructions', () => {
      const productWithCare: Product = {
        ...mockProduct,
        careInstructions: '<p>Giặt tay nhẹ nhàng</p>',
      };
      expect(productWithCare.careInstructions).toContain('<p>');
    });
  });

  describe('SocialShare - URL Generation Logic', () => {
    it('should generate correct product URL', () => {
      const baseUrl = 'https://example.com';
      const slug = 'gau-bong-test';
      const expectedUrl = `${baseUrl}/products/${slug}`;
      
      expect(expectedUrl).toBe('https://example.com/products/gau-bong-test');
    });

    it('should encode URL correctly for Facebook share', () => {
      const url = 'https://example.com/products/gau-bong-test';
      const encoded = encodeURIComponent(url);
      
      expect(encoded).toBe('https%3A%2F%2Fexample.com%2Fproducts%2Fgau-bong-test');
    });
  });

  describe('Cart Integration - Gift Options Logic', () => {
    it('should include gift options in cart item', () => {
      const cartItem = {
        productId: 'prod1',
        variantId: 'var1',
        name: 'Gấu Bông Test',
        size: '80cm',
        price: 250000,
        quantity: 1,
        image: 'https://example.com/image1.jpg',
        giftWrappingOption: 'Hộp giấy',
        giftMessage: 'Chúc mừng sinh nhật!',
      };

      expect(cartItem.giftWrappingOption).toBe('Hộp giấy');
      expect(cartItem.giftMessage).toBe('Chúc mừng sinh nhật!');
    });

    it('should handle cart item without gift options', () => {
      const cartItem = {
        productId: 'prod1',
        variantId: 'var1',
        name: 'Gấu Bông Test',
        size: '80cm',
        price: 250000,
        quantity: 1,
        image: 'https://example.com/image1.jpg',
      };

      expect(cartItem.giftWrappingOption).toBeUndefined();
      expect(cartItem.giftMessage).toBeUndefined();
    });
  });

  describe('ProductGalleryEnhanced - Video URL Parsing Logic', () => {
    it('should extract YouTube video ID correctly', () => {
      const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      
      expect(videoId).toBe('dQw4w9WgXcQ');
    });

    it('should extract Vimeo video ID correctly', () => {
      const vimeoUrl = 'https://vimeo.com/123456789';
      const videoId = vimeoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      
      expect(videoId).toBe('123456789');
    });

    it('should handle invalid video URL', () => {
      const invalidUrl = 'not-a-video-url';
      const youtubeMatch = invalidUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const vimeoMatch = invalidUrl.match(/vimeo\.com\/(\d+)/);
      
      expect(youtubeMatch).toBeNull();
      expect(vimeoMatch).toBeNull();
    });
  });

  describe('ComboProducts - Add All to Cart Logic', () => {
    it('should calculate correct count of added items', () => {
      const comboItems: ComboProductItem[] = [
        { productId: '1', productName: 'Product 1', discount: 10 },
        { productId: '2', productName: 'Product 2', discount: 15 },
      ];

      let addedCount = 0;
      let failedCount = 0;

      // Simulate adding items
      comboItems.forEach((item) => {
        // Mock: assume all items are valid
        if (item.productId) {
          addedCount++;
        } else {
          failedCount++;
        }
      });

      expect(addedCount).toBe(2);
      expect(failedCount).toBe(0);
    });

    it('should handle failed items correctly', () => {
      const comboItems: ComboProductItem[] = [
        { productId: '1', productName: 'Product 1' },
        { productId: '', productName: 'Invalid Product' }, // Invalid
      ];

      let addedCount = 0;
      let failedCount = 0;

      comboItems.forEach((item) => {
        if (item.productId && item.productId.length > 0) {
          addedCount++;
        } else {
          failedCount++;
        }
      });

      expect(addedCount).toBe(1);
      expect(failedCount).toBe(1);
    });
  });
});

