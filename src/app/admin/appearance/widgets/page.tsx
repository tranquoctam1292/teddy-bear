'use client';

import { Grid3x3, Search, Calendar, Tag } from 'lucide-react';

export default function WidgetsPage() {
  const widgets = [
    { id: 'search', name: 'Search Widget', icon: Search, description: 'Tìm kiếm trang' },
    { id: 'recent', name: 'Recent Posts', icon: Calendar, description: 'Bài viết mới nhất' },
    { id: 'categories', name: 'Categories', icon: Tag, description: 'Danh mục' },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Grid3x3 className="h-7 w-7" />
          Quản lý Widgets
        </h1>
        <p className="text-gray-600 mt-1">
          Drag & drop widgets vào các khu vực
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold mb-4">Available Widgets</h3>
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move">
                <widget.icon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">{widget.name}</p>
                  <p className="text-xs text-gray-500">{widget.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold mb-4">Widget Areas</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Sidebar
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Footer
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-sm text-yellow-900 font-medium mb-2">
          🚧 Tính năng đang phát triển
        </p>
        <p className="text-sm text-yellow-700">
          Widgets system với drag & drop sẽ có trong phiên bản tiếp theo.
        </p>
      </div>
    </div>
  );
}

