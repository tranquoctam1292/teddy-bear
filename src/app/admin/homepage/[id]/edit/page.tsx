// Admin: Edit Homepage Configuration
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomepageEditor } from '@/components/admin/homepage/HomepageEditor';

export const metadata: Metadata = {
  title: 'Edit Homepage Configuration | Admin',
  description: 'Edit homepage configuration',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditHomepageConfigPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch configuration
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/homepage/configs/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    notFound();
  }

  const data = await response.json();
  const config = data.config;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/homepage">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {config.name}
            </h1>
            <p className="text-muted-foreground">
              Edit homepage configuration
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/?preview=${config._id}`} target="_blank">
              Preview
            </Link>
          </Button>
          {config.status !== 'published' && (
            <Button asChild>
              <Link href={`/admin/homepage/${config._id}/publish`}>
                Publish
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {config.status === 'published' && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            ✓ This configuration is currently published and active on your homepage
          </p>
        </div>
      )}

      {/* Editor */}
      <HomepageEditor config={config} />
    </div>
  );
}

