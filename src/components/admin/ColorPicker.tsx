'use client';

// Color Picker Component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
  isLoading?: boolean;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  description,
  isLoading = false,
}: ColorPickerProps) {
  const presetColors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mb-3">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={isLoading}
              className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex-1">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                placeholder="#3B82F6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm disabled:opacity-50"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Màu có sẵn:</p>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              disabled={isLoading}
              className={`
                w-10 h-10 rounded-lg border-2 transition-all
                ${
                  value === color
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-200 hover:border-gray-300'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Preview:</p>
        <div className="flex items-center gap-3">
          <div
            className="px-4 py-2 rounded-md text-white font-medium text-sm"
            style={{ backgroundColor: value }}
          >
            Button
          </div>
          <div
            className="px-4 py-2 rounded-md border-2 font-medium text-sm"
            style={{
              borderColor: value,
              color: value,
              backgroundColor: `${value}10`,
            }}
          >
            Outline Button
          </div>
        </div>
      </div>
    </div>
  );
}




