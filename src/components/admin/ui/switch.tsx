'use client';

// Professional Admin Switch Component
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Switch({ checked = false, onCheckedChange, disabled = false, className, id }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-gray-900' : 'bg-gray-200',
        className
      )}
      id={id}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          isChecked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}








