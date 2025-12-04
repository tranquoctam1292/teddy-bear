// Unit Tests: Homepage Configuration
import { describe, test, expect } from '@jest/globals';
import {
  generateSlug,
  validateSectionContent,
} from '@/lib/schemas/homepage';
import type {
  HomepageConfig,
  HomepageSection,
  HeroBannerContent,
} from '@/lib/types/homepage';

describe('Homepage Configuration', () => {
  describe('generateSlug', () => {
    test('converts name to slug', () => {
      expect(generateSlug('Summer Sale 2024')).toBe('summer-sale-2024');
    });

    test('handles Vietnamese characters', () => {
      expect(generateSlug('Khuyến Mãi Mùa Hè')).toBe('khuyen-mai-mua-he');
    });

    test('removes special characters', () => {
      expect(generateSlug('Hello@World#123')).toBe('helloworld123');
    });

    test('handles multiple spaces', () => {
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
    });

    test('removes leading/trailing hyphens', () => {
      expect(generateSlug('  Test  ')).toBe('test');
    });
  });

  describe('Section Validation', () => {
    test('validates hero banner content', () => {
      const content: HeroBannerContent = {
        heading: 'Welcome',
        image: 'https://example.com/image.jpg',
        imageAlt: 'Hero image',
      };

      expect(() => validateSectionContent('hero-banner', content)).not.toThrow();
    });

    test('rejects invalid hero banner', () => {
      const content = {
        heading: '', // Empty heading
        image: 'invalid-url', // Invalid URL
        imageAlt: '',
      };

      expect(() => validateSectionContent('hero-banner', content)).toThrow();
    });

    test('validates featured products content', () => {
      const content = {
        heading: 'Featured Products',
        productSelection: 'automatic',
        limit: 8,
        columns: 4,
        showPrice: true,
      };

      expect(() => validateSectionContent('featured-products', content)).not.toThrow();
    });
  });

  describe('Section Ordering', () => {
    test('sections sort by order field', () => {
      const sections: HomepageSection[] = [
        { id: '1', name: 'Section 1', order: 2, enabled: true } as any,
        { id: '2', name: 'Section 2', order: 0, enabled: true } as any,
        { id: '3', name: 'Section 3', order: 1, enabled: true } as any,
      ];

      const sorted = [...sections].sort((a, b) => a.order - b.order);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    test('filters disabled sections', () => {
      const sections: HomepageSection[] = [
        { id: '1', name: 'Section 1', enabled: true } as any,
        { id: '2', name: 'Section 2', enabled: false } as any,
        { id: '3', name: 'Section 3', enabled: true } as any,
      ];

      const enabled = sections.filter((s) => s.enabled);

      expect(enabled.length).toBe(2);
      expect(enabled.map((s) => s.id)).toEqual(['1', '3']);
    });
  });
});

describe('SEO Metadata', () => {
  test('title length validation', () => {
    const shortTitle = 'Test'; // Too short
    const goodTitle = 'Best Teddy Shop - Quality Toys for Kids'; // Good
    const longTitle = 'A'.repeat(70); // Too long

    expect(shortTitle.length).toBeLessThan(10);
    expect(goodTitle.length).toBeGreaterThanOrEqual(10);
    expect(goodTitle.length).toBeLessThanOrEqual(60);
    expect(longTitle.length).toBeGreaterThan(60);
  });

  test('description length validation', () => {
    const shortDesc = 'Test'; // Too short
    const goodDesc = 'A'.repeat(120); // Good length
    const longDesc = 'A'.repeat(200); // Too long

    expect(shortDesc.length).toBeLessThan(50);
    expect(goodDesc.length).toBeGreaterThanOrEqual(50);
    expect(goodDesc.length).toBeLessThanOrEqual(160);
    expect(longDesc.length).toBeGreaterThan(160);
  });
});

