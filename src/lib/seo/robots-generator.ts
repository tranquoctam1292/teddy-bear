/**
 * Robots.txt Generator
 * 
 * Utility functions for generating and validating robots.txt content
 */

export interface RobotsRule {
  userAgent: string | '*';
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsTxtConfig {
  rules: RobotsRule[];
  sitemaps?: string[];
  customContent?: string;
}

/**
 * Generate robots.txt content from configuration
 */
export function generateRobotsTxt(config: RobotsTxtConfig): string {
  // If custom content is provided, use it
  if (config.customContent) {
    return config.customContent;
  }

  const lines: string[] = [];

  // Group rules by user agent
  const rulesByUserAgent = new Map<string, RobotsRule[]>();
  
  for (const rule of config.rules) {
    const key = rule.userAgent || '*';
    if (!rulesByUserAgent.has(key)) {
      rulesByUserAgent.set(key, []);
    }
    rulesByUserAgent.get(key)!.push(rule);
  }

  // Generate rules for each user agent
  for (const [userAgent, rules] of rulesByUserAgent.entries()) {
    lines.push(`User-agent: ${userAgent}`);
    
    for (const rule of rules) {
      if (rule.allow && rule.allow.length > 0) {
        for (const path of rule.allow) {
          lines.push(`Allow: ${path}`);
        }
      }
      
      if (rule.disallow && rule.disallow.length > 0) {
        for (const path of rule.disallow) {
          lines.push(`Disallow: ${path}`);
        }
      }
      
      if (rule.crawlDelay !== undefined) {
        lines.push(`Crawl-delay: ${rule.crawlDelay}`);
      }
    }
    
    lines.push(''); // Empty line between user agents
  }

  // Add sitemaps
  if (config.sitemaps && config.sitemaps.length > 0) {
    for (const sitemap of config.sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
  }

  return lines.join('\n');
}

/**
 * Parse robots.txt content into configuration
 */
export function parseRobotsTxt(content: string): RobotsTxtConfig {
  const lines = content.split('\n');
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];
  
  let currentUserAgent: string | null = null;
  let currentRule: RobotsRule | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      // Empty line indicates end of current rule group
      if (currentRule) {
        rules.push(currentRule);
        currentRule = null;
        currentUserAgent = null;
      }
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const directive = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    switch (directive) {
      case 'user-agent':
        // Save previous rule if exists
        if (currentRule) {
          rules.push(currentRule);
        }
        
        currentUserAgent = value;
        currentRule = {
          userAgent: currentUserAgent,
          allow: [],
          disallow: [],
        };
        break;

      case 'allow':
        if (currentRule) {
          if (!currentRule.allow) {
            currentRule.allow = [];
          }
          currentRule.allow.push(value);
        }
        break;

      case 'disallow':
        if (currentRule) {
          if (!currentRule.disallow) {
            currentRule.disallow = [];
          }
          currentRule.disallow.push(value);
        }
        break;

      case 'crawl-delay':
        if (currentRule) {
          const delay = parseInt(value, 10);
          if (!isNaN(delay)) {
            currentRule.crawlDelay = delay;
          }
        }
        break;

      case 'sitemap':
        sitemaps.push(value);
        break;
    }
  }

  // Add last rule if exists
  if (currentRule) {
    rules.push(currentRule);
  }

  return {
    rules,
    sitemaps: sitemaps.length > 0 ? sitemaps : undefined,
  };
}

/**
 * Validate robots.txt content
 */
export interface RobotsTxtValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateRobotsTxt(content: string): RobotsTxtValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content || content.trim().length === 0) {
    warnings.push('Robots.txt is empty');
    return { isValid: true, errors, warnings };
  }

  const lines = content.split('\n');
  let hasUserAgent = false;
  let hasSitemap = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      errors.push(`Line ${lineNumber}: Invalid format (missing colon)`);
      continue;
    }

    const directive = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    switch (directive) {
      case 'user-agent':
        hasUserAgent = true;
        if (!value || value.length === 0) {
          errors.push(`Line ${lineNumber}: User-agent value is empty`);
        }
        break;

      case 'allow':
      case 'disallow':
        if (!hasUserAgent) {
          errors.push(`Line ${lineNumber}: ${directive} directive must come after User-agent`);
        }
        if (!value || value.length === 0) {
          warnings.push(`Line ${lineNumber}: ${directive} value is empty (disallows/allows everything)`);
        }
        break;

      case 'crawl-delay':
        if (!hasUserAgent) {
          errors.push(`Line ${lineNumber}: Crawl-delay directive must come after User-agent`);
        }
        const delay = parseInt(value, 10);
        if (isNaN(delay) || delay < 0) {
          errors.push(`Line ${lineNumber}: Crawl-delay must be a positive number`);
        }
        break;

      case 'sitemap':
        hasSitemap = true;
        if (!value || value.length === 0) {
          errors.push(`Line ${lineNumber}: Sitemap URL is empty`);
        } else if (!value.startsWith('http://') && !value.startsWith('https://')) {
          warnings.push(`Line ${lineNumber}: Sitemap URL should be absolute (starts with http:// or https://)`);
        }
        break;

      default:
        warnings.push(`Line ${lineNumber}: Unknown directive "${directive}"`);
    }
  }

  if (!hasUserAgent && content.trim().length > 0) {
    warnings.push('No User-agent directive found. Consider adding at least "User-agent: *"');
  }

  if (!hasSitemap) {
    warnings.push('No Sitemap directive found. Consider adding your sitemap URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate default robots.txt configuration
 */
export function generateDefaultRobotsConfig(sitemapUrl?: string): RobotsTxtConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/checkout/', '/cart/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemaps: sitemapUrl ? [sitemapUrl] : [`${baseUrl}/sitemap.xml`],
  };
}





