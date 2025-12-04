// Admin: Create New Homepage Configuration
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomepageForm } from '@/components/admin/homepage/HomepageForm';

export const metadata: Metadata = {
  title: 'New Homepage Configuration | Admin',
  description: 'Create a new homepage configuration',
};

export default function NewHomepageConfigPage() {
  async function createConfig(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/homepage/configs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            slug: name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
            status: 'draft',
            sections: [],
            seo: {
              title: seoTitle,
              description: seoDescription,
            },
          }),
        }
      );

      const data = await response.json();

      // Handle standardized error response
      if (!response.ok || !data.success) {
        const errorMessage =
          data.error?.message || 'Failed to create configuration';
        throw new Error(errorMessage);
      }

      // Return id instead of redirect (redirect doesn't work from Client Component)
      return { success: true, id: data.data.config._id };
    } catch (error) {
      console.error('Error creating config:', error);
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/homepage">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Homepage Configuration
          </h1>
          <p className="text-muted-foreground">
            Create a new homepage configuration to get started
          </p>
        </div>
      </div>

      {/* Form */}
      <HomepageForm action={createConfig} />
    </div>
  );
}

