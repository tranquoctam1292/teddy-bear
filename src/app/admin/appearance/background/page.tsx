'use client';

import { Image, Palette } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function BackgroundPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Image className="h-7 w-7" />
          Background Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Tùy chỉnh background cho website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Background Image
          </h3>
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Preview</p>
          </div>
          <Button className="w-full" variant="secondary">Upload Background</Button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Background Color
          </h3>
          <div className="space-y-3">
            <input type="color" className="w-full h-12 rounded-lg" />
            <Button className="w-full" variant="secondary">Apply Color</Button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-sm text-yellow-900 font-medium mb-2">
          🚧 Đang phát triển
        </p>
        <p className="text-sm text-yellow-700">
          Background customization với patterns, parallax effects sẽ có trong update tiếp theo.
        </p>
      </div>
    </div>
  );
}

