'use client';

import { Paintbrush, Eye } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function AppearanceCustomizePage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Paintbrush className="h-7 w-7" />
          Tùy chỉnh Giao diện
        </h1>
        <p className="text-gray-600 mt-1">
          Live theme customizer với preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4">Theme Customizer</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
              Color pickers, typography settings, spacing controls...
            </div>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/admin/settings/appearance'}>
              Đến Theme Settings hiện tại
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Live Preview</h3>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Preview window sẽ hiển thị tại đây</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm text-blue-900 font-medium mb-2">
          💡 Hiện tại có thể tùy chỉnh:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Theme (light/dark/auto) tại Settings → Appearance</li>
          <li>• Colors & Border radius tại Settings → Appearance</li>
          <li>• Logo & Favicon tại Settings → Appearance</li>
          <li>• Navigation menu tại Settings → Navigation</li>
        </ul>
      </div>
    </div>
  );
}

