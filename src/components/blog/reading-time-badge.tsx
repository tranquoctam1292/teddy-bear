import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingTimeBadgeProps {
  readingTime: number; // in minutes
  className?: string;
  variant?: 'default' | 'compact';
}

export function ReadingTimeBadge({
  readingTime,
  className,
  variant = 'default',
}: ReadingTimeBadgeProps) {
  if (!readingTime || readingTime <= 0) {
    return null;
  }

  const displayText = `${readingTime} phút đọc`;

  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs text-gray-500',
          className
        )}
        aria-label={displayText}
      >
        <Clock className="w-3 h-3" />
        <span>{readingTime} phút</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium',
        className
      )}
      aria-label={displayText}
    >
      <Clock className="w-4 h-4" />
      <span>{displayText}</span>
    </span>
  );
}

