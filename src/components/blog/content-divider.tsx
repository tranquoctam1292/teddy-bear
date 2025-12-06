'use client';

import { Sparkles } from 'lucide-react';

interface ContentDividerProps {
  text?: string;
  variant?: 'default' | 'decorative';
}

export function ContentDivider({ text, variant = 'default' }: ContentDividerProps) {
  if (variant === 'decorative') {
    return (
      <div className="my-12 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-300" />
          <Sparkles className="w-5 h-5 text-pink-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 border-t border-gray-200 relative">
      {text && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-white px-4 text-sm font-medium text-gray-500">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}

