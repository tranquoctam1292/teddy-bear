'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: 'shopping' | 'arrow' | 'gift';
  className?: string;
}

export function CTAButton({ 
  text, 
  href, 
  variant = 'primary',
  icon = 'shopping',
  className 
}: CTAButtonProps) {
  const iconMap = {
    shopping: ShoppingBag,
    arrow: ArrowRight,
    gift: Gift,
  };

  const Icon = iconMap[icon];

  const variantStyles = {
    primary: 'bg-pink-600 hover:bg-pink-700 text-white',
    secondary: 'bg-gray-900 hover:bg-gray-800 text-white',
    outline: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50',
  };

  return (
    <div className={className}>
      <Link href={href}>
        <Button
          className={cn(
            'w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl',
            variantStyles[variant]
          )}
        >
          <Icon className="w-5 h-5 mr-2" />
          {text}
        </Button>
      </Link>
    </div>
  );
}

