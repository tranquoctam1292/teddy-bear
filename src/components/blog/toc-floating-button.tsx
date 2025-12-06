'use client';

import { useState, useEffect, useRef } from 'react';
import { List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableOfContents } from './table-of-contents';
import type { TOCItem } from '@/lib/schemas/post';

interface TOCFloatingButtonProps {
  items: TOCItem[];
  className?: string;
}

export function TOCFloatingButton({ items, className }: TOCFloatingButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>('');

  // Track scroll to show/hide button and calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button after scrolling 300px
      setIsVisible(scrollY > 300);
      
      // Calculate reading progress (0-100%)
      const progress = Math.min(
        100,
        Math.max(0, (scrollY / (documentHeight - windowHeight)) * 100)
      );
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for highlighting
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
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

    items.forEach((item) => {
      const element = document.getElementById(item.anchor.replace('#', ''));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  // Handle TOC item click - smooth scroll + auto-close
  const handleTOCItemClick = (anchor: string) => {
    const element = document.getElementById(anchor.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      // Auto-close after a short delay
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  // Handle swipe down on mobile (for bottom sheet)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!drawerRef.current) return;
    const swipeDistance = touchStart - touchEnd;
    const threshold = 100; // Minimum swipe distance to close
    
    if (swipeDistance > threshold) {
      setIsOpen(false);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Button - Bookmark Style (50-70% screen height, right edge) */}
      <div
        className={cn(
          // Position: 50-70% from top, bám sát mép phải
          'fixed right-0 top-[60%] z-50 transition-all duration-300',
          // Transform để center theo chiều dọc
          '-translate-y-1/2',
          // Visibility animation
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none',
          className
        )}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            // Bookmark shape: Nửa hình tròn hoặc hình chữ nhật bo góc bên trái
            // Mobile: Nửa hình tròn (rounded-l-full)
            'h-16 w-12 rounded-l-full',
            // Desktop: Hình chữ nhật bo góc bên trái (rounded-l-lg) với padding
            'md:h-auto md:w-auto md:min-w-[48px] md:px-3 md:py-4 md:rounded-l-lg',
            // Colors: Warm & Friendly
            'bg-white border border-pink-200 border-r-0',
            'text-pink-600',
            'shadow-lg hover:shadow-xl',
            // Layout
            'flex items-center justify-center gap-2',
            // Transitions
            'transition-all duration-200',
            'hover:scale-105 active:scale-95',
            // Focus states
            'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
            // Reading progress indicator (optional visual cue)
            readingProgress > 0 && 'relative'
          )}
          aria-label="Mở mục lục"
        >
          {/* Icon - Vertical on mobile, horizontal on desktop */}
          <List className="w-5 h-5 md:w-4 md:h-4" />
          
          {/* Desktop: Show text */}
          <span className="hidden md:inline-block text-xs font-medium whitespace-nowrap">
            Mục lục
          </span>
          
          {/* Optional: Reading Progress Ring (SVG) - chỉ hiển thị trên mobile */}
          {readingProgress > 0 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 md:hidden"
              viewBox="0 0 48 64"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="32"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-pink-100"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - readingProgress / 100)}`}
                opacity="0.3"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile: Bottom Sheet */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          // Base: Fixed bottom
          'fixed bottom-0 left-0 right-0 z-50',
          // Mobile: Bottom Sheet (60% height)
          'h-[60vh] max-h-[600px]',
          // Desktop: Sidebar from right
          'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-96 md:max-h-none',
          // Background
          'bg-white shadow-2xl',
          // Animation
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full',
          // Rounded top corners on mobile
          'rounded-t-2xl md:rounded-none'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Mục lục</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Nhấp vào tiêu đề để di chuyển đến phần tương ứng
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                'p-2 rounded-lg hover:bg-gray-100',
                'text-gray-500 hover:text-gray-900',
                'transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
              )}
              aria-label="Đóng mục lục"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Swipe Indicator (Mobile only) */}
          <div className="md:hidden flex justify-center py-2 border-b border-gray-100">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <nav aria-label="Mục lục">
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
                        onClick={() => handleTOCItemClick(item.anchor)}
                        className={cn(
                          'w-full text-left text-sm transition-colors',
                          'hover:text-pink-600 focus:text-pink-600 focus:outline-none',
                          'focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:rounded',
                          indentClass,
                          isActive
                            ? 'text-pink-600 font-semibold border-l-2 border-pink-600 pl-2 -ml-2 bg-pink-50 rounded-r'
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
          </div>
        </div>
      </div>
    </>
  );
}
