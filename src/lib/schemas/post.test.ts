/**
 * Unit Tests: Post Zod Schema Validation
 *
 * Test cases để đảm bảo Zod Schema validate đúng dữ liệu đầu vào
 * cho các fields mới trong Phase 1 Blog Upgrade.
 */

import { describe, it, expect } from 'vitest';
import {
  postSchema,
  postUpdateSchema,
  linkedProductSchema,
  postVideoSchema,
  comparisonTableSchema,
  postTemplateSchema,
  type PostFormData,
} from './post';

describe('Post Schema Validation', () => {
  // ========================================
  // TEST CASE 1: Valid Full Payload
  // ========================================

  describe('Test Case 1: Valid Full Payload với đầy đủ fields mới', () => {
    it('should accept post với template, linkedProducts, templateData, videos hợp lệ', () => {
      const validPost: PostFormData = {
        title: 'Đánh giá Gấu Bông Teddy - Sản phẩm tốt nhất 2025',
        slug: 'danh-gia-gau-bong-teddy-2025',
        content: '<p>Nội dung bài viết đánh giá chi tiết...</p>',
        status: 'published',
        excerpt: 'Bài viết đánh giá chi tiết về gấu bông teddy',
        metaTitle: 'Đánh giá Gấu Bông Teddy 2025',
        metaDescription: 'Đánh giá chi tiết về gấu bông teddy chất lượng cao',
        keywords: ['gấu bông', 'teddy', 'đánh giá'],
        featuredImage: 'https://example.com/featured.jpg',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        category: 'review',
        tags: ['review', 'teddy', 'gấu bông'],
        publishedAt: new Date('2025-12-05'),
        author: 'The Emotional House',
        views: 100,
        likes: 25,

        // 🆕 New fields (Phase 1)
        template: 'review',
        linkedProducts: [
          {
            productId: 'product-123',
            position: 'inline',
            displayType: 'card',
            customMessage: 'Sản phẩm được đề xuất',
          },
          {
            productId: 'product-456',
            position: 'bottom',
            displayType: 'spotlight',
          },
        ],
        templateData: {
          pros: ['Chất lượng tốt', 'Giá hợp lý', 'Bền đẹp'],
          cons: ['Màu sắc hạn chế'],
          rating: 4.5,
          comparisonProducts: ['product-123', 'product-456'],
        },
        readingTime: 5,
        tableOfContents: [
          {
            id: 'heading-1',
            text: 'Giới thiệu',
            level: 2,
            anchor: '#gioi-thieu',
          },
          {
            id: 'heading-2',
            text: 'Đánh giá chi tiết',
            level: 2,
            anchor: '#danh-gia-chi-tiet',
          },
        ],
        videos: [
          {
            url: 'https://www.youtube.com/watch?v=example123',
            type: 'youtube',
            thumbnail: 'https://example.com/thumb.jpg',
            transcript: 'Transcript của video...',
          },
          {
            url: 'https://vimeo.com/123456789',
            type: 'vimeo',
          },
        ],
        comparisonTable: {
          products: ['product-123', 'product-456', 'product-789'],
          features: [
            {
              name: 'Kích thước',
              values: {
                'product-123': '80cm',
                'product-456': '1m2',
                'product-789': '1m5',
              },
            },
            {
              name: 'Giá',
              values: {
                'product-123': 250000,
                'product-456': 350000,
                'product-789': 450000,
              },
            },
            {
              name: 'Chất liệu',
              values: {
                'product-123': 'Bông gòn',
                'product-456': 'Bông gòn',
                'product-789': 'Bông gòn cao cấp',
              },
            },
          ],
          displayOptions: {
            showImages: true,
            showPrices: true,
            highlightBest: true,
          },
        },
        seo: {
          canonicalUrl: 'https://emotionalhouse.vn/blog/danh-gia-gau-bong-teddy-2025',
          robots: 'index, follow',
          focusKeyword: 'gấu bông teddy',
          altText: 'Gấu bông teddy chất lượng cao',
        },
      };

      const result = postSchema.safeParse(validPost);

      expect(result.success).toBe(true);
      if (result.success) {
        // Verify new fields
        expect(result.data.template).toBe('review');
        expect(result.data.linkedProducts).toHaveLength(2);
        expect(result.data.linkedProducts?.[0]?.productId).toBe('product-123');
        expect(result.data.templateData).toBeDefined();
        expect(result.data.templateData?.rating).toBe(4.5);
        expect(result.data.readingTime).toBe(5);
        expect(result.data.tableOfContents).toHaveLength(2);
        expect(result.data.videos).toHaveLength(2);
        expect(result.data.videos?.[0]?.type).toBe('youtube');
        expect(result.data.comparisonTable?.products).toHaveLength(3);
        expect(result.data.comparisonTable?.features).toHaveLength(3);
      }
    });
  });

  // ========================================
  // TEST CASE 2: Invalid Template
  // ========================================

  describe('Test Case 2: Invalid Template', () => {
    it('should reject template với giá trị không hợp lệ', () => {
      const invalidPost = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        template: 'invalid-type', // ❌ Invalid
      };

      const result = postSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
        const templateError = result.error.errors.find(
          (err) => err.path.includes('template') || err.message.includes('template')
        );
        expect(templateError).toBeDefined();
      }
    });

    it('should accept các template hợp lệ', () => {
      const validTemplates: Array<'default' | 'gift-guide' | 'review' | 'care-guide' | 'story'> = [
        'default',
        'gift-guide',
        'review',
        'care-guide',
        'story',
      ];

      validTemplates.forEach((template) => {
        const post = {
          title: 'Bài viết test',
          slug: 'bai-viet-test',
          content: '<p>Nội dung</p>',
          status: 'draft',
          template,
        };

        const result = postSchema.safeParse(post);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.template).toBe(template);
        }
      });
    });
  });

  // ========================================
  // TEST CASE 3: Invalid Linked Product
  // ========================================

  describe('Test Case 3: Invalid Linked Product', () => {
    it('should reject linkedProducts thiếu productId', () => {
      const invalidPost = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        linkedProducts: [
          {
            // ❌ Missing productId
            position: 'inline',
            displayType: 'card',
          },
        ],
      };

      const result = postSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Tìm error trong linkedProducts array
        // Zod error path sẽ là ['linkedProducts', 0, 'productId']
        const linkedProductError = result.error.errors.find((err) => {
          const pathStr = err.path.join('.');
          return pathStr.includes('linkedProducts') && pathStr.includes('productId');
        });
        // Chỉ cần verify có error về linkedProducts.productId
        expect(linkedProductError).toBeDefined();
      }
    });

    it('should reject linkedProducts với position không hợp lệ', () => {
      const invalidPost = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        linkedProducts: [
          {
            productId: 'product-123',
            position: 'invalid-position', // ❌ Invalid
            displayType: 'card',
          },
        ],
      };

      const result = postSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        const positionError = result.error.errors.find(
          (err) => err.path.includes('position') || err.message.includes('Position')
        );
        expect(positionError).toBeDefined();
      }
    });

    it('should reject linkedProducts với displayType không hợp lệ', () => {
      const invalidPost = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        linkedProducts: [
          {
            productId: 'product-123',
            position: 'inline',
            displayType: 'invalid-type', // ❌ Invalid
          },
        ],
      };

      const result = postSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        const displayTypeError = result.error.errors.find(
          (err) => err.path.includes('displayType') || err.message.includes('Display type')
        );
        expect(displayTypeError).toBeDefined();
      }
    });
  });

  // ========================================
  // TEST CASE 4: Default Values
  // ========================================

  describe('Test Case 4: Default Values', () => {
    it('should tự động gán template = "default" khi không có template', () => {
      const postWithoutTemplate = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        // template không được cung cấp
      };

      const result = postSchema.safeParse(postWithoutTemplate);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.template).toBe('default');
      }
    });

    it('should tự động gán tags = [] khi không có tags', () => {
      const postWithoutTags = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        // tags không được cung cấp
      };

      const result = postSchema.safeParse(postWithoutTags);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual([]);
      }
    });
  });

  // ========================================
  // ADDITIONAL VALIDATION TESTS
  // ========================================

  describe('Additional Validation Tests', () => {
    it('should validate videos với URL hợp lệ', () => {
      const postWithVideos = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        videos: [
          {
            url: 'https://www.youtube.com/watch?v=example',
            type: 'youtube',
          },
          {
            url: 'https://vimeo.com/123456',
            type: 'vimeo',
            thumbnail: 'https://example.com/thumb.jpg',
          },
        ],
      };

      const result = postSchema.safeParse(postWithVideos);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.videos).toHaveLength(2);
        expect(result.data.videos?.[0]?.type).toBe('youtube');
        expect(result.data.videos?.[1]?.type).toBe('vimeo');
      }
    });

    it('should reject videos với URL không hợp lệ', () => {
      const postWithInvalidVideo = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        videos: [
          {
            url: 'not-a-valid-url', // ❌ Invalid
            type: 'youtube',
          },
        ],
      };

      const result = postSchema.safeParse(postWithInvalidVideo);

      expect(result.success).toBe(false);
      if (!result.success) {
        const videoError = result.error.errors.find(
          (err) => err.path.includes('videos') && err.message.includes('URL')
        );
        expect(videoError).toBeDefined();
      }
    });

    it('should validate comparisonTable với ít nhất 2 products', () => {
      const postWithComparison = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        comparisonTable: {
          products: ['product-1', 'product-2'],
          features: [
            {
              name: 'Kích thước',
              values: {
                'product-1': '80cm',
                'product-2': '1m2',
              },
            },
          ],
        },
      };

      const result = postSchema.safeParse(postWithComparison);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.comparisonTable?.products).toHaveLength(2);
      }
    });

    it('should reject comparisonTable với ít hơn 2 products', () => {
      const postWithInvalidComparison = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        comparisonTable: {
          products: ['product-1'], // ❌ Chỉ có 1 product
          features: [
            {
              name: 'Kích thước',
              values: {
                'product-1': '80cm',
              },
            },
          ],
        },
      };

      const result = postSchema.safeParse(postWithInvalidComparison);

      expect(result.success).toBe(false);
      if (!result.success) {
        const comparisonError = result.error.errors.find(
          (err) =>
            err.path.includes('comparisonTable') &&
            (err.message.includes('ít nhất 2') || err.message.includes('at least 2'))
        );
        expect(comparisonError).toBeDefined();
      }
    });

    it('should validate readingTime là số nguyên dương', () => {
      const postWithReadingTime = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        readingTime: 5,
      };

      const result = postSchema.safeParse(postWithReadingTime);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.readingTime).toBe(5);
      }
    });

    it('should reject readingTime là số âm', () => {
      const postWithInvalidReadingTime = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        readingTime: -1, // ❌ Invalid
      };

      const result = postSchema.safeParse(postWithInvalidReadingTime);

      expect(result.success).toBe(false);
      if (!result.success) {
        const readingTimeError = result.error.errors.find(
          (err) =>
            err.path.includes('readingTime') &&
            (err.message.includes('số nguyên dương') || err.message.includes('positive'))
        );
        expect(readingTimeError).toBeDefined();
      }
    });

    it('should validate tableOfContents với structure hợp lệ', () => {
      const postWithTOC = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        tableOfContents: [
          {
            id: 'heading-1',
            text: 'Giới thiệu',
            level: 2,
            anchor: '#gioi-thieu',
          },
          {
            id: 'heading-2',
            text: 'Nội dung chính',
            level: 3,
            anchor: '#noi-dung-chinh',
          },
        ],
      };

      const result = postSchema.safeParse(postWithTOC);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tableOfContents).toHaveLength(2);
        expect(result.data.tableOfContents?.[0]?.level).toBe(2);
      }
    });

    it('should reject tableOfContents với level không hợp lệ', () => {
      const postWithInvalidTOC = {
        title: 'Bài viết test',
        slug: 'bai-viet-test',
        content: '<p>Nội dung</p>',
        status: 'draft',
        tableOfContents: [
          {
            id: 'heading-1',
            text: 'Giới thiệu',
            level: 7, // ❌ Invalid (phải là 1-6)
            anchor: '#gioi-thieu',
          },
        ],
      };

      const result = postSchema.safeParse(postWithInvalidTOC);

      expect(result.success).toBe(false);
      if (!result.success) {
        const tocError = result.error.errors.find(
          (err) => err.path.includes('tableOfContents') && err.path.includes('level')
        );
        expect(tocError).toBeDefined();
      }
    });
  });

  // ========================================
  // POST UPDATE SCHEMA TESTS
  // ========================================

  describe('Post Update Schema (Partial)', () => {
    it('should accept partial update với chỉ template', () => {
      const partialUpdate = {
        template: 'gift-guide',
      };

      const result = postUpdateSchema.safeParse(partialUpdate);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.template).toBe('gift-guide');
      }
    });

    it('should accept partial update với chỉ linkedProducts', () => {
      const partialUpdate = {
        linkedProducts: [
          {
            productId: 'product-123',
            position: 'sidebar',
            displayType: 'cta',
          },
        ],
      };

      const result = postUpdateSchema.safeParse(partialUpdate);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.linkedProducts).toHaveLength(1);
      }
    });

    it('should validate slug format trong update nếu có', () => {
      const updateWithInvalidSlug = {
        slug: 'Invalid Slug With Spaces', // ❌ Invalid
      };

      const result = postUpdateSchema.safeParse(updateWithInvalidSlug);

      expect(result.success).toBe(false);
      if (!result.success) {
        const slugError = result.error.errors.find(
          (err) => err.path.includes('slug') && err.message.includes('chữ thường')
        );
        expect(slugError).toBeDefined();
      }
    });
  });
});
