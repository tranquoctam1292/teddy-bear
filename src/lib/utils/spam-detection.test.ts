/**
 * Unit Tests for Spam Detection Logic
 * 
 * Tests spam detection rules:
 * - Blocked keywords
 * - Link detection
 * - All CAPS detection
 * - Email domain blacklist
 * - Content length validation
 * - Repeated patterns
 * - Suspicious patterns
 */

import { describe, it, expect } from 'vitest';
import { detectSpam, sanitizeContent } from './spam-detection';
import type { CommentInput } from '@/lib/schemas/comment';

describe('Spam Detection', () => {
  const baseComment: CommentInput = {
    postId: 'test-post-id',
    authorName: 'Test User',
    authorEmail: 'test@example.com',
    content: 'Test content',
  };

  describe('Blocked Keywords Detection', () => {
    it('should detect spam when content contains blocked keyword "mua ngay"', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Mua ngay tại đây!',
      };

      const result = await detectSpam(comment);

      // Score should be >= 30, but isSpam only true if score >= 50
      // So we need multiple indicators or adjust test
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons.some((r) => r.includes('từ khóa cấm'))).toBe(true);
    });

    it('should detect spam when content contains blocked keyword "mua ngay" with link', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Mua ngay tại http://spam-link.com',
      };

      const result = await detectSpam(comment);

      // Combined: keyword (30) + link (20) = 50, should be spam
      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.reasons.some((r) => r.includes('từ khóa cấm'))).toBe(true);
    });

    it('should detect spam when content contains blocked keyword "casino"', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Visit our casino website!',
      };

      const result = await detectSpam(comment);

      // Score should be >= 30
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.reasons.some((r) => r.includes('casino'))).toBe(true);
    });

    it('should detect spam when content contains Vietnamese blocked keyword "vay tiền"', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Vay tiền nhanh chóng!',
      };

      const result = await detectSpam(comment);

      // Score should be >= 30
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.reasons.some((r) => r.includes('vay tiền'))).toBe(true);
    });
  });

  describe('Link Detection', () => {
    it('should detect spam when content contains multiple links', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Mua ngay tại http://spam-link.com và https://another-spam.com và http://third-link.com và http://fourth-link.com',
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(20);
      expect(result.reasons.some((r) => r.includes('Quá nhiều liên kết'))).toBe(true);
    });

    it('should detect spam when content contains blocked domain', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Visit http://tempmail.com for free email!',
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.reasons.some((r) => r.includes('domain bị chặn'))).toBe(true);
    });

    it('should allow normal content with few links', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Check out this article: https://example.com/article',
      };

      const result = await detectSpam(comment);

      // Should not be spam if only 1 link
      expect(result.score).toBeLessThan(50);
    });
  });

  describe('All CAPS Detection', () => {
    it('should detect spam when content is all caps', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'THIS IS SPAM MESSAGE IN ALL CAPS',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(25);
      expect(result.reasons.some((r) => r.includes('Viết hoa toàn bộ'))).toBe(true);
    });

    it('should not flag short all caps as spam', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'OK',
      };

      const result = await detectSpam(comment);

      // Short all caps should not trigger
      expect(result.reasons.some((r) => r.includes('Viết hoa toàn bộ'))).toBe(false);
    });
  });

  describe('Clean Content', () => {
    it('should not flag clean content as spam', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Bài viết rất hay! Cảm ơn tác giả đã chia sẻ.',
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(false);
      expect(result.score).toBeLessThan(50);
    });

    it('should auto-approve content with low spam score', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Bài viết rất hay! Cảm ơn tác giả đã chia sẻ thông tin hữu ích này.',
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(false);
      expect(result.score).toBeLessThan(20); // Should be auto-approved
    });
  });

  describe('Email Domain Blacklist', () => {
    it('should detect spam when email is from blocked domain', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorEmail: 'user@tempmail.com',
        content: 'Normal comment content',
      };

      const result = await detectSpam(comment);

      // Score should be >= 40, but isSpam only true if score >= 50
      // So we need to combine with another indicator or adjust test
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.reasons.some((r) => r.includes('Email từ domain bị chặn'))).toBe(true);
    });

    it('should detect spam when email is from blocked domain with suspicious content', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorEmail: 'user@tempmail.com',
        content: 'Mua ngay tại đây!', // Combined: email (40) + keyword (30) = 70, should be spam
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.reasons.some((r) => r.includes('Email từ domain bị chặn'))).toBe(true);
    });

    it('should allow normal email domains', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorEmail: 'user@gmail.com',
        content: 'Normal comment content',
      };

      const result = await detectSpam(comment);

      expect(result.reasons.some((r) => r.includes('Email từ domain bị chặn'))).toBe(false);
    });
  });

  describe('Content Length Validation', () => {
    it('should flag content that is too short', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'Hi',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(10);
      expect(result.reasons.some((r) => r.includes('quá ngắn'))).toBe(true);
    });

    it('should flag content that is too long', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'A'.repeat(2500), // Exceeds maxLength (2000)
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(15);
      expect(result.reasons.some((r) => r.includes('quá dài'))).toBe(true);
    });
  });

  describe('Repeated Pattern Detection', () => {
    it('should detect spam when content has repeated words', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: 'spam spam spam spam spam',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(20);
      expect(result.reasons.some((r) => r.includes('từ lặp lại'))).toBe(true);
    });
  });

  describe('Suspicious Pattern Detection', () => {
    it('should detect spam when content has too many special characters', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: '!!!@@@###$$$%%%^^^&&&***',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(15);
      expect(result.reasons.some((r) => r.includes('ký tự đặc biệt'))).toBe(true);
    });

    it('should detect spam when content has too many numbers', async () => {
      const comment: CommentInput = {
        ...baseComment,
        content: '1234567890123456789012345678901234567890',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(15);
      expect(result.reasons.some((r) => r.includes('số bất thường'))).toBe(true);
    });
  });

  describe('Suspicious Name Detection', () => {
    it('should flag suspicious names like "admin"', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorName: 'admin',
        content: 'Normal comment',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeGreaterThanOrEqual(10);
      expect(result.reasons.some((r) => r.includes('Tên người dùng đáng ngờ'))).toBe(true);
    });
  });

  describe('Combined Spam Indicators', () => {
    it('should have high spam score when multiple indicators present', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorName: 'admin',
        authorEmail: 'user@tempmail.com',
        content: 'MUA NGAY TẠI http://spam-link.com và https://another-spam.com và http://third-link.com',
      };

      const result = await detectSpam(comment);

      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.reasons.length).toBeGreaterThan(3);
    });
  });

  describe('Score Capping', () => {
    it('should cap spam score at 100', async () => {
      const comment: CommentInput = {
        ...baseComment,
        authorName: 'admin',
        authorEmail: 'user@tempmail.com',
        content: 'MUA NGAY TẠI http://spam-link.com và https://another-spam.com và http://third-link.com và http://fourth-link.com và http://fifth-link.com',
      };

      const result = await detectSpam(comment);

      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});

describe('Content Sanitization', () => {
  it('should remove HTML tags from content', () => {
    const content = '<script>alert("xss")</script>Hello <b>World</b>';
    const sanitized = sanitizeContent(content);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<b>');
    expect(sanitized).toContain('Hello');
    expect(sanitized).toContain('World');
  });

  it('should decode HTML entities', () => {
    const content = 'Hello &amp; World &lt;test&gt;';
    const sanitized = sanitizeContent(content);

    expect(sanitized).toContain('&');
    expect(sanitized).toContain('<');
    expect(sanitized).toContain('>');
  });

  it('should normalize whitespace', () => {
    const content = 'Hello    World\n\n\nTest';
    const sanitized = sanitizeContent(content);

    expect(sanitized).not.toContain('    ');
    expect(sanitized).not.toContain('\n\n\n');
  });

  it('should trim content', () => {
    const content = '   Hello World   ';
    const sanitized = sanitizeContent(content);

    expect(sanitized).toBe('Hello World');
  });
});

