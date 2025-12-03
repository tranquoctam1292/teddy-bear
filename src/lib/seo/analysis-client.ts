/**
 * Client-side SEO Analysis Engine
 * 
 * ⚠️ IMPORTANT: This runs on the CLIENT to avoid blocking the UI.
 * Analysis happens in real-time as the user types, and results are
 * only sent to the server when the user clicks Save.
 */

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field: string;
  suggestion?: string;
}

export interface FocusKeywordAnalysis {
  keyword: string;
  density: number; // Percentage
  inTitle: boolean;
  inDescription: boolean;
  inContent: boolean;
  inUrl: boolean;
}

export interface TitleAnalysis {
  length: number;
  pixelWidth: number;
  issues: string[];
}

export interface MetaDescriptionAnalysis {
  length: number;
  pixelWidth: number;
  issues: string[];
}

export interface ContentAnalysis {
  wordCount: number;
  issues: string[];
  qualityScore?: number; // 0-100
  paragraphCount?: number;
  averageParagraphLength?: number;
  headingCount?: {
    h1: number;
    h2: number;
    h3: number;
  };
  imageCount?: number;
  imagesWithoutAlt?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
}

export interface ReadabilityAnalysis {
  score: number; // 0-100
  issues: string[];
}

export interface URLAnalysis {
  length: number;
  issues: string[];
  hasKeyword: boolean;
}

export interface ImageAnalysis {
  total: number;
  withAlt: number;
  withoutAlt: number;
  issues: string[];
}

export interface LinkAnalysis {
  internal: number;
  external: number;
  broken: number; // Placeholder - would need actual link checking
  issues: string[];
}

export interface SEOAnalysisResult {
  seoScore: number; // 0-100
  readabilityScore: number; // 0-100
  overallScore: number; // 0-100
  issues: SEOIssue[];
  focusKeyword?: FocusKeywordAnalysis;
  titleAnalysis: TitleAnalysis;
  metaDescriptionAnalysis: MetaDescriptionAnalysis;
  contentAnalysis: ContentAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  urlAnalysis?: URLAnalysis;
  imageAnalysis?: ImageAnalysis;
  linkAnalysis?: LinkAnalysis;
}

/**
 * Calculate pixel width of text (approximate)
 */
function getPixelWidth(text: string): number {
  // Average character width: ~7px for normal font
  // This is approximate, actual width depends on font, browser, etc.
  return text.length * 7;
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  const words = textLower.split(/\s+/).filter(w => w.length > 0);
  const keywordWords = keywordLower.split(/\s+/);
  
  let matches = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const slice = words.slice(i, i + keywordWords.length).join(' ');
    if (slice === keywordLower) {
      matches++;
    }
  }
  
  return words.length > 0 ? (matches / words.length) * 100 : 0;
}

/**
 * Check if keyword appears in text
 */
function keywordInText(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * Analyze title
 */
function analyzeTitle(title: string, focusKeyword?: string): TitleAnalysis {
  const length = title.length;
  const pixelWidth = getPixelWidth(title);
  const issues: string[] = [];
  
  if (length === 0) {
    issues.push('Title is empty');
  } else if (length < 30) {
    issues.push('Title is too short (recommended: 30-60 characters)');
  } else if (length > 60) {
    issues.push('Title is too long (recommended: 30-60 characters)');
  }
  
  if (pixelWidth > 600) {
    issues.push('Title may be truncated in search results (max ~600px)');
  }
  
  if (focusKeyword && !keywordInText(title, focusKeyword)) {
    issues.push('Focus keyword not found in title');
  }
  
  return {
    length,
    pixelWidth,
    issues,
  };
}

/**
 * Analyze meta description
 */
function analyzeMetaDescription(
  description: string,
  focusKeyword?: string
): MetaDescriptionAnalysis {
  const length = description.length;
  const pixelWidth = getPixelWidth(description);
  const issues: string[] = [];
  
  if (length === 0) {
    issues.push('Meta description is empty');
  } else if (length < 120) {
    issues.push('Meta description is too short (recommended: 120-160 characters)');
  } else if (length > 160) {
    issues.push('Meta description is too long (recommended: 120-160 characters)');
  }
  
  if (pixelWidth > 920) {
    issues.push('Meta description may be truncated in search results (max ~920px)');
  }
  
  if (focusKeyword && !keywordInText(description, focusKeyword)) {
    issues.push('Focus keyword not found in meta description');
  }
  
  return {
    length,
    pixelWidth,
    issues,
  };
}

/**
 * Extract text from HTML (basic implementation)
 */
function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep text
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities (basic)
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  return text.trim();
}

/**
 * Count headings in content
 */
function countHeadings(content: string): { h1: number; h2: number; h3: number } {
  const h1Matches = content.match(/<h1[^>]*>|^#\s/gim) || [];
  const h2Matches = content.match(/<h2[^>]*>|^##\s/gim) || [];
  const h3Matches = content.match(/<h3[^>]*>|^###\s/gim) || [];
  
  return {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
  };
}

/**
 * Count images in content
 */
function countImages(content: string): { total: number; withAlt: number; withoutAlt: number } {
  // Match img tags
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  const total = imgMatches.length;
  
  let withAlt = 0;
  let withoutAlt = 0;
  
  imgMatches.forEach(img => {
    // Check for alt attribute
    const hasAlt = /alt\s*=\s*["']([^"']*)["']/i.test(img);
    if (hasAlt) {
      const altMatch = img.match(/alt\s*=\s*["']([^"']*)["']/i);
      if (altMatch && altMatch[1] && altMatch[1].trim().length > 0) {
        withAlt++;
      } else {
        withoutAlt++;
      }
    } else {
      withoutAlt++;
    }
  });
  
  return { total, withAlt, withoutAlt };
}

/**
 * Count links in content
 */
function countLinks(content: string): { internal: number; external: number } {
  // Match anchor tags
  const linkMatches = content.match(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi) || [];
  
  let internal = 0;
  let external = 0;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  linkMatches.forEach(link => {
    const hrefMatch = link.match(/href\s*=\s*["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      const href = hrefMatch[1];
      
      // Check if internal (starts with / or same domain)
      if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
        internal++;
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        if (baseUrl && href.includes(baseUrl)) {
          internal++;
        } else {
          external++;
        }
      } else {
        // Relative URL, consider internal
        internal++;
      }
    }
  });
  
  return { internal, external };
}

/**
 * Calculate content quality score
 */
function calculateContentQuality(
  wordCount: number,
  paragraphCount: number,
  headingCount: { h1: number; h2: number; h3: number },
  imageCount: number,
  imagesWithoutAlt: number,
  internalLinksCount: number
): number {
  let score = 100;
  
  // Word count (30 points)
  if (wordCount < 300) {
    score -= 20;
  } else if (wordCount < 500) {
    score -= 10;
  } else if (wordCount >= 1000) {
    // Bonus for long-form content
    score += 5;
  }
  
  // Headings structure (20 points)
  if (headingCount.h1 === 0) {
    score -= 10;
  } else if (headingCount.h1 > 1) {
    score -= 5; // Multiple H1s not ideal
  }
  
  if (headingCount.h2 === 0 && wordCount > 300) {
    score -= 5; // Long content should have H2s
  }
  
  // Paragraphs (15 points)
  if (paragraphCount === 0) {
    score -= 15;
  } else if (paragraphCount < 3 && wordCount > 300) {
    score -= 5; // Long content should have multiple paragraphs
  }
  
  // Images (15 points)
  if (wordCount > 500 && imageCount === 0) {
    score -= 10; // Long content should have images
  }
  if (imagesWithoutAlt > 0) {
    score -= imagesWithoutAlt * 3; // Penalty for images without alt
  }
  
  // Internal links (20 points)
  if (wordCount > 500 && internalLinksCount === 0) {
    score -= 10; // Long content should have internal links
  } else if (internalLinksCount >= 3) {
    score += 5; // Bonus for good internal linking
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Analyze content
 */
function analyzeContent(content: string, focusKeyword?: string): ContentAnalysis {
  const wordCount = countWords(extractTextFromHTML(content));
  const issues: string[] = [];
  
  // Count paragraphs
  const paragraphs = content.split(/<\/p>|<\/div>|\n\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  
  // Count headings
  const headingCount = countHeadings(content);
  
  // Count images
  const imageData = countImages(content);
  
  // Count links
  const linkData = countLinks(content);
  
  // Basic checks
  if (wordCount === 0) {
    issues.push('Content is empty');
  } else if (wordCount < 300) {
    issues.push('Content is too short (recommended: 300+ words)');
  }
  
  if (focusKeyword && !keywordInText(extractTextFromHTML(content), focusKeyword)) {
    issues.push('Focus keyword not found in content');
  }
  
  // Heading checks
  if (headingCount.h1 === 0) {
    issues.push('No H1 heading found');
  } else if (headingCount.h1 > 1) {
    issues.push('Multiple H1 headings found (recommended: 1 H1 per page)');
  }
  
  if (wordCount > 300 && headingCount.h2 === 0) {
    issues.push('No H2 headings found (recommended for long content)');
  }
  
  // Image checks
  if (wordCount > 500 && imageData.total === 0) {
    issues.push('No images found (recommended for long content)');
  }
  
  if (imageData.withoutAlt > 0) {
    issues.push(`${imageData.withoutAlt} image(s) without alt text`);
  }
  
  // Link checks
  if (wordCount > 500 && linkData.internal === 0) {
    issues.push('No internal links found (recommended for SEO)');
  }
  
  // Calculate quality score
  const qualityScore = calculateContentQuality(
    wordCount,
    paragraphCount,
    headingCount,
    imageData.total,
    imageData.withoutAlt,
    linkData.internal
  );
  
  // Calculate average paragraph length
  const averageParagraphLength = paragraphCount > 0
    ? Math.round(wordCount / paragraphCount)
    : 0;
  
  return {
    wordCount,
    issues,
    qualityScore,
    paragraphCount,
    averageParagraphLength,
    headingCount,
    imageCount: imageData.total,
    imagesWithoutAlt: imageData.withoutAlt,
    internalLinksCount: linkData.internal,
    externalLinksCount: linkData.external,
  };
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

/**
 * Calculate readability score (Enhanced Flesch Reading Ease)
 * 
 * Flesch Reading Ease Formula:
 * 206.835 - (1.015 × ASL) - (84.6 × ASW)
 * 
 * Where:
 * - ASL = Average Sentence Length (words per sentence)
 * - ASW = Average Syllables per Word
 * 
 * Score ranges:
 * - 90-100: Very Easy (5th grade)
 * - 80-89: Easy (6th grade)
 * - 70-79: Fairly Easy (7th grade)
 * - 60-69: Standard (8th-9th grade)
 * - 50-59: Fairly Difficult (10th-12th grade)
 * - 30-49: Difficult (College)
 * - 0-29: Very Difficult (College Graduate)
 */
function calculateReadability(content: string): ReadabilityAnalysis {
  const text = extractTextFromHTML(content);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const issues: string[] = [];
  
  if (words.length === 0 || sentences.length === 0) {
    return {
      score: 0,
      issues: ['No content to analyze'],
    };
  }
  
  const avgWordsPerSentence = words.length / sentences.length;
  
  // Calculate average syllables per word
  let totalSyllables = 0;
  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 0) {
      totalSyllables += countSyllables(cleanWord);
    }
  });
  const avgSyllablesPerWord = totalSyllables / words.length;
  
  // Flesch Reading Ease calculation
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Normalize to 0-100 scale (Flesch gives 0-100, but can go negative)
  const normalizedScore = Math.max(0, Math.min(100, fleschScore));
  
  // Convert to our 0-100 scale (invert so higher = better)
  // Flesch: higher = easier, we want: higher = better
  const score = Math.round(normalizedScore);
  
  // Generate issues based on score
  if (score < 30) {
    issues.push('Content is very difficult to read (college graduate level)');
  } else if (score < 50) {
    issues.push('Content is difficult to read (college level)');
  } else if (score < 60) {
    issues.push('Content is fairly difficult to read (high school level)');
  }
  
  if (avgWordsPerSentence > 20) {
    issues.push('Sentences are too long (average > 20 words)');
  } else if (avgWordsPerSentence > 15) {
    issues.push('Some sentences are long (average > 15 words)');
  }
  
  if (avgSyllablesPerWord > 2) {
    issues.push('Words are complex (consider using simpler words)');
  }
  
  // Check for passive voice indicators (simplified)
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am'];
  const passiveCount = passiveIndicators.reduce((count, indicator) => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  if (passiveCount > words.length * 0.05 && avgWordsPerSentence > 15) {
    issues.push('Consider using more active voice (too many passive constructions)');
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
}

/**
 * Calculate SEO score based on various factors
 */
function calculateSEOScore(
  titleAnalysis: TitleAnalysis,
  metaDescriptionAnalysis: MetaDescriptionAnalysis,
  contentAnalysis: ContentAnalysis,
  focusKeyword?: FocusKeywordAnalysis,
  urlAnalysis?: URLAnalysis
): number {
  let score = 100;
  
  // Title (30 points)
  if (titleAnalysis.issues.length > 0) {
    score -= titleAnalysis.issues.length * 5;
  }
  if (titleAnalysis.length >= 30 && titleAnalysis.length <= 60) {
    // Perfect length
  } else {
    score -= 10;
  }
  
  // Meta Description (20 points)
  if (metaDescriptionAnalysis.issues.length > 0) {
    score -= metaDescriptionAnalysis.issues.length * 3;
  }
  if (metaDescriptionAnalysis.length >= 120 && metaDescriptionAnalysis.length <= 160) {
    // Perfect length
  } else {
    score -= 5;
  }
  
  // Content (30 points)
  if (contentAnalysis.issues.length > 0) {
    score -= contentAnalysis.issues.length * 5;
  }
  if (contentAnalysis.wordCount >= 300) {
    // Good content length
  } else {
    score -= 15;
  }
  
  // Content Quality Score (bonus/penalty)
  if (contentAnalysis.qualityScore !== undefined) {
    if (contentAnalysis.qualityScore < 60) {
      score -= 10; // Low quality content
    } else if (contentAnalysis.qualityScore >= 80) {
      score += 5; // High quality content bonus
    }
  }
  
  // Image optimization (bonus/penalty)
  if (contentAnalysis.imagesWithoutAlt && contentAnalysis.imagesWithoutAlt > 0) {
    score -= contentAnalysis.imagesWithoutAlt * 2; // Penalty for images without alt
  }
  
  // Internal links (bonus)
  if (contentAnalysis.internalLinksCount && contentAnalysis.internalLinksCount >= 3) {
    score += 3; // Bonus for good internal linking
  }
  
  // Focus Keyword (20 points)
  if (focusKeyword) {
    if (!focusKeyword.inTitle) score -= 5;
    if (!focusKeyword.inDescription) score -= 5;
    if (!focusKeyword.inContent) score -= 5;
    if (focusKeyword.density < 0.5) score -= 3;
    if (focusKeyword.density > 3) score -= 2; // Over-optimization
  }
  
  // URL Structure (10 points)
  if (urlAnalysis) {
    if (urlAnalysis.issues.length > 0) {
      score -= urlAnalysis.issues.length * 2;
    }
    if (urlAnalysis.length > 0 && urlAnalysis.length <= 100) {
      // Good URL length
    } else {
      score -= 5;
    }
    if (focusKeyword && !urlAnalysis.hasKeyword) {
      score -= 3;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Analyze URL structure
 */
function analyzeURL(url: string, focusKeyword?: string): {
  length: number;
  issues: string[];
  hasKeyword: boolean;
} {
  const issues: string[] = [];
  const hasKeyword = focusKeyword ? keywordInText(url, focusKeyword) : false;
  
  if (url.length === 0) {
    issues.push('URL is empty');
  } else if (url.length > 100) {
    issues.push('URL is too long (recommended: < 100 characters)');
  }
  
  // Check for special characters
  if (/[^a-z0-9\-_\/]/.test(url.toLowerCase())) {
    issues.push('URL contains special characters (use hyphens instead)');
  }
  
  // Check for multiple slashes
  if (url.split('/').length > 5) {
    issues.push('URL has too many levels (recommended: < 5 levels)');
  }
  
  // Check for stop words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const urlWords = url.toLowerCase().split(/[\/\-_]/);
  const hasStopWords = urlWords.some(word => stopWords.includes(word));
  if (hasStopWords) {
    issues.push('URL contains stop words (consider removing)');
  }
  
  if (focusKeyword && !hasKeyword) {
    issues.push('Focus keyword not found in URL');
  }
  
  return {
    length: url.length,
    issues,
    hasKeyword,
  };
}

/**
 * Main analysis function
 * 
 * This runs on the CLIENT and returns results immediately.
 * No API calls are made here.
 */
export function analyzeSEO(data: {
  title: string;
  description: string;
  content: string;
  focusKeyword?: string;
  url?: string;
}): SEOAnalysisResult {
  const { title, description, content, focusKeyword, url } = data;
  
  // Analyze each component
  const titleAnalysis = analyzeTitle(title, focusKeyword);
  const metaDescriptionAnalysis = analyzeMetaDescription(description, focusKeyword);
  const contentAnalysis = analyzeContent(content, focusKeyword);
  const readabilityAnalysis = calculateReadability(content);
  const urlAnalysis = url ? analyzeURL(url, focusKeyword) : undefined;
  
  // Image Analysis
  const imageAnalysis: ImageAnalysis | undefined = contentAnalysis.imageCount !== undefined ? {
    total: contentAnalysis.imageCount,
    withAlt: (contentAnalysis.imageCount || 0) - (contentAnalysis.imagesWithoutAlt || 0),
    withoutAlt: contentAnalysis.imagesWithoutAlt || 0,
    issues: contentAnalysis.imagesWithoutAlt && contentAnalysis.imagesWithoutAlt > 0
      ? [`${contentAnalysis.imagesWithoutAlt} image(s) without alt text`]
      : [],
  } : undefined;
  
  // Link Analysis
  const linkAnalysis: LinkAnalysis | undefined = contentAnalysis.internalLinksCount !== undefined ? {
    internal: contentAnalysis.internalLinksCount || 0,
    external: contentAnalysis.externalLinksCount || 0,
    broken: 0, // Would need actual link checking
    issues: [
      ...(contentAnalysis.internalLinksCount === 0 && countWords(extractTextFromHTML(content)) > 500
        ? ['No internal links found (recommended for SEO)']
        : []),
      ...(contentAnalysis.externalLinksCount === 0 && countWords(extractTextFromHTML(content)) > 1000
        ? ['Consider adding external links to authoritative sources']
        : []),
    ],
  } : undefined;
  
  // Analyze focus keyword
  let focusKeywordAnalysis: FocusKeywordAnalysis | undefined;
  if (focusKeyword) {
    focusKeywordAnalysis = {
      keyword: focusKeyword,
      density: calculateKeywordDensity(content, focusKeyword),
      inTitle: keywordInText(title, focusKeyword),
      inDescription: keywordInText(description, focusKeyword),
      inContent: keywordInText(content, focusKeyword),
      inUrl: url ? keywordInText(url, focusKeyword) : false,
    };
  }
  
  // Calculate scores
  const seoScore = calculateSEOScore(
    titleAnalysis,
    metaDescriptionAnalysis,
    contentAnalysis,
    focusKeywordAnalysis,
    urlAnalysis
  );
  const readabilityScore = readabilityAnalysis.score;
  const overallScore = Math.round((seoScore * 0.7) + (readabilityScore * 0.3));
  
  // Collect all issues
  const issues: SEOIssue[] = [];
  
  titleAnalysis.issues.forEach(issue => {
    issues.push({
      type: issue.includes('empty') ? 'error' : 'warning',
      message: issue,
      field: 'title',
    });
  });
  
  metaDescriptionAnalysis.issues.forEach(issue => {
    issues.push({
      type: issue.includes('empty') ? 'error' : 'warning',
      message: issue,
      field: 'metaDescription',
    });
  });
  
  contentAnalysis.issues.forEach(issue => {
    issues.push({
      type: issue.includes('empty') ? 'error' : 'warning',
      message: issue,
      field: 'content',
    });
  });
  
  readabilityAnalysis.issues.forEach(issue => {
    issues.push({
      type: 'info',
      message: issue,
      field: 'readability',
    });
  });
  
  // Add URL issues
  if (urlAnalysis) {
    urlAnalysis.issues.forEach(issue => {
      issues.push({
        type: issue.includes('empty') ? 'error' : 'warning',
        message: issue,
        field: 'url',
      });
    });
  }
  
  return {
    seoScore,
    readabilityScore,
    overallScore,
    issues,
    focusKeyword: focusKeywordAnalysis,
    titleAnalysis,
    metaDescriptionAnalysis,
    contentAnalysis,
    readabilityAnalysis,
    urlAnalysis,
    imageAnalysis,
    linkAnalysis,
  };
}

