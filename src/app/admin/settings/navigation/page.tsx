'use client';

// Admin Navigation Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MenuManager from '@/components/admin/MenuManager';
import type { NavigationMenu } from '@/lib/schemas/navigation';
import { MENU_LOCATIONS } from '@/lib/schemas/navigation';
import { Select } from '@/components/admin/ui/select';
import { Button } from '@/components/admin/ui/button';
import { Trash2 } from 'lucide-react';

export default function AdminNavigationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    MENU_LOCATIONS.MAIN_HEADER
  );
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMenus();
    }
  }, [status]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/navigation');
      if (!response.ok) throw new Error('Failed to fetch menus');

      const data = await response.json();
      setMenus(data.menus || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentMenu = menus.find((m) => m.location === selectedLocation);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      const url = currentMenu
        ? '/api/admin/navigation'
        : '/api/admin/navigation';
      const method = currentMenu ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save menu');
      }

      // Refresh menus
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu menu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa menu này?')) {
      return;
    }

    try {
      setDeleteLoading(selectedLocation);
      const response = await fetch(
        `/api/admin/navigation?location=${selectedLocation}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete menu');
      }

      // Refresh menus and reset selection
      await fetchMenus();
      setSelectedLocation(MENU_LOCATIONS.MAIN_HEADER);
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa menu');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Navigation</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tùy chỉnh menu điều hướng của website
          </p>
        </div>
        <div>
          {currentMenu && (
            <Button
              variant="error"
              onClick={handleDelete}
              disabled={deleteLoading === selectedLocation}
            >
              {deleteLoading === selectedLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa menu
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Menu Location Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn menu để chỉnh sửa
          </label>
          <div className="flex gap-4">
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-64"
            >
              <option value={MENU_LOCATIONS.MAIN_HEADER}>Main Header</option>
              <option value={MENU_LOCATIONS.FOOTER_SITEMAP}>Footer Sitemap</option>
              <option value={MENU_LOCATIONS.FOOTER_ABOUT}>Footer About</option>
              <option value={MENU_LOCATIONS.FOOTER_SUPPORT}>Footer Support</option>
            </Select>
            {!currentMenu && (
              <Button
                onClick={() => {
                  // Create new menu for selected location
                  handleSubmit({
                    location: selectedLocation,
                    name: `Menu for ${selectedLocation}`,
                    items: [],
                    isActive: true,
                  });
                }}
              >
                Tạo menu mới
              </Button>
            )}
          </div>
        </div>

        {/* Menu Manager */}
        {currentMenu ? (
          <MenuManager
            menu={currentMenu}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">
              Chưa có menu cho location này
            </p>
            <Button
              onClick={() => {
                handleSubmit({
                  location: selectedLocation,
                  name: `Menu for ${selectedLocation}`,
                  items: [],
                  isActive: true,
                });
              }}
            >
              Tạo menu mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

