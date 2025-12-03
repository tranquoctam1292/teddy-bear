// Admin Layout - Wrapper for admin pages
import type { Metadata } from 'next';
import AdminProviders from './providers';
import AdminSidebarV2 from '@/components/admin/AdminSidebarV2';

export const metadata: Metadata = {
  title: 'Admin - The Emotional House',
  description: 'Admin dashboard for The Emotional House',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebarV2 />
        {/* Main content area */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile header spacing */}
          <div className="lg:hidden h-14" />
          {children}
        </div>
      </div>
    </AdminProviders>
  );
}
