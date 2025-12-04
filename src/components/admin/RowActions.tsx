// WordPress-style Row Actions Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface RowAction {
  label: string;
  onClick?: () => void | Promise<void>;
  href?: string;
  className?: string;
  confirmMessage?: string;
  target?: '_blank' | '_self';
}

interface RowActionsProps {
  title: string;
  titleHref?: string;
  status?: string;
  actions: RowAction[];
  className?: string;
}

export default function RowActions({
  title,
  titleHref,
  status,
  actions,
  className = '',
}: RowActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: RowAction) => {
    if (action.confirmMessage) {
      if (!confirm(action.confirmMessage)) {
        return;
      }
    }

    if (action.onClick) {
      setIsLoading(true);
      try {
        await action.onClick();
      } catch (error) {
        console.error('Action error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`group ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        {titleHref ? (
          <Link
            href={titleHref}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        ) : (
          <span className="font-medium text-gray-900">{title}</span>
        )}
        
        {status && (
          <span className="text-xs text-gray-500">
            — {status}
          </span>
        )}
      </div>

      {/* Quick Actions (show on hover) */}
      <div
        className={`flex items-center gap-1 mt-1 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {actions.map((action, index) => (
          <span key={index}>
            {index > 0 && <span className="text-gray-400 mx-1">|</span>}
            
            {action.href ? (
              <Link
                href={action.href}
                target={action.target}
                className={`text-sm hover:underline ${
                  action.className || 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={() => handleAction(action)}
                disabled={isLoading}
                className={`text-sm hover:underline disabled:opacity-50 ${
                  action.className || 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {action.label}
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Pre-defined action creators for common use cases
 */
export const createEditAction = (href: string): RowAction => ({
  label: 'Chỉnh sửa',
  href,
});

export const createQuickEditAction = (onClick: () => void): RowAction => ({
  label: 'Sửa nhanh',
  onClick,
  className: 'text-blue-600',
});

export const createTrashAction = (
  onClick: () => void | Promise<void>,
  itemName: string = 'mục này'
): RowAction => ({
  label: 'Xóa tạm',
  onClick,
  className: 'text-red-600 hover:text-red-700',
  confirmMessage: `Bạn có chắc muốn xóa ${itemName}? Có thể khôi phục sau.`,
});

export const createDeleteAction = (
  onClick: () => void | Promise<void>,
  itemName: string = 'mục này'
): RowAction => ({
  label: 'Xóa vĩnh viễn',
  onClick,
  className: 'text-red-700 hover:text-red-800',
  confirmMessage: `⚠️ CẢNH BÁO: Xóa vĩnh viễn ${itemName}?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`,
});

export const createPreviewAction = (href: string): RowAction => ({
  label: 'Xem trước',
  href,
  target: '_blank',
});

export const createDuplicateAction = (onClick: () => void | Promise<void>): RowAction => ({
  label: 'Nhân đôi',
  onClick,
  className: 'text-green-600 hover:text-green-700',
});

export const createViewAction = (href: string): RowAction => ({
  label: 'Xem',
  href,
  target: '_blank',
});

export const createRestoreAction = (onClick: () => void | Promise<void>): RowAction => ({
  label: 'Khôi phục',
  onClick,
  className: 'text-green-600',
});

