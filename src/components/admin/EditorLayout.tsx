'use client';

import { ReactNode, useState } from 'react';
import { ChevronUp, X } from 'lucide-react';
import { Button } from './ui/button';

interface EditorLayoutProps {
  title: string;
  subtitle?: string;
  mainContent: ReactNode;
  sidebar: ReactNode;
  isFullscreen?: boolean;
  mobileActions?: ReactNode;
}

export default function EditorLayout({
  title,
  subtitle,
  mainContent,
  sidebar,
  isFullscreen = false,
  mobileActions,
}: EditorLayoutProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          
          {/* Mobile Sidebar Toggle */}
          <Button
            type="button"
            onClick={() => setShowMobileSidebar(true)}
            variant="outline"
            size="sm"
            className="lg:hidden"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            Tùy chọn
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 pb-20 lg:pb-6">
        <div className={`flex flex-col lg:flex-row gap-4 md:gap-6 ${isFullscreen ? 'justify-center' : ''}`}>
          {/* Main Content Area (75%) */}
          <div className={isFullscreen ? 'w-full max-w-4xl' : 'flex-1 lg:w-3/4'}>
            {mainContent}
          </div>

          {/* Desktop Sidebar (25%) */}
          {!isFullscreen && (
            <aside className="hidden lg:block lg:w-1/4 lg:max-w-sm">
              <div className="sticky top-6 space-y-4">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile Actions (Fixed Bottom Bar) */}
      {mobileActions && !isFullscreen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
          {mobileActions}
        </div>
      )}

      {/* Mobile Sidebar (Bottom Sheet) */}
      {showMobileSidebar && !isFullscreen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-in fade-in">
          <div 
            className="absolute inset-0"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
            {/* Sheet Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold text-gray-900">Tùy chọn</h3>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Sheet Content */}
            <div className="p-4 space-y-4">
              {sidebar}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

