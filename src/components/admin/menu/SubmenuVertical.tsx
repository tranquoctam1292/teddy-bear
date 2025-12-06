'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SubMenuItem } from '@/lib/admin-menu-config';

interface SubmenuVerticalProps {
  items: SubMenuItem[];
}

export default function SubmenuVertical({ items }: SubmenuVerticalProps) {
  const pathname = usePathname();

  return (
    <div className="animate-in slide-in-from-top-2 duration-200 overflow-hidden">
      <div className="py-1 space-y-0.5">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 pl-12 pr-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white font-medium border-l-4 border-blue-500'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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







