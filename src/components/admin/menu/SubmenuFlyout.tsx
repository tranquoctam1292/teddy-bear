'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SubMenuItem } from '@/lib/admin-menu-config';

interface SubmenuFlyoutProps {
  items: SubMenuItem[];
  onClose?: () => void;
}

export default function SubmenuFlyout({
  items,
  onClose,
}: SubmenuFlyoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-full top-0 ml-2 min-w-[200px] bg-gray-700 rounded-lg shadow-2xl py-2 z-50 animate-in slide-in-from-left-2 duration-200"
    >
      {/* Arrow pointing to parent */}
      <div className="absolute left-0 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-700 -translate-x-full" />
      
      {/* Menu Items */}
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-200 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
              <span className="flex-1">{item.label}</span>
              {item.badge && typeof item.badge === 'number' && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}







