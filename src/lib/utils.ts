// Utility functions
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

export function formatPriceRange(min: number, max?: number): string {
  if (max && max !== min) {
    return `${formatPrice(min)}đ - ${formatPrice(max)}đ`;
  }
  return `${formatPrice(min)}đ`;
}
