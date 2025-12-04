'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/lib/admin-menu-config';
import MenuBadge from './MenuBadge';
import SubmenuFlyout from './SubmenuFlyout';
import SubmenuVertical from './SubmenuVertical';

interface MenuItemProps {
  item: MenuItemType;
  isHovered: boolean;
  isPinned: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export default function MenuItem({
  item,
  isHovered,
  isPinned,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: MenuItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  
  // Check if current path matches this item or its submenu
  const isActive = item.href === pathname || 
    item.submenu?.some(sub => pathname.startsWith(sub.href));

  const content = (
    <>
      {/* Chevron for items with submenu */}
      {hasSubmenu && (
        <ChevronRight 
          className={`w-4 h-4 transition-transform duration-200 ${
            isPinned ? 'rotate-90' : ''
          }`}
        />
      )}
      
      {/* Icon */}
      <Icon className="w-5 h-5 flex-shrink-0" />
      
      {/* Label */}
      <span className="flex-1 text-sm font-medium">{item.label}</span>
      
      {/* Badge */}
      {item.badge && <MenuBadge value={item.badge} />}
    </>
  );

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Main Menu Item */}
      {item.href && !hasSubmenu ? (
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
            isActive || isPinned
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {content}
        </button>
      )}

      {/* Fly-out Submenu (on hover, not pinned) */}
      {isHovered && hasSubmenu && !isPinned && (
        <SubmenuFlyout
          items={item.submenu!}
          onClose={onMouseLeave}
        />
      )}

      {/* Vertical Submenu (when pinned) */}
      {isPinned && hasSubmenu && (
        <SubmenuVertical items={item.submenu!} />
      )}
    </div>
  );
}



