// Admin Layout - Wrapper for admin pages
import type { Metadata } from 'next';
import AdminProviders from './providers';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        {/* Main content area with left margin for sidebar */}
        <div className="lg:ml-72">
          {children}
        </div>
      </div>
    </AdminProviders>
  );
}
