// Custom HTML Section Component
'use client';

import { useEffect, useRef } from 'react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface CustomHTMLContent {
  heading?: string;
  html: string; // Raw HTML content
  css?: string; // Custom CSS
  javascript?: string; // Custom JavaScript
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backgroundColor?: string;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export function CustomHTML({
  content,
  layout,
  isPreview,
}: SectionComponentProps<CustomHTMLContent>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxWidth = content.maxWidth || 'lg';

  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  }[maxWidth];

  // Execute custom JavaScript
  useEffect(() => {
    if (!content.javascript || isPreview) return;

    try {
      // Create a new script element
      const script = document.createElement('script');
      script.textContent = content.javascript;
      
      // Append to container
      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }

      // Cleanup
      return () => {
        if (containerRef.current && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (error) {
      console.error('Error executing custom JavaScript:', error);
    }
  }, [content.javascript, isPreview]);

  return (
    <div
      style={{
        backgroundColor: content.backgroundColor,
        paddingTop: content.padding?.top,
        paddingBottom: content.padding?.bottom,
        paddingLeft: content.padding?.left,
        paddingRight: content.padding?.right,
      }}
    >
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidthClass)}>
        {/* Heading */}
        {content.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {content.heading}
            </h2>
          </div>
        )}

        {/* Custom CSS */}
        {content.css && (
          <style dangerouslySetInnerHTML={{ __html: content.css }} />
        )}

        {/* Custom HTML Content */}
        <div
          ref={containerRef}
          className="custom-html-content"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />

        {/* Preview Warning */}
        {isPreview && content.javascript && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Custom JavaScript is disabled in preview mode for security reasons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

