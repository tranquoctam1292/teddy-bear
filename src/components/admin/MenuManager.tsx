'use client';

// Menu Manager Component for Admin
import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Save,
  X,
} from 'lucide-react';
import type { NavigationMenu, NavigationMenuItem } from '@/lib/schemas/navigation';
import { MENU_LOCATIONS } from '@/lib/schemas/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

// Validation Schema
const menuItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Label là bắt buộc'),
  url: z.string().min(1, 'URL là bắt buộc'),
  type: z.enum(['category', 'internal_page', 'external_url']),
  order: z.number(),
  children: z.array(z.any()).optional(),
  openInNewTab: z.boolean().optional(),
});

const menuSchema = z.object({
  location: z.string().min(1, 'Location là bắt buộc'),
  name: z.string().min(1, 'Name là bắt buộc'),
  items: z.array(menuItemSchema).default([]),
  isActive: z.boolean().default(true),
});

type MenuFormData = z.infer<typeof menuSchema>;

interface MenuManagerProps {
  menu?: NavigationMenu;
  onSubmit: (data: MenuFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function MenuManager({
  menu,
  onSubmit,
  onCancel,
  isLoading = false,
}: MenuManagerProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: menu
      ? {
          location: menu.location,
          name: menu.name,
          items: menu.items || [],
          isActive: menu.isActive,
        }
      : {
          location: MENU_LOCATIONS.MAIN_HEADER,
          name: '',
          items: [],
          isActive: true,
        },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
    swap: swapItems,
  } = useFieldArray({
    control,
    name: 'items',
  });

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const addMenuItem = (parentId?: string) => {
    const newItem: NavigationMenuItem = {
      id: '',
      label: '',
      url: '',
      type: 'internal_page',
      order: itemFields.length,
    };

    if (parentId) {
      // Add as child
      const parentIndex = itemFields.findIndex((item) => item.id === parentId);
      if (parentIndex !== -1) {
        const parent = itemFields[parentIndex];
        const children = (parent.children as NavigationMenuItem[]) || [];
        const updatedParent = {
          ...parent,
          children: [...children, { ...newItem, order: children.length }],
        };
        setValue(`items.${parentIndex}`, updatedParent);
      }
    } else {
      // Add as top-level item
      appendItem(newItem);
    }
  };

  const removeMenuItem = (index: number, parentIndex?: number) => {
    if (parentIndex !== undefined) {
      // Remove child item
      const parent = itemFields[parentIndex];
      const children = (parent.children as NavigationMenuItem[]) || [];
      children.splice(index, 1);
      setValue(`items.${parentIndex}.children`, children);
    } else {
      // Remove top-level item
      removeItem(index);
    }
  };

  const moveMenuItemUp = (index: number) => {
    if (index > 0) {
      swapItems(index, index - 1);
      // Update order values
      const items = watch('items');
      items.forEach((item, idx) => {
        setValue(`items.${idx}.order`, idx);
      });
    }
  };

  const moveMenuItemDown = (index: number) => {
    if (index < itemFields.length - 1) {
      swapItems(index, index + 1);
      // Update order values
      const items = watch('items');
      items.forEach((item, idx) => {
        setValue(`items.${idx}.order`, idx);
      });
    }
  };

  const renderMenuItem = (
    item: NavigationMenuItem,
    index: number,
    parentIndex?: number,
    level: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id || `item-${index}`);
    const fieldPath = parentIndex !== undefined
      ? `items.${parentIndex}.children.${index}`
      : `items.${index}`;

    return (
      <div
        key={item.id || `item-${index}`}
        className={`border border-gray-200 rounded-md mb-2 ${
          level > 0 ? 'ml-8 bg-gray-50' : 'bg-white'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Move Buttons - Only for top-level items */}
            {parentIndex === undefined && (
              <div className="flex flex-col pt-2 gap-1">
                <button
                  type="button"
                  onClick={() => moveMenuItemUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Di chuyển lên"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveMenuItemDown(index)}
                  disabled={index >= itemFields.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Di chuyển xuống"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Expand/Collapse Button */}
            {hasChildren && (
              <button
                type="button"
                onClick={() => toggleExpand(item.id || `item-${index}`)}
                className="pt-2 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Label */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register(`${fieldPath}.label` as const)}
                  placeholder="Menu label"
                  className="text-sm"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register(`${fieldPath}.url` as const)}
                  placeholder="/products or https://..."
                  className="text-sm"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  {...register(`${fieldPath}.type` as const)}
                  className="text-sm"
                >
                  <option value="internal_page">Trang nội bộ</option>
                  <option value="category">Danh mục</option>
                  <option value="external_url">URL ngoài</option>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-start gap-2 pt-2">
              <button
                type="button"
                onClick={() => addMenuItem(item.id || `item-${index}`)}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Thêm sub-menu"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeMenuItem(index, parentIndex)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="pl-4 pr-4 pb-4 space-y-2">
            {item.children?.map((child, childIndex) =>
              renderMenuItem(child, childIndex, parentIndex !== undefined ? parentIndex : index, level + 1)
            )}
            <button
              type="button"
              onClick={() => addMenuItem(item.id || `item-${index}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              Thêm sub-menu
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Menu Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Select {...register('location')} disabled={!!menu}>
              <option value={MENU_LOCATIONS.MAIN_HEADER}>Main Header</option>
              <option value={MENU_LOCATIONS.FOOTER_SITEMAP}>Footer Sitemap</option>
              <option value={MENU_LOCATIONS.FOOTER_ABOUT}>Footer About</option>
              <option value={MENU_LOCATIONS.FOOTER_SUPPORT}>Footer Support</option>
            </Select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên menu <span className="text-red-500">*</span>
            </label>
            <Input {...register('name')} placeholder="Main Shop Navigation" />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-sm text-gray-700">Menu đang hoạt động</span>
          </label>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => addMenuItem()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm menu item
          </Button>
        </div>

        {itemFields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500 mb-4">Chưa có menu item nào</p>
            <Button type="button" variant="outline" onClick={() => addMenuItem()}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm menu item đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {itemFields.map((item, index) => renderMenuItem(item, index))}
          </div>
        )}

        {errors.items && (
          <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu menu
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

