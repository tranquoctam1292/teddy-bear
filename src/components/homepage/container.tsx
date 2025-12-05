// Container Component - Phase 1: Foundation
// Provides consistent max-width constraints for homepage sections
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type ContainerVariant = 'full-width' | 'narrow' | 'standard' | 'wide';

interface ContainerProps {
  variant?: ContainerVariant;
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'mobile' | 'tablet' | 'desktop' | 'all';
}

const CONTAINER_VARIANTS: Record<ContainerVariant, string> = {
  'full-width': 'w-full',
  narrow: 'max-w-container-narrow mx-auto',
  standard: 'max-w-container-standard mx-auto',
  wide: 'max-w-container-wide mx-auto',
};

const PADDING_CLASSES = {
  none: '',
  mobile: 'px-4',
  tablet: 'px-4 sm:px-6',
  desktop: 'px-4 sm:px-6 lg:px-8',
  all: 'px-4 sm:px-6 lg:px-8',
};

export function Container({
  variant = 'standard',
  children,
  className,
  padding = 'desktop',
}: ContainerProps) {
  return (
    <div className={cn(CONTAINER_VARIANTS[variant], PADDING_CLASSES[padding], className)}>
      {children}
    </div>
  );
}
