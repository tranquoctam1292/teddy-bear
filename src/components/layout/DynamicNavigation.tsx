'use client';

// Dynamic Navigation Component - Renders menu from API
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { NavigationMenuItem } from '@/lib/schemas/navigation';

interface DynamicNavigationProps {
  items: NavigationMenuItem[];
  className?: string;
}

export default function DynamicNavigation({
  items,
  className = '',
}: DynamicNavigationProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(url);
  };

  const renderMenuItem = (item: NavigationMenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item.url);

    if (hasChildren) {
      return (
        <div key={item.id} className="relative group">
          <button
            onClick={() => toggleExpand(item.id)}
            className={`
              flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                active
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }
            `}
          >
            <span>{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isExpanded && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              {item.children?.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  target={child.openInNewTab ? '_blank' : undefined}
                  rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`
                    block px-4 py-2 text-sm transition-colors
                    ${
                      isActive(child.url)
                        ? 'bg-pink-50 text-pink-700 font-medium'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                    }
                  `}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.url}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            active
              ? 'bg-pink-100 text-pink-700'
              : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
          }
        `}
      >
        {item.label}
      </Link>
    );
  };

  // Sort items by order
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {sortedItems.map((item) => renderMenuItem(item))}
    </nav>
  );
}






