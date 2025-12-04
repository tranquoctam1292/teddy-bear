/**
 * Internal Linking Analyzer
 * Analyzes links and provides suggestions for internal linking
 */

export interface LinkOpportunity {
  text: string;
  position: number; // Character position
  context: string; // Surrounding text
  suggestedLink: {
    type: 'product' | 'post' | 'page';
    title: string;
    url: string;
    slug: string;
    relevance: number; // 0-100
  };
  anchorText: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BrokenLink {
  url: string;
  anchorText: string;
  position: number;
  context: string;
  status: '404' | 'timeout' | 'error';
}

export interface LinkDistribution {
  internal: {
    count: number;
    byType: {
      product: number;
      post: number;
      page: number;
    };
    anchorTexts: Array<{
      text: string;
      count: number;
    }>;
  };
  external: {
    count: number;
    domains: Array<{
      domain: string;
      count: number;
    }>;
  };
  issues: string[];
}

export interface AnchorTextAnalysis {
  anchorText: string;
  url: string;
  issues: string[];
  suggestions: string[];
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
 * Extract all links from content
 */
function extractLinks(content: string): Array<{
  url: string;
  anchorText: string;
  position: number;
  isInternal: boolean;
}> {
  const links: Array<{
    url: string;
    anchorText: string;
    position: number;
    isInternal: boolean;
  }> = [];

  // Match anchor tags
  const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    const anchorText = extractTextFromHTML(match[2]);
    const position = match.index;

    // Determine if internal
    const isInternal =
      url.startsWith('/') ||
      url.startsWith('#') ||
      url.startsWith('?') ||
      (!url.startsWith('http://') && !url.startsWith('https://'));

    links.push({
      url,
      anchorText,
      position,
      isInternal,
    });
  }

  return links;
}

/**
 * Find link opportunities in content
 * Looks for keywords/phrases that could link to products/posts
 */
export function findLinkOpportunities(
  content: string,
  availableLinks: Array<{
    type: 'product' | 'post' | 'page';
    title: string;
    slug: string;
    keywords?: string[];
    category?: string;
  }>
): LinkOpportunity[] {
  const opportunities: LinkOpportunity[] = [];
  const text = extractTextFromHTML(content);
  const existingLinks = extractLinks(content);

  // Get positions of existing links to avoid overlapping
  const linkedPositions = new Set<number>();
  existingLinks.forEach(link => {
    for (let i = link.position; i < link.position + 50; i++) {
      linkedPositions.add(i);
    }
  });

  // For each available link, search for keywords in content
  for (const link of availableLinks) {
    const keywords = link.keywords || [link.title.toLowerCase()];
    const searchTerms = [
      ...keywords,
      link.title.toLowerCase(),
      ...(link.category ? [link.category.toLowerCase()] : []),
    ];

    for (const term of searchTerms) {
      if (term.length < 3) continue; // Skip very short terms

      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const position = match.index;
        const matchedText = match[0];

        // Skip if already linked
        let isLinked = false;
        for (const pos of linkedPositions) {
          if (Math.abs(pos - position) < 50) {
            isLinked = true;
            break;
          }
        }

        if (!isLinked) {
          // Get context (50 chars before and after)
          const start = Math.max(0, position - 50);
          const end = Math.min(text.length, position + matchedText.length + 50);
          const context = text.substring(start, end);

          // Calculate relevance (simple: based on exact match and position)
          let relevance = 50;
          if (matchedText.toLowerCase() === link.title.toLowerCase()) {
            relevance = 90;
          } else if (keywords.includes(term)) {
            relevance = 70;
          }

          // Higher priority for first occurrence
          if (position < 500) {
            relevance += 10;
          }

          opportunities.push({
            text: matchedText,
            position,
            context,
            suggestedLink: {
              type: link.type,
              title: link.title,
              url: `/${link.type === 'product' ? 'products' : link.type === 'post' ? 'blog' : ''}/${link.slug}`,
              slug: link.slug,
              relevance,
            },
            anchorText: matchedText,
            priority: relevance > 80 ? 'high' : relevance > 60 ? 'medium' : 'low',
          });

          // Mark this position as used
          for (let i = position; i < position + 50; i++) {
            linkedPositions.add(i);
          }
        }
      }
    }
  }

  // Sort by priority and relevance
  opportunities.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.suggestedLink.relevance - a.suggestedLink.relevance;
  });

  return opportunities.slice(0, 10); // Return top 10 opportunities
}

/**
 * Analyze link distribution
 */
export function analyzeLinkDistribution(content: string): LinkDistribution {
  const links = extractLinks(content);
  const internalLinks = links.filter(l => l.isInternal);
  const externalLinks = links.filter(l => !l.isInternal);

  // Analyze internal links by type
  const internalByType = {
    product: 0,
    post: 0,
    page: 0,
  };

  const anchorTexts: Record<string, number> = {};

  internalLinks.forEach(link => {
    // Determine type from URL
    if (link.url.includes('/products/')) {
      internalByType.product++;
    } else if (link.url.includes('/blog/') || link.url.includes('/posts/')) {
      internalByType.post++;
    } else {
      internalByType.page++;
    }

    // Count anchor texts
    const anchor = link.anchorText.toLowerCase().trim();
    if (anchor) {
      anchorTexts[anchor] = (anchorTexts[anchor] || 0) + 1;
    }
  });

  // Analyze external links
  const externalDomains: Record<string, number> = {};
  externalLinks.forEach(link => {
    try {
      const url = new URL(link.url.startsWith('http') ? link.url : `https://${link.url}`);
      const domain = url.hostname.replace('www.', '');
      externalDomains[domain] = (externalDomains[domain] || 0) + 1;
    } catch {
      // Invalid URL, skip
    }
  });

  const issues: string[] = [];
  const wordCount = extractTextFromHTML(content).split(/\s+/).length;

  // Check internal link count
  if (wordCount > 500 && internalLinks.length === 0) {
    issues.push('Nội dung dài nhưng không có internal links. Khuyến nghị thêm 2-5 internal links.');
  } else if (wordCount > 1000 && internalLinks.length < 3) {
    issues.push('Nội dung rất dài nhưng có ít internal links. Khuyến nghị thêm nhiều hơn.');
  }

  // Check anchor text diversity
  const uniqueAnchorTexts = Object.keys(anchorTexts).length;
  if (internalLinks.length > 5 && uniqueAnchorTexts < internalLinks.length * 0.5) {
    issues.push('Anchor texts không đa dạng. Sử dụng nhiều anchor text khác nhau sẽ tốt hơn cho SEO.');
  }

  return {
    internal: {
      count: internalLinks.length,
      byType: internalByType,
      anchorTexts: Object.entries(anchorTexts)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    },
    external: {
      count: externalLinks.length,
      domains: Object.entries(externalDomains)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count),
    },
    issues,
  };
}

/**
 * Analyze anchor text optimization
 */
export function analyzeAnchorText(anchorText: string, url: string): AnchorTextAnalysis {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check if anchor text is too generic
  const genericTexts = ['click here', 'read more', 'xem thêm', 'tại đây', 'link', 'đọc tiếp'];
  if (genericTexts.some(g => anchorText.toLowerCase().includes(g))) {
    issues.push('Anchor text quá chung chung');
    suggestions.push('Sử dụng anchor text mô tả rõ ràng nội dung của link (ví dụ: "Gấu bông Teddy 1m2" thay vì "Xem thêm")');
  }

  // Check if anchor text is too long
  if (anchorText.length > 100) {
    issues.push('Anchor text quá dài');
    suggestions.push('Anchor text nên ngắn gọn, tối đa 60-80 ký tự');
  }

  // Check if anchor text is too short
  if (anchorText.length < 3) {
    issues.push('Anchor text quá ngắn');
    suggestions.push('Anchor text nên có ít nhất 3-5 từ để mô tả rõ ràng');
  }

  // Check if anchor text matches URL
  const urlSlug = url.split('/').pop() || '';
  if (urlSlug && !anchorText.toLowerCase().includes(urlSlug.toLowerCase().replace(/-/g, ' '))) {
    suggestions.push('Cân nhắc sử dụng anchor text có liên quan đến URL để tăng độ liên quan');
  }

  return {
    anchorText,
    url,
    issues,
    suggestions,
  };
}

/**
 * Detect broken links (synchronous check - for client-side)
 * Note: Full broken link detection requires server-side checking
 */
export function detectBrokenLinksSync(
  content: string,
  brokenUrls: string[] = [] // Pre-checked broken URLs
): BrokenLink[] {
  const links = extractLinks(content);
  const broken: BrokenLink[] = [];

  links.forEach(link => {
    if (brokenUrls.includes(link.url)) {
      const text = extractTextFromHTML(content);
      const start = Math.max(0, link.position - 50);
      const end = Math.min(text.length, link.position + 100);
      const context = text.substring(start, end);

      broken.push({
        url: link.url,
        anchorText: link.anchorText,
        position: link.position,
        context,
        status: '404',
      });
    }
  });

  return broken;
}




