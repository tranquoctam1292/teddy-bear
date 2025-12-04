'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, Loader2 } from 'lucide-react';
import { PageWithChildren } from '@/lib/types/page';
import Link from 'next/link';

interface PageHierarchyTreeProps {
  onSelect?: (pageId: string) => void;
  selectedId?: string;
}

export default function PageHierarchyTree({
  onSelect,
  selectedId,
}: PageHierarchyTreeProps) {
  const [pages, setPages] = useState<PageWithChildren[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pages?limit=100');
      if (response.ok) {
        const data = await response.json();
        const hierarchical = buildHierarchy(data.pages);
        setPages(hierarchical);
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildHierarchy = (flatPages: any[]): PageWithChildren[] => {
    const map = new Map<string, PageWithChildren>();
    const roots: PageWithChildren[] = [];

    // Create map
    flatPages.forEach((page) => {
      map.set(page._id, { ...page, children: [] });
    });

    // Build tree
    flatPages.forEach((page) => {
      const node = map.get(page._id)!;
      if (page.parentId) {
        const parent = map.get(page.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort by order
    const sortByOrder = (items: PageWithChildren[]) => {
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };

    sortByOrder(roots);
    return roots;
  };

  const toggleExpand = (pageId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedIds(newExpanded);
  };

  const renderPage = (page: PageWithChildren, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedIds.has(page._id || '');
    const isSelected = selectedId === page._id;

    return (
      <div key={page._id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onSelect && onSelect(page._id || '')}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(page._id || '');
              }}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <FileText className="h-4 w-4 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{page.title}</p>
            <p className="text-xs text-gray-500 truncate">/{page.slug}</p>
          </div>

          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              page.status === 'published'
                ? 'bg-green-100 text-green-700'
                : page.status === 'draft'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {page.status}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {page.children!.map((child) => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">Chưa có trang nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {pages.map((page) => renderPage(page))}
    </div>
  );
}



