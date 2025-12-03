'use client';

import Link from 'next/link';

interface StatusTab {
  label: string;
  value: string;
  count: number;
}

interface StatusTabsProps {
  tabs: StatusTab[];
  currentStatus: string;
  baseUrl: string;
}

export default function StatusTabs({
  tabs,
  currentStatus,
  baseUrl,
}: StatusTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 pb-2 mb-4">
      {tabs.map((tab) => {
        const isActive = currentStatus === tab.value || (!currentStatus && tab.value === 'all');
        
        return (
          <Link
            key={tab.value}
            href={`${baseUrl}${tab.value !== 'all' ? `?status=${tab.value}` : ''}`}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              isActive
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}{' '}
            <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
              ({tab.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}

