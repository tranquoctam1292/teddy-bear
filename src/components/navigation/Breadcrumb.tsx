'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbListSchema } from '@/lib/seo/schemas';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Always include Home as first item
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    ...items,
  ];

  // Generate JSON-LD schema
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn');
  
  const breadcrumbSchema = generateBreadcrumbListSchema(
    breadcrumbItems.map(item => ({
      name: item.label,
      url: item.href,
    })),
    baseUrl
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={breadcrumbSchema} />

      {/* Visual Breadcrumb */}
      <nav
        className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}
        aria-label="Breadcrumb"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <div key={index} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  href={item.href || '#'}
                  className="hover:text-pink-600 transition-colors flex items-center gap-1"
                  aria-label="Trang chủ"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {isLast ? (
                    <span className="text-gray-900 font-medium" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="hover:text-pink-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}


