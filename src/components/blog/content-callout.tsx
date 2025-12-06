'use client';

import { AlertCircle, Info, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentCalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'success' | 'highlight';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentCallout({ 
  type = 'info', 
  title, 
  children, 
  className 
}: ContentCalloutProps) {
  const config = {
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800',
    },
    tip: {
      icon: Lightbulb,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-800',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-800',
    },
    success: {
      icon: CheckCircle2,
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800',
    },
    highlight: {
      icon: AlertCircle,
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconColor: 'text-pink-600',
      titleColor: 'text-pink-900',
      textColor: 'text-pink-800',
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'my-8 p-6 rounded-xl border-l-4',
        style.bg,
        style.border,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Icon className={cn('w-6 h-6 flex-shrink-0 mt-0.5', style.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-bold text-lg mb-2', style.titleColor)}>
              {title}
            </h4>
          )}
          <div className={cn('prose prose-sm max-w-none', style.textColor)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

