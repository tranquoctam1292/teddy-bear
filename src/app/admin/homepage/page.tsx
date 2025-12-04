// Admin: Homepage Manager - List all configurations
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { HomepageConfigTable } from '@/components/admin/homepage/HomepageConfigTable';

export const metadata: Metadata = {
  title: 'Homepage Manager | Admin',
  description: 'Manage homepage configurations',
};

interface PageProps {
  searchParams: {
    status?: string;
    search?: string;
    page?: string;
  };
}

export default async function HomepageManagerPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15
  const params = await Promise.resolve(searchParams);
  const status = params.status || 'all';
  const search = params.search || '';
  const page = parseInt(params.page || '1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Manager</h1>
          <p className="text-muted-foreground">
            Create and manage homepage configurations
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/homepage/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Configuration
          </Link>
        </Button>
      </div>

      {/* Active Configuration Alert */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ActiveConfigAlert />
      </Suspense>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search configurations..."
            className="pl-8"
            defaultValue={search}
            name="search"
          />
        </div>
        <Select defaultValue={status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Suspense fallback={<TableSkeleton />}>
        <HomepageConfigTable
          status={status}
          search={search}
          page={page}
        />
      </Suspense>
    </div>
  );
}

// Active Configuration Alert
async function ActiveConfigAlert() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/homepage/configs/active`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const activeConfig = data.config;

    if (!activeConfig) {
      return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ No active homepage configuration. Visitors will see the default homepage.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          ✓ Active Configuration:{' '}
          <Link
            href={`/admin/homepage/${activeConfig._id}/edit`}
            className="font-semibold underline"
          >
            {activeConfig.name}
          </Link>
          {' • '}
          Published {new Date(activeConfig.publishedAt).toLocaleDateString()}
        </p>
      </div>
    );
  } catch (error) {
    console.error('Error fetching active config:', error);
    return null;
  }
}

// Loading Skeleton
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

