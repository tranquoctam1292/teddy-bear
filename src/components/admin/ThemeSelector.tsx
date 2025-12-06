'use client';

// Theme Selector Component
import { Sun, Moon, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

interface ThemeSelectorProps {
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  isLoading?: boolean;
}

export default function ThemeSelector({
  theme,
  onThemeChange,
  isLoading = false,
}: ThemeSelectorProps) {
  const themes = [
    {
      value: 'light' as const,
      label: 'Sáng',
      icon: Sun,
      description: 'Theme sáng cho website',
    },
    {
      value: 'dark' as const,
      label: 'Tối',
      icon: Moon,
      description: 'Theme tối cho website',
    },
    {
      value: 'auto' as const,
      label: 'Tự động',
      icon: Monitor,
      description: 'Tự động theo hệ thống',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Chọn theme</h3>
        <p className="text-sm text-gray-500 mb-4">
          Theme sẽ áp dụng cho toàn bộ website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;

          return (
            <button
              key={themeOption.value}
              type="button"
              onClick={() => onThemeChange(themeOption.value)}
              disabled={isLoading}
              className={`
                relative p-6 border-2 rounded-lg text-left transition-all
                ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {themeOption.label}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {themeOption.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}








