/**
 * Generate Table of Contents from HTML content
 */
import type { TOCItem } from '@/lib/schemas/post';

export function generateTableOfContents(htmlContent: string): TOCItem[] {
  if (!htmlContent) return [];

  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Find all headings (h1-h6)
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  const tocItems: TOCItem[] = [];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1)); // Extract number from H1, H2, etc.
    const text = heading.textContent?.trim() || '';
    
    // Skip empty headings
    if (!text) return;
    
    // Generate anchor ID from text
    const anchor = generateAnchor(text, index);
    
    // Set the ID on the heading element (for scrolling)
    heading.id = anchor;
    
    tocItems.push({
      id: `toc-${index}`,
      text,
      level,
      anchor: `#${anchor}`,
    });
  });
  
  return tocItems;
}

/**
 * Generate a URL-friendly anchor from text
 */
function generateAnchor(text: string, index: number): string {
  // Convert to lowercase, remove special chars, replace spaces with hyphens
  const anchor = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // If anchor is empty, use index
  return anchor || `heading-${index}`;
}

/**
 * Inject IDs into HTML content for headings
 */
export function injectHeadingIds(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim() || '';
    if (!text) return;
    
    const anchor = generateAnchor(text, index);
    heading.id = anchor;
  });
  
  // Return the modified HTML
  return doc.body.innerHTML;
}

