'use client';

// Professional Admin Alert Component
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'info';
  className?: string;
  children: ReactNode;
}

export function Alert({ variant = 'default', className, children }: AlertProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variant === 'destructive' && 'border-red-200 bg-red-50',
        variant === 'success' && 'border-green-200 bg-green-50',
        variant === 'info' && 'border-blue-200 bg-blue-50',
        variant === 'default' && 'border-gray-200 bg-gray-50',
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}

export interface AlertDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm', className)}>
      {children}
    </div>
  );
}

export interface AlertTitleProps {
  className?: string;
  children: ReactNode;
}

export function AlertTitle({ className, children }: AlertTitleProps) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)}>
      {children}
    </h5>
  );
}

