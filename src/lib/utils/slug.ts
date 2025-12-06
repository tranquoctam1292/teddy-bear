/**
 * Slug Generation Utilities
 * Pure functions for generating URL-friendly slugs
 */

/**
 * Generate a URL-friendly slug from text
 * 
 * @param text - Input text (title, name, etc.)
 * @returns URL-safe slug
 * 
 * @example
 * generateSlug('Gấu Bông Teddy') // => 'gau-bong-teddy'
 * generateSlug('Đẹp Quá') // => 'dep-qua'
 * generateSlug('Hello World!') // => 'hello-world'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    // Handle special Vietnamese characters first (before normalize)
    .replace(/đ/g, 'd') // Đ, đ → d
    .replace(/Đ/g, 'd') // Uppercase Đ → d
    .normalize('NFD') // Normalize Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing dashes
}

/**
 * Generate unique slug with timestamp suffix
 * 
 * @param text - Input text
 * @returns Unique slug with timestamp
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = generateSlug(text);
  const timestamp = Date.now().toString(36); // Base36 for shorter string
  return `${baseSlug}-${timestamp}`;
}

/**
 * Validate if a string is a valid slug
 * 
 * @param slug - Slug to validate
 * @returns true if valid slug
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

