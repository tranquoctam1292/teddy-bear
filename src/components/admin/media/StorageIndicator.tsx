'use client';

import { HardDrive } from 'lucide-react';

interface StorageIndicatorProps {
  used: number; // in bytes
  total?: number; // in bytes (optional, for showing limit)
}

export default function StorageIndicator({
  used,
  total,
}: StorageIndicatorProps) {
  const usedMB = (used / (1024 * 1024)).toFixed(2);
  const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);

  const displaySize = used > 1024 * 1024 * 1024 ? `${usedGB} GB` : `${usedMB} MB`;

  let percentage = 0;
  let displayTotal = '';

  if (total) {
    percentage = (used / total) * 100;
    const totalGB = (total / (1024 * 1024 * 1024)).toFixed(0);
    displayTotal = `/ ${totalGB} GB`;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Dung lượng đã sử dụng
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {displaySize} {displayTotal}
        </span>
      </div>

      {total && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all ${
                percentage > 90
                  ? 'bg-red-600'
                  : percentage > 70
                  ? 'bg-yellow-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {percentage > 90 ? (
              <span className="text-red-600 font-medium">
                Sắp hết dung lượng! ({percentage.toFixed(1)}%)
              </span>
            ) : (
              `${percentage.toFixed(1)}% dung lượng đã sử dụng`
            )}
          </p>
        </>
      )}
    </div>
  );
}


