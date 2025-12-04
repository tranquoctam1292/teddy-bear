/**
 * Formatting Utilities
 * Pure functions for formatting dates, currency, numbers
 */

/**
 * Format date to Vietnamese locale
 * 
 * @param date - Date object or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // => '04/12/2025, 10:30'
 * formatDate(date, { dateStyle: 'long' }) // => '4 tháng 12, 2025'
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return dateObj.toLocaleDateString('vi-VN', options || defaultOptions);
}

/**
 * Format date to short format (DD/MM/YYYY)
 * 
 * @param date - Date object or timestamp
 * @returns Short formatted date
 */
export function formatDateShort(date: Date | string | number): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  return dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format date to long format (4 tháng 12, 2025)
 * 
 * @param date - Date object or timestamp
 * @returns Long formatted date
 */
export function formatDateLong(date: Date | string | number): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  return dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format currency to Vietnamese Dong
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'VND')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(100000) // => '100.000 ₫'
 * formatCurrency(1500000) // => '1.500.000 ₫'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'VND'
): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format file size to human-readable string
 * 
 * @param bytes - Size in bytes
 * @returns Formatted size string
 * 
 * @example
 * formatFileSize(1024) // => '1 KB'
 * formatFileSize(1048576) // => '1 MB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Format number with thousand separators
 * 
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1000) // => '1.000'
 * formatNumber(1234567) // => '1.234.567'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format percentage
 * 
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(25.5) // => '25,5%'
 * formatPercentage(33.333, 1) // => '33,3%'
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

