'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { TOCItem } from '@/lib/schemas/post';

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    // Create intersection observer to track active section
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.5, 1],
      }
    );

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.anchor.replace('#', ''));
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Set initial active item
    if (items.length > 0) {
      const firstItem = items[0];
      const firstElement = document.getElementById(firstItem.anchor.replace('#', ''));
      if (firstElement) {
        setActiveId(firstItem.anchor.replace('#', ''));
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items]);

  const handleClick = (anchor: string) => {
    const element = document.getElementById(anchor.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveId(anchor.replace('#', ''));
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto',
        'bg-white rounded-lg border border-gray-200 p-4',
        'shadow-sm',
        className
      )}
      aria-label="Mục lục"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Mục lục</h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = activeId === item.anchor.replace('#', '');
          const indentClass = {
            1: 'pl-0',
            2: 'pl-4',
            3: 'pl-8',
            4: 'pl-12',
            5: 'pl-16',
            6: 'pl-20',
          }[item.level] || 'pl-0';

          return (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.anchor)}
                className={cn(
                  'w-full text-left text-sm transition-colors',
                  'hover:text-pink-600 focus:text-pink-600 focus:outline-none',
                  indentClass,
                  isActive
                    ? 'text-pink-600 font-semibold border-l-2 border-pink-600 pl-2 -ml-2'
                    : 'text-gray-600'
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

