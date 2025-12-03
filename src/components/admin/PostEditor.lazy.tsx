/**
 * Lazy-loaded PostEditor component
 * 
 * This is a wrapper that dynamically imports PostEditor
 * to reduce initial bundle size
 */

import dynamic from 'next/dynamic';

// Modern Post Editor (NEW - with 2-column layout, auto-save, SEO intelligence)
export const PostEditor = dynamic(
  () => import('./PostEditorModern').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading modern editor...</p>
          <p className="text-xs text-gray-500 mt-2">2-column layout • Auto-save • SEO intelligence</p>
        </div>
      </div>
    ),
  }
);

// Classic Editor (Fallback if needed)
export const PostEditorClassic = dynamic(
  () => import('./PostEditor').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải trình soạn thảo...</p>
        </div>
      </div>
    ),
  }
);

