'use client';

import { Code, FileCode } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { useState } from 'react';

export default function ThemeEditorPage() {
  const [cssCode, setCssCode] = useState(`/* Global Custom CSS */

body {
  /* Your custom styles here */
}

.custom-class {
  color: blue;
}`);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Code className="h-7 w-7" />
          Theme File Editor
        </h1>
        <p className="text-gray-600 mt-1">
          Chỉnh sửa CSS/JS toàn cục cho website
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Global Custom CSS</h3>
          <Button size="sm">
            Save Changes
          </Button>
        </div>

        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          className="w-full h-[500px] p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900 font-medium mb-2">
            ⚠️ Lưu ý:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Chỉnh sửa CSS có thể ảnh hưởng đến toàn bộ website</li>
            <li>• Backup code trước khi thay đổi</li>
            <li>• Test kỹ trên dev environment trước</li>
            <li>• Hiện tại có thể add custom CSS per-page trong Page Editor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}




