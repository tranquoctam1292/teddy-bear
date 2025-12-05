/**
 * Unit Tests: Product Zod Schema Validation
 * 
 * Test cases để đảm bảo Zod Schema validate đúng dữ liệu đầu vào
 * cho các fields mới trong Phase 1 upgrade.
 */

import { describe, it, expect } from 'vitest';
import {
  productSchema,
  variantSchema,
  variantDimensionsSchema,
  productDimensionsSchema,
  comboProductItemSchema,
} from './product';

describe('Product Schema Validation', () => {
  // ========================================
  // VALID DATA TESTS
  // ========================================

  describe('Valid Data - Full Product với tất cả fields mới', () => {
    it('should accept product với đầy đủ các trường mới', () => {
      const validProduct = {
        name: 'Gấu Bông Teddy Cổ Điển',
        slug: 'gau-bong-teddy-co-dien',
        description: '<p>Mô tả chi tiết sản phẩm</p>',
        category: 'teddy',
        tags: ['Best Seller', 'Valentine'],
        images: ['https://example.com/image1.jpg'],
        variants: [
          {
            id: 'variant-1',
            size: '80cm',
            color: 'Nâu',
            colorCode: '#8B4513',
            price: 250000,
            stock: 100,
            image: 'https://example.com/variant1.jpg',
            weight: 500,
            dimensions: {
              length: 80,
              width: 50,
              height: 60,
            },
            isPopular: true,
          },
        ],
        isHot: true,
        isActive: true,
        // NEW: Chi tiết sản phẩm
        material: 'Bông gòn cao cấp, vải lông mềm',
        dimensions: {
          length: 80,
          width: 50,
          height: 60,
        },
        weight: 500,
        ageRange: '3+',
        careInstructions: '<p>Giặt tay, không dùng chất tẩy</p>',
        safetyInfo: '<p>An toàn cho trẻ em</p>',
        warranty: '6 tháng',
        // NEW: Tính năng quà tặng
        giftWrapping: true,
        giftWrappingOptions: ['Hộp giấy', 'Túi vải', 'Hộp cao cấp'],
        giftMessageEnabled: true,
        giftMessageTemplate: 'Chúc mừng sinh nhật!',
        specialOccasions: ['Valentine', 'Sinh nhật', '8/3'],
        // NEW: Media mở rộng
        videoUrl: 'https://www.youtube.com/watch?v=example',
        videoThumbnail: 'https://example.com/video-thumb.jpg',
        images360: [
          'https://example.com/360-1.jpg',
          'https://example.com/360-2.jpg',
        ],
        lifestyleImages: [
          'https://example.com/lifestyle-1.jpg',
          'https://example.com/lifestyle-2.jpg',
        ],
        // NEW: Bộ sưu tập & Combo
        collection: 'Teddy Classic',
        relatedProducts: ['product-1', 'product-2'],
        comboProducts: [
          {
            productId: 'product-1',
            productName: 'Gấu Bông Khác',
            discount: 10,
          },
        ],
        bundleDiscount: 15,
      };

      const result = productSchema.safeParse(validProduct);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Gấu Bông Teddy Cổ Điển');
        expect(result.data.giftWrapping).toBe(true);
        expect(result.data.videoUrl).toBe('https://www.youtube.com/watch?v=example');
        expect(result.data.collection).toBe('Teddy Classic');
      }
    });

    it('should accept product với minimal required fields', () => {
      const minimalProduct = {
        name: 'Gấu Bông Đơn Giản',
        slug: 'gau-bong-don-gian',
        description: 'Mô tả ngắn',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
      };

      const result = productSchema.safeParse(minimalProduct);

      expect(result.success).toBe(true);
      if (result.success) {
        // Kiểm tra default values
        expect(result.data.giftWrapping).toBe(false);
        expect(result.data.giftMessageEnabled).toBe(false);
        expect(result.data.images360).toEqual([]);
        expect(result.data.lifestyleImages).toEqual([]);
        expect(result.data.relatedProducts).toEqual([]);
      }
    });
  });

  // ========================================
  // INVALID DATA TESTS
  // ========================================

  describe('Invalid Data - Validation Errors', () => {
    it('should reject weight là số âm', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        weight: -100, // Invalid: số âm
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('weight');
        expect(result.error.issues[0]?.message).toContain('>= 0');
      }
    });

    it('should reject videoUrl không phải URL hợp lệ', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        videoUrl: 'not-a-valid-url', // Invalid: không phải URL
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('videoUrl');
        expect(result.error.issues[0]?.message).toContain('URL video không hợp lệ');
      }
    });

    it('should accept empty string cho videoUrl (optional)', () => {
      const productWithEmptyUrl = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        videoUrl: '', // Empty string should be allowed
      };

      const result = productSchema.safeParse(productWithEmptyUrl);

      expect(result.success).toBe(true);
    });

    it('should reject dimensions thiếu length', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        dimensions: {
          // Thiếu length
          width: 50,
          height: 60,
        },
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('dimensions');
        expect(result.error.issues[0]?.path).toContain('length');
      }
    });

    it('should reject dimensions thiếu width', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        dimensions: {
          length: 80,
          // Thiếu width
          height: 60,
        },
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('dimensions');
        expect(result.error.issues[0]?.path).toContain('width');
      }
    });

    it('should reject comboProducts có discount > 100', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        comboProducts: [
          {
            productId: 'product-1',
            productName: 'Test Combo',
            discount: 150, // Invalid: > 100
          },
        ],
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('comboProducts');
        expect(result.error.issues[0]?.path).toContain('discount');
        expect(result.error.issues[0]?.message).toContain('0-100%');
      }
    });

    it('should reject comboProducts có discount < 0', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        comboProducts: [
          {
            productId: 'product-1',
            productName: 'Test Combo',
            discount: -10, // Invalid: < 0
          },
        ],
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('comboProducts');
        expect(result.error.issues[0]?.path).toContain('discount');
      }
    });

    it('should reject bundleDiscount > 100', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        bundleDiscount: 150, // Invalid: > 100
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('bundleDiscount');
        expect(result.error.issues[0]?.message).toContain('0-100%');
      }
    });

    it('should reject images360 với URL không hợp lệ', () => {
      const invalidProduct = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        images360: ['not-a-valid-url'], // Invalid: không phải URL
      };

      const result = productSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('images360');
        expect(result.error.issues[0]?.message).toContain('URL ảnh 360 không hợp lệ');
      }
    });
  });

  // ========================================
  // OPTIONAL FIELDS TESTS
  // ========================================

  describe('Optional Fields - Có thể bỏ qua', () => {
    it('should accept product không có material', () => {
      const productWithoutMaterial = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        // Không có material
      };

      const result = productSchema.safeParse(productWithoutMaterial);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.material).toBeUndefined();
      }
    });

    it('should accept product không có giftWrapping (sẽ có default false)', () => {
      const productWithoutGiftWrapping = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        // Không có giftWrapping
      };

      const result = productSchema.safeParse(productWithoutGiftWrapping);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.giftWrapping).toBe(false); // Default value
      }
    });

    it('should accept product không có videoUrl', () => {
      const productWithoutVideo = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        // Không có videoUrl
      };

      const result = productSchema.safeParse(productWithoutVideo);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.videoUrl).toBeUndefined();
      }
    });

    it('should accept product không có collection', () => {
      const productWithoutCollection = {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        category: 'teddy',
        tags: [],
        images: ['https://example.com/image.jpg'],
        variants: [
          {
            size: '80cm',
            price: 200000,
            stock: 50,
          },
        ],
        isHot: false,
        isActive: true,
        // Không có collection
      };

      const result = productSchema.safeParse(productWithoutCollection);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.collection).toBeUndefined();
      }
    });
  });

  // ========================================
  // VARIANT SCHEMA TESTS
  // ========================================

  describe('Variant Schema Validation', () => {
    it('should accept variant với đầy đủ fields mới', () => {
      const validVariant = {
        id: 'variant-1',
        size: '80cm',
        color: 'Nâu',
        colorCode: '#8B4513',
        price: 250000,
        stock: 100,
        image: 'https://example.com/variant.jpg',
        weight: 500,
        dimensions: {
          length: 80,
          width: 50,
          height: 60,
        },
        isPopular: true,
      };

      const result = variantSchema.safeParse(validVariant);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBe('https://example.com/variant.jpg');
        expect(result.data.weight).toBe(500);
        expect(result.data.isPopular).toBe(true);
      }
    });

    it('should reject variant với weight < 0', () => {
      const invalidVariant = {
        size: '80cm',
        price: 250000,
        stock: 100,
        weight: -100, // Invalid
      };

      const result = variantSchema.safeParse(invalidVariant);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('weight');
      }
    });
  });

  // ========================================
  // DIMENSIONS SCHEMA TESTS
  // ========================================

  describe('Dimensions Schema Validation', () => {
    it('should accept valid dimensions', () => {
      const validDimensions = {
        length: 80,
        width: 50,
        height: 60,
      };

      const result = productDimensionsSchema.safeParse(validDimensions);

      expect(result.success).toBe(true);
    });

    it('should reject dimensions với length < 0', () => {
      const invalidDimensions = {
        length: -10,
        width: 50,
        height: 60,
      };

      const result = productDimensionsSchema.safeParse(invalidDimensions);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('length');
      }
    });
  });

  // ========================================
  // COMBO PRODUCT SCHEMA TESTS
  // ========================================

  describe('Combo Product Schema Validation', () => {
    it('should accept valid combo product', () => {
      const validCombo = {
        productId: 'product-1',
        productName: 'Gấu Bông Khác',
        discount: 10,
      };

      const result = comboProductItemSchema.safeParse(validCombo);

      expect(result.success).toBe(true);
    });

    it('should reject combo product thiếu productId', () => {
      const invalidCombo = {
        // Thiếu productId
        productName: 'Gấu Bông Khác',
        discount: 10,
      };

      const result = comboProductItemSchema.safeParse(invalidCombo);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('productId');
      }
    });

    it('should reject combo product có discount > 100', () => {
      const invalidCombo = {
        productId: 'product-1',
        productName: 'Gấu Bông Khác',
        discount: 150, // Invalid
      };

      const result = comboProductItemSchema.safeParse(invalidCombo);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('discount');
      }
    });
  });
});

