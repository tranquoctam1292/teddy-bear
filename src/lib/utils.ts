import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export formatting utilities
export {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatCurrency,
  formatPriceRange,
  formatFileSize,
  formatNumber,
  formatPercentage,
} from './utils/format';
