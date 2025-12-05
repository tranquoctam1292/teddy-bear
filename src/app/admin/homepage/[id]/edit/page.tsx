// Admin: Edit Homepage Configuration
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomepageEditor } from '@/components/admin/homepage/HomepageEditor';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

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
  // Check authentication
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    notFound();
  }

  const { id } = await params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    notFound();
  }

  // Fetch configuration directly from database
  try {
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    const config = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    if (!config) {
      notFound();
    }

    // Convert ObjectId to string for client
    const configWithStringId = {
      ...config,
      _id: config._id.toString(),
    };

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
                {configWithStringId.name}
              </h1>
              <p className="text-muted-foreground">
                Edit homepage configuration
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/?preview=${configWithStringId._id}`} target="_blank">
                Preview
              </Link>
            </Button>
            {configWithStringId.status !== 'published' && (
              <Button asChild>
                <Link href={`/admin/homepage/${configWithStringId._id}/publish`}>
                  Publish
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {configWithStringId.status === 'published' && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              ✓ This configuration is currently published and active on your homepage
            </p>
          </div>
        )}

        {/* Editor */}
        <HomepageEditor config={configWithStringId} />
      </div>
    );
  } catch (error) {
    console.error('[EditHomepageConfigPage] Error fetching config:', error);
    notFound();
  }
}

