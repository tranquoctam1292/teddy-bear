'use client';

// Loading skeleton for Tiptap Editor
export default function RichTextEditorSkeleton({ minHeight = '300px' }: { minHeight?: string }) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar Skeleton */}
      <div className="border-b border-gray-300 bg-gray-50 p-3 animate-pulse">
        <div className="flex flex-wrap gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      
      {/* Editor Content Skeleton */}
      <div className="p-4 animate-pulse" style={{ minHeight }}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

