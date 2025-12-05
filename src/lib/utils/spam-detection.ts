// Spam Detection Logic
import type { CommentInput, SpamDetectionResult } from '@/lib/schemas/comment';

/**
 * Blocked Keywords (Hardcoded - sẽ chuyển sang DB config sau)
 */
const BLOCKED_KEYWORDS = [
  'casino',
  'poker',
  'betting',
  'gambling',
  'viagra',
  'cialis',
  'loan',
  'credit',
  'debt',
  'mortgage',
  'bitcoin',
  'crypto',
  'forex',
  'trading',
  'investment',
  'make money',
  'get rich',
  'click here',
  'buy now',
  'limited time',
  'act now',
  'urgent',
  'free money',
  'winner',
  'congratulations',
  'prize',
  'lottery',
  'spam',
  'scam',
  'fake',
  // Vietnamese spam keywords
  'vay tiền',
  'cho vay',
  'lãi suất',
  'kiếm tiền online',
  'làm giàu',
  'nhận ngay',
  'miễn phí',
  'khuyến mãi',
  'giảm giá',
  'mua ngay',
];

/**
 * Blocked Email Domains (Hardcoded - sẽ chuyển sang DB config sau)
 */
const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
];

/**
 * Spam Detection Configuration
 */
interface SpamDetectionConfig {
  minLength: number;
  maxLength: number;
  maxLinks: number;
  autoSpamThreshold: number; // 0-100
  autoApproveThreshold: number; // 0-100
}

const DEFAULT_CONFIG: SpamDetectionConfig = {
  minLength: 10,
  maxLength: 2000,
  maxLinks: 3,
  autoSpamThreshold: 50, // Score >= 50 = spam
  autoApproveThreshold: 20, // Score < 20 = auto approve
};

/**
 * Extract domains from content
 */
function extractDomains(content: string): string[] {
  const urlRegex = /https?:\/\/([^\/\s]+)/gi;
  const matches = content.match(urlRegex);
  if (!matches) return [];

  return matches.map((url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return '';
    }
  }).filter(Boolean);
}

/**
 * Check if content is all caps
 */
function isAllCaps(content: string): boolean {
  const letters = content.replace(/[^a-zA-ZÀ-ỹ]/g, '');
  if (letters.length < 5) return false; // Too short to be meaningful
  return letters === letters.toUpperCase() && letters.length > 0;
}

/**
 * Check for repeated patterns (e.g., "spam spam spam")
 */
function hasRepeatedPattern(content: string): boolean {
  const words = content.toLowerCase().split(/\s+/);
  if (words.length < 3) return false;

  // Check for same word repeated 3+ times
  const wordCounts: Record<string, number> = {};
  for (const word of words) {
    if (word.length > 2) {
      // Only check words longer than 2 chars
      wordCounts[word] = (wordCounts[word] || 0) + 1;
      if (wordCounts[word] >= 3) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check for suspicious patterns (too many special characters, etc.)
 */
function hasSuspiciousPatterns(content: string): boolean {
  // Too many special characters
  const specialCharCount = (content.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
  const specialCharRatio = specialCharCount / content.length;
  if (specialCharRatio > 0.3) {
    return true;
  }

  // Too many numbers (likely spam)
  const numberCount = (content.match(/\d/g) || []).length;
  const numberRatio = numberCount / content.length;
  if (numberRatio > 0.4) {
    return true;
  }

  return false;
}

/**
 * Detect Spam
 * 
 * @param comment - Comment input data
 * @param ipAddress - IP address (optional, for rate limiting)
 * @param config - Spam detection configuration (optional)
 * @returns Spam detection result
 */
export async function detectSpam(
  comment: CommentInput,
  ipAddress?: string,
  config: Partial<SpamDetectionConfig> = {}
): Promise<SpamDetectionResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let score = 0;
  const reasons: string[] = [];

  const lowerContent = comment.content.toLowerCase();

  // 1. Keyword check
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      score += 30;
      reasons.push(`Chứa từ khóa cấm: ${keyword}`);
    }
  }

  // 2. Link check
  const linkCount = (comment.content.match(/https?:\/\//gi) || []).length;
  if (linkCount > finalConfig.maxLinks) {
    score += 20;
    reasons.push(`Quá nhiều liên kết: ${linkCount} (tối đa ${finalConfig.maxLinks})`);
  }

  // 3. Domain check
  const domains = extractDomains(comment.content);
  for (const domain of domains) {
    if (BLOCKED_EMAIL_DOMAINS.some((blocked) => domain.includes(blocked))) {
      score += 50;
      reasons.push(`Chứa domain bị chặn: ${domain}`);
    }
  }

  // 4. Email domain check
  const emailDomain = comment.authorEmail.split('@')[1]?.toLowerCase();
  if (emailDomain && BLOCKED_EMAIL_DOMAINS.includes(emailDomain)) {
    score += 40;
    reasons.push(`Email từ domain bị chặn: ${emailDomain}`);
  }

  // 5. Length check
  if (comment.content.length < finalConfig.minLength) {
    score += 10;
    reasons.push(`Bình luận quá ngắn (tối thiểu ${finalConfig.minLength} ký tự)`);
  }
  if (comment.content.length > finalConfig.maxLength) {
    score += 15;
    reasons.push(`Bình luận quá dài (tối đa ${finalConfig.maxLength} ký tự)`);
  }

  // 6. All CAPS check
  if (isAllCaps(comment.content)) {
    score += 25;
    reasons.push('Viết hoa toàn bộ (suspicious)');
  }

  // 7. Repeated pattern check
  if (hasRepeatedPattern(comment.content)) {
    score += 20;
    reasons.push('Có từ lặp lại nhiều lần');
  }

  // 8. Suspicious patterns
  if (hasSuspiciousPatterns(comment.content)) {
    score += 15;
    reasons.push('Có ký tự đặc biệt hoặc số bất thường');
  }

  // 9. Name check (suspicious names)
  const suspiciousNames = ['admin', 'administrator', 'test', 'user', 'guest'];
  if (suspiciousNames.includes(comment.authorName.toLowerCase())) {
    score += 10;
    reasons.push('Tên người dùng đáng ngờ');
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    isSpam: score >= finalConfig.autoSpamThreshold,
    score,
    reasons,
  };
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeContent(content: string): string {
  // Remove HTML tags but keep line breaks
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Trim and normalize whitespace
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  return sanitized;
}

