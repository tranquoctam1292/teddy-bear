'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FolderOpen } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import CategoryManager from '@/components/admin/CategoryManager';

export default function PostCategoriesPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="h-7 w-7" />
              Danh mục Bài viết
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý categories cho blog posts
            </p>
          </div>
        </div>
      </div>

      <CategoryManager />
    </div>
  );
}

