/**
 * AI Content Generator
 * Generates meta descriptions, titles, and content suggestions
 * 
 * Supports:
 * - Rule-based generation (default)
 * - OpenAI API (if OPENAI_API_KEY set)
 * - Claude API (if ANTHROPIC_API_KEY set)
 * - Gemini API (if GEMINI_API_KEY set)
 */

import { generateWithAI, type AIProvider } from './ai-providers';

export interface AIGenerationOptions {
  content?: string;
  keyword?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  maxLength?: number;
  language?: 'vi' | 'en';
}

/**
 * Generate meta description
 */
export async function generateMetaDescription(
  options: AIGenerationOptions,
  useAI: boolean = false,
  aiProvider?: AIProvider
): Promise<string> {
  const { content, keyword, maxLength = 160, tone = 'professional' } = options;

  if (!content) {
    return '';
  }

  // Try AI generation if enabled
  if (useAI && aiProvider) {
    try {
      const text = content.replace(/<[^>]+>/g, ' ').trim();
      const prompt = `Generate a compelling meta description (max ${maxLength} characters, ${tone} tone) for this content:\n\n${text.substring(0, 1000)}${keyword ? `\n\nInclude the keyword: ${keyword}` : ''}`;
      
      const systemPrompt = `You are an SEO expert. Generate concise, engaging meta descriptions that encourage clicks. Maximum ${maxLength} characters.`;
      
      const aiResult = await generateWithAI(prompt, {
        provider: aiProvider,
        maxTokens: Math.ceil(maxLength / 2), // Approximate token count
        temperature: 0.7,
        systemPrompt,
        fallbackToRuleBased: true,
      });

      if (aiResult.content && aiResult.provider !== 'rule-based') {
        // Clean and validate AI-generated content
        let description = aiResult.content.trim();
        // Remove quotes if wrapped
        if ((description.startsWith('"') && description.endsWith('"')) ||
            (description.startsWith("'") && description.endsWith("'"))) {
          description = description.slice(1, -1);
        }
        // Ensure length
        if (description.length > maxLength) {
          description = description.substring(0, maxLength - 3) + '...';
        }
        return description;
      }
    } catch (error) {
      console.error('AI generation failed, falling back to rule-based:', error);
      // Fall through to rule-based
    }
  }

  // Rule-based generation (fallback or default)
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  if (sentences.length === 0) {
    return text.substring(0, maxLength);
  }

  // Build description from first sentences
  let description = '';
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (description.length + trimmed.length + 1 <= maxLength - 3) {
      description += (description ? ' ' : '') + trimmed;
    } else {
      break;
    }
  }

  // Add keyword if provided and not already included
  if (keyword && !description.toLowerCase().includes(keyword.toLowerCase())) {
    const keywordPart = keyword.length <= maxLength - description.length - 4
      ? ` - ${keyword}`
      : '';
    if (keywordPart) {
      description = description.substring(0, maxLength - keywordPart.length) + keywordPart;
    }
  }

  // Ensure length
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  return description;
}

/**
 * Generate optimized title
 */
export async function generateTitle(
  options: AIGenerationOptions,
  useAI: boolean = false,
  aiProvider?: AIProvider
): Promise<string> {
  const { content, keyword, maxLength = 60 } = options;

  if (!content) {
    return '';
  }

  // Try AI generation if enabled
  if (useAI && aiProvider) {
    try {
      const text = content.replace(/<[^>]+>/g, ' ').trim();
      const prompt = `Generate an SEO-optimized title (max ${maxLength} characters) for this content:\n\n${text.substring(0, 500)}${keyword ? `\n\nPrimary keyword: ${keyword}` : ''}`;
      
      const systemPrompt = `You are an SEO expert. Generate compelling, keyword-rich titles that are optimized for search engines. Maximum ${maxLength} characters.`;
      
      const aiResult = await generateWithAI(prompt, {
        provider: aiProvider,
        maxTokens: Math.ceil(maxLength / 2),
        temperature: 0.8,
        systemPrompt,
        fallbackToRuleBased: true,
      });

      if (aiResult.content && aiResult.provider !== 'rule-based') {
        let title = aiResult.content.trim();
        // Remove quotes if wrapped
        if ((title.startsWith('"') && title.endsWith('"')) ||
            (title.startsWith("'") && title.endsWith("'"))) {
          title = title.slice(1, -1);
        }
        // Ensure length
        if (title.length > maxLength) {
          title = title.substring(0, maxLength - 3) + '...';
        }
        return title;
      }
    } catch (error) {
      console.error('AI generation failed, falling back to rule-based:', error);
      // Fall through to rule-based
    }
  }

  // Rule-based generation (fallback or default)
  let title = '';

  // Try to find H1
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim();
  } else {
    // Use first sentence
    const text = content.replace(/<[^>]+>/g, ' ').trim();
    const firstSentence = text.split(/[.!?]+/)[0].trim();
    title = firstSentence.substring(0, maxLength);
  }

  // Add keyword if provided
  if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) {
    const keywordPart = ` - ${keyword}`;
    if (title.length + keywordPart.length <= maxLength) {
      title = title + keywordPart;
    } else {
      // Replace part of title with keyword
      const availableLength = maxLength - keywordPart.length - 3;
      title = title.substring(0, availableLength) + '...' + keywordPart;
    }
  }

  // Ensure length
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + '...';
  }

  return title;
}

/**
 * Generate content suggestions
 */
export function generateContentSuggestions(
  content: string,
  keyword?: string
): string[] {
  const suggestions: string[] = [];

  if (!content) {
    return suggestions;
  }

  const text = content.replace(/<[^>]+>/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Length suggestions
  if (wordCount < 300) {
    suggestions.push('Thêm thông tin chi tiết để đạt tối thiểu 300 từ');
  }

  // Keyword suggestions
  if (keyword && !text.toLowerCase().includes(keyword.toLowerCase())) {
    suggestions.push(`Thêm từ khóa "${keyword}" vào nội dung`);
  }

  // Structure suggestions
  if (!content.includes('<h2')) {
    suggestions.push('Thêm các heading (H2) để chia nhỏ nội dung');
  }

  if (!content.includes('<ul') && !content.includes('<ol')) {
    suggestions.push('Thêm danh sách (bullet points) để dễ đọc hơn');
  }

  return suggestions;
}

/**
 * Optimize title for SEO
 */
export function optimizeTitle(
  title: string,
  keyword?: string,
  maxLength: number = 60
): string {
  if (!title) return '';

  // Remove extra spaces
  let optimized = title.replace(/\s+/g, ' ').trim();

  // Add keyword if not present
  if (keyword && !optimized.toLowerCase().includes(keyword.toLowerCase())) {
    const keywordPart = ` - ${keyword}`;
    if (optimized.length + keywordPart.length <= maxLength) {
      optimized = optimized + keywordPart;
    }
  }

  // Ensure length
  if (optimized.length > maxLength) {
    optimized = optimized.substring(0, maxLength - 3) + '...';
  }

  return optimized;
}

/**
 * Generate keyword variations
 */
export function generateKeywordVariations(keyword: string): string[] {
  if (!keyword) return [];

  const variations: string[] = [];
  const words = keyword.toLowerCase().split(/\s+/);

  // Add variations
  variations.push(keyword); // Original
  variations.push(keyword + ' giá'); // Price
  variations.push(keyword + ' mua'); // Buy
  variations.push('mua ' + keyword); // Buy prefix
  variations.push('best ' + keyword); // Best prefix
  variations.push(keyword + ' review'); // Review
  variations.push(keyword + ' hướng dẫn'); // Guide

  // Long-tail variations
  if (words.length === 1) {
    variations.push(`cách chọn ${keyword}`);
    variations.push(`${keyword} nào tốt`);
  }

  return [...new Set(variations)]; // Remove duplicates
}

