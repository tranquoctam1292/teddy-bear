/**
 * Content Optimization Engine
 * Provides suggestions for improving content SEO
 */

export interface ContentOptimizationSuggestion {
  type: 'keyword' | 'readability' | 'structure' | 'length' | 'links';
  priority: 'high' | 'medium' | 'low';
  field: string;
  message: string;
  suggestion: string;
  currentValue?: string | number;
  targetValue?: string | number;
  position?: number; // For keyword placement suggestions
}

export interface KeywordPlacementSuggestion {
  keyword: string;
  position: number; // Character position in content
  context: string; // Surrounding text
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ContentStructureAnalysis {
  hasIntroduction: boolean;
  hasConclusion: boolean;
  headingStructure: {
    hasH1: boolean;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    issues: string[];
  };
  paragraphStructure: {
    total: number;
    averageLength: number;
    tooLong: number; // Paragraphs > 150 words
    tooShort: number; // Paragraphs < 20 words
    issues: string[];
  };
  listUsage: {
    hasLists: boolean;
    listCount: number;
    suggestion: string;
  };
}

/**
 * Extract text from HTML
 */
function extractTextFromHTML(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  return text.trim();
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Analyze content length and provide suggestions
 */
export function analyzeContentLength(content: string): ContentOptimizationSuggestion[] {
  const text = extractTextFromHTML(content);
  const wordCount = countWords(text);
  const suggestions: ContentOptimizationSuggestion[] = [];

  if (wordCount < 300) {
    suggestions.push({
      type: 'length',
      priority: 'high',
      field: 'content',
      message: `Nội dung quá ngắn (${wordCount} từ). Khuyến nghị tối thiểu 300 từ.`,
      suggestion: 'Thêm thông tin chi tiết, mô tả sản phẩm, hoặc nội dung liên quan để đạt tối thiểu 300 từ.',
      currentValue: wordCount,
      targetValue: 300,
    });
  } else if (wordCount < 500) {
    suggestions.push({
      type: 'length',
      priority: 'medium',
      field: 'content',
      message: `Nội dung có thể dài hơn (${wordCount} từ). Khuyến nghị 500+ từ cho SEO tốt hơn.`,
      suggestion: 'Mở rộng nội dung với thông tin bổ sung, FAQ, hoặc chi tiết sản phẩm.',
      currentValue: wordCount,
      targetValue: 500,
    });
  } else if (wordCount >= 1000) {
    suggestions.push({
      type: 'length',
      priority: 'low',
      field: 'content',
      message: `Nội dung dài (${wordCount} từ) - tốt cho SEO!`,
      suggestion: 'Đảm bảo nội dung được chia thành các phần rõ ràng với headings phù hợp.',
      currentValue: wordCount,
      targetValue: 1000,
    });
  }

  return suggestions;
}

/**
 * Analyze keyword placement and provide suggestions
 */
export function analyzeKeywordPlacement(
  content: string,
  keyword: string
): KeywordPlacementSuggestion[] {
  if (!keyword) return [];

  const text = extractTextFromHTML(content);
  const suggestions: KeywordPlacementSuggestion[] = [];
  const keywordLower = keyword.toLowerCase();
  const textLower = text.toLowerCase();

  // Check first paragraph (first 200 characters)
  const firstParagraph = text.substring(0, 200);
  if (!firstParagraph.toLowerCase().includes(keywordLower)) {
    suggestions.push({
      keyword,
      position: 0,
      context: firstParagraph.substring(0, 100) + '...',
      suggestion: 'Thêm từ khóa vào đoạn đầu tiên của nội dung để tăng độ liên quan.',
      priority: 'high',
    });
  }

  // Check headings
  const headingMatches = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi) || [];
  let keywordInHeadings = false;
  for (const heading of headingMatches) {
    const headingText = extractTextFromHTML(heading);
    if (headingText.toLowerCase().includes(keywordLower)) {
      keywordInHeadings = true;
      break;
    }
  }

  if (!keywordInHeadings && headingMatches.length > 0) {
    suggestions.push({
      keyword,
      position: content.indexOf(headingMatches[0]),
      context: extractTextFromHTML(headingMatches[0]),
      suggestion: 'Thêm từ khóa vào ít nhất một heading (H1, H2, hoặc H3) để cải thiện SEO.',
      priority: 'high',
    });
  }

  // Check keyword density
  const keywordMatches = (textLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const wordCount = countWords(text);
  const density = (keywordMatches / wordCount) * 100;

  if (density < 0.5) {
    suggestions.push({
      keyword,
      position: -1,
      context: `Mật độ từ khóa: ${density.toFixed(2)}%`,
      suggestion: `Mật độ từ khóa thấp (${density.toFixed(2)}%). Khuyến nghị 0.5-2% để tối ưu SEO.`,
      priority: 'medium',
    });
  } else if (density > 3) {
    suggestions.push({
      keyword,
      position: -1,
      context: `Mật độ từ khóa: ${density.toFixed(2)}%`,
      suggestion: `Mật độ từ khóa quá cao (${density.toFixed(2)}%). Có thể bị coi là spam. Giảm xuống dưới 3%.`,
      priority: 'high',
    });
  }

  return suggestions;
}

/**
 * Analyze content structure
 */
export function analyzeContentStructure(content: string): ContentStructureAnalysis {
  const text = extractTextFromHTML(content);
  const wordCount = countWords(text);

  // Check introduction (first 100 words)
  const first100Words = text.split(/\s+/).slice(0, 100).join(' ');
  const hasIntroduction = first100Words.length > 50;

  // Check conclusion (last 100 words)
  const words = text.split(/\s+/);
  const last100Words = words.slice(-100).join(' ');
  const hasConclusion = last100Words.length > 50;

  // Analyze headings
  const h1Matches = content.match(/<h1[^>]*>/gi) || [];
  const h2Matches = content.match(/<h2[^>]*>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>/gi) || [];

  const headingIssues: string[] = [];
  if (h1Matches.length === 0) {
    headingIssues.push('Thiếu H1 tag');
  } else if (h1Matches.length > 1) {
    headingIssues.push(`Có ${h1Matches.length} H1 tags (nên chỉ có 1)`);
  }

  if (wordCount > 500 && h2Matches.length === 0) {
    headingIssues.push('Nội dung dài nên có H2 tags để chia nhỏ');
  }

  // Analyze paragraphs
  const paragraphs = text.split(/\n\n|\r\n\r\n/).filter(p => p.trim().length > 0);
  const paragraphLengths = paragraphs.map(p => countWords(p));
  const averageLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length || 0;
  const tooLong = paragraphLengths.filter(len => len > 150).length;
  const tooShort = paragraphLengths.filter(len => len < 20 && len > 0).length;

  const paragraphIssues: string[] = [];
  if (tooLong > 0) {
    paragraphIssues.push(`${tooLong} đoạn văn quá dài (>150 từ)`);
  }
  if (tooShort > 0 && wordCount > 300) {
    paragraphIssues.push(`${tooShort} đoạn văn quá ngắn (<20 từ)`);
  }

  // Analyze lists
  const listMatches = content.match(/<[uo]l[^>]*>|^\s*[-*+]\s/gi) || [];
  const hasLists = listMatches.length > 0;

  return {
    hasIntroduction,
    hasConclusion,
    headingStructure: {
      hasH1: h1Matches.length > 0,
      h1Count: h1Matches.length,
      h2Count: h2Matches.length,
      h3Count: h3Matches.length,
      issues: headingIssues,
    },
    paragraphStructure: {
      total: paragraphs.length,
      averageLength,
      tooLong,
      tooShort,
      issues: paragraphIssues,
    },
    listUsage: {
      hasLists,
      listCount: listMatches.length,
      suggestion: hasLists
        ? 'Đã sử dụng danh sách - tốt cho readability'
        : 'Cân nhắc thêm danh sách (bullet points) để cải thiện readability',
    },
  };
}

/**
 * Generate readability improvement suggestions
 */
export function generateReadabilitySuggestions(
  content: string,
  readabilityScore: number
): ContentOptimizationSuggestion[] {
  const suggestions: ContentOptimizationSuggestion[] = [];
  const text = extractTextFromHTML(content);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  // Calculate average sentence length
  const avgSentenceLength = words.length / sentences.length || 0;

  if (avgSentenceLength > 20) {
    suggestions.push({
      type: 'readability',
      priority: 'high',
      field: 'content',
      message: `Câu quá dài (trung bình ${avgSentenceLength.toFixed(1)} từ/câu). Khuyến nghị < 20 từ.`,
      suggestion: 'Chia nhỏ các câu dài thành nhiều câu ngắn hơn để dễ đọc hơn.',
      currentValue: avgSentenceLength,
      targetValue: 20,
    });
  } else if (avgSentenceLength > 15) {
    suggestions.push({
      type: 'readability',
      priority: 'medium',
      field: 'content',
      message: `Câu hơi dài (trung bình ${avgSentenceLength.toFixed(1)} từ/câu).`,
      suggestion: 'Cân nhắc chia một số câu dài thành câu ngắn hơn.',
      currentValue: avgSentenceLength,
      targetValue: 15,
    });
  }

  // Check for passive voice (basic detection)
  const passiveIndicators = ['được', 'bị', 'bởi', 'là', 'có thể được'];
  const passiveCount = passiveIndicators.reduce((count, indicator) => {
    return count + (text.toLowerCase().match(new RegExp(`\\b${indicator}\\b`, 'g')) || []).length;
  }, 0);

  if (passiveCount > 10 && wordCount < 1000) {
    suggestions.push({
      type: 'readability',
      priority: 'low',
      field: 'content',
      message: 'Sử dụng nhiều câu bị động có thể làm giảm tính hấp dẫn.',
      suggestion: 'Cân nhắc sử dụng câu chủ động để nội dung sinh động hơn.',
      currentValue: passiveCount,
      targetValue: 5,
    });
  }

  // Check for complex words (words > 6 characters)
  const complexWords = words.filter(w => w.length > 6).length;
  const complexWordRatio = (complexWords / words.length) * 100;

  if (complexWordRatio > 30) {
    suggestions.push({
      type: 'readability',
      priority: 'low',
      field: 'content',
      message: `Tỷ lệ từ phức tạp cao (${complexWordRatio.toFixed(1)}%).`,
      suggestion: 'Cân nhắc sử dụng từ ngữ đơn giản hơn để dễ đọc hơn.',
      currentValue: complexWordRatio,
      targetValue: 25,
    });
  }

  return suggestions;
}

/**
 * Generate all content optimization suggestions
 */
export function generateContentOptimizationSuggestions(
  content: string,
  keyword?: string,
  readabilityScore?: number
): {
  suggestions: ContentOptimizationSuggestion[];
  structure: ContentStructureAnalysis;
  keywordPlacement: KeywordPlacementSuggestion[];
} {
  const suggestions: ContentOptimizationSuggestion[] = [];

  // Length analysis
  suggestions.push(...analyzeContentLength(content));

  // Keyword placement
  const keywordPlacement = keyword
    ? analyzeKeywordPlacement(content, keyword)
    : [];

  // Readability suggestions
  if (readabilityScore !== undefined) {
    suggestions.push(...generateReadabilitySuggestions(content, readabilityScore));
  }

  // Structure analysis
  const structure = analyzeContentStructure(content);

  // Add structure-based suggestions
  if (!structure.hasIntroduction) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      field: 'content',
      message: 'Thiếu phần giới thiệu ở đầu nội dung.',
      suggestion: 'Thêm đoạn giới thiệu ngắn ở đầu để thu hút người đọc.',
    });
  }

  if (!structure.hasConclusion && countWords(extractTextFromHTML(content)) > 500) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      field: 'content',
      message: 'Thiếu phần kết luận.',
      suggestion: 'Thêm phần kết luận để tóm tắt và kêu gọi hành động.',
    });
  }

  structure.headingStructure.issues.forEach(issue => {
    suggestions.push({
      type: 'structure',
      priority: 'high',
      field: 'content',
      message: issue,
      suggestion: 'Sửa cấu trúc heading để cải thiện SEO và readability.',
    });
  });

  structure.paragraphStructure.issues.forEach(issue => {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      field: 'content',
      message: issue,
      suggestion: 'Điều chỉnh độ dài đoạn văn để dễ đọc hơn.',
    });
  });

  if (!structure.listUsage.hasLists && countWords(extractTextFromHTML(content)) > 300) {
    suggestions.push({
      type: 'structure',
      priority: 'low',
      field: 'content',
      message: structure.listUsage.suggestion,
      suggestion: 'Thêm danh sách (bullet points hoặc numbered list) để cải thiện readability.',
    });
  }

  return {
    suggestions,
    structure,
    keywordPlacement,
  };
}








