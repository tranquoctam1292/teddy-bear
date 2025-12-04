'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreHorizontal,
  Edit,
  Eye,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Archive,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface HomepageConfig {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  sections: any[];
  createdAt: string;
  updatedAt: string;
}

interface HomepageConfigTableProps {
  status: string;
  search: string;
  page: number;
}

export function HomepageConfigTable({
  status,
  search,
  page,
}: HomepageConfigTableProps) {
  const router = useRouter();
  const [configs, setConfigs] = useState<HomepageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchConfigs();
  }, [status, search, page]);

  async function fetchConfigs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (status !== 'all') params.append('status', status);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/homepage/configs?${params}`);
      const data = await response.json();

      setConfigs(data.configs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(id: string) {
    if (!confirm('Make this configuration active? This will replace the current homepage.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homepage/configs/${id}/publish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to publish');

      alert('Configuration published successfully!');
      fetchConfigs();
      router.refresh();
    } catch (error) {
      alert('Failed to publish configuration');
    }
  }

  async function handleDuplicate(id: string, name: string) {
    if (!confirm(`Duplicate "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/homepage/configs/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to duplicate');

      const data = await response.json();
      alert('Configuration duplicated successfully!');
      router.push(`/admin/homepage/${data.config._id}/edit`);
    } catch (error) {
      alert('Failed to duplicate configuration');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homepage/configs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      alert('Configuration deleted successfully!');
      fetchConfigs();
    } catch (error: any) {
      alert(error.message || 'Failed to delete configuration');
    }
  }

  if (loading) {
    return <TableSkeleton />;
  }

  if (configs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No configurations found</h3>
        <p className="text-sm text-muted-foreground">
          {search
            ? 'Try adjusting your search or filters'
            : 'Get started by creating a new configuration'}
        </p>
        {!search && (
          <Button asChild className="mt-4">
            <Link href="/admin/homepage/new">Create Configuration</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config._id}>
                <TableCell>
                  <div>
                    <Link
                      href={`/admin/homepage/${config._id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {config.name}
                    </Link>
                    {config.description && (
                      <p className="text-sm text-muted-foreground">
                        {config.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={config.status} date={config.publishedAt || config.scheduledAt} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {config.sections?.length || 0} sections
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(config.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/homepage/${config._id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/?preview=${config._id}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {config.status !== 'published' && (
                        <DropdownMenuItem onClick={() => handlePublish(config._id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDuplicate(config._id, config.name)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(config._id, config.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}{' '}
            configurations
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => router.push(`?page=${page - 1}`)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * 20 >= total}
              onClick={() => router.push(`?page=${page + 1}`)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, date }: { status: string; date?: string }) {
  const badges = {
    published: (
      <Badge className="bg-green-500">
        <CheckCircle className="mr-1 h-3 w-3" />
        Published
      </Badge>
    ),
    draft: (
      <Badge variant="secondary">
        <FileText className="mr-1 h-3 w-3" />
        Draft
      </Badge>
    ),
    scheduled: (
      <Badge variant="outline">
        <Clock className="mr-1 h-3 w-3" />
        Scheduled
      </Badge>
    ),
    archived: (
      <Badge variant="outline" className="text-muted-foreground">
        <Archive className="mr-1 h-3 w-3" />
        Archived
      </Badge>
    ),
  };

  return (
    <div className="flex flex-col gap-1">
      {badges[status as keyof typeof badges] || badges.draft}
      {date && (
        <span className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

