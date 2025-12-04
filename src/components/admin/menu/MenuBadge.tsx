'use client';

import { Pin } from 'lucide-react';

interface MenuBadgeProps {
  value: number | 'pin';
}

export default function MenuBadge({ value }: MenuBadgeProps) {
  if (value === 'pin') {
    return (
      <Pin className="w-3 h-3 text-blue-400 ml-auto" fill="currentColor" />
    );
  }

  if (typeof value === 'number' && value > 0) {
    return (
      <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
        {value > 99 ? '99+' : value}
      </span>
    );
  }

  return null;
}



