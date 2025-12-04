'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface HomepageFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    description?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
}

export function HomepageForm({ action, defaultValues }: HomepageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Client-side validation
    const name = formData.get('name') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    const newErrors: Record<string, string> = {};

    if (!name || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!seoTitle || seoTitle.length < 10) {
      newErrors.seoTitle = 'SEO title must be at least 10 characters';
    }

    if (seoTitle && seoTitle.length > 60) {
      newErrors.seoTitle = 'SEO title should not exceed 60 characters';
    }

    if (!seoDescription || seoDescription.length < 50) {
      newErrors.seoDescription = 'SEO description must be at least 50 characters';
    }

    if (seoDescription && seoDescription.length > 160) {
      newErrors.seoDescription = 'SEO description should not exceed 160 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await action(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save configuration. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General information about this homepage configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Configuration Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Summer Sale 2024"
                  defaultValue={defaultValues?.name}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  A descriptive name to identify this configuration
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this homepage configuration..."
                  defaultValue={defaultValues?.description}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Internal notes about this configuration
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your homepage for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="seoTitle">
                  Page Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  placeholder="Best Teddy Shop - Quality Toys for Kids"
                  defaultValue={defaultValues?.seoTitle}
                  maxLength={60}
                  required
                />
                {errors.seoTitle && (
                  <p className="text-sm text-red-500">{errors.seoTitle}</p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Appears in search results and browser tab</span>
                  <span>
                    {(defaultValues?.seoTitle?.length || 0)}/60
                  </span>
                </div>
              </div>

              {/* SEO Description */}
              <div className="space-y-2">
                <Label htmlFor="seoDescription">
                  Meta Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  placeholder="Shop our collection of high-quality teddy bears and toys for children of all ages. Free shipping on orders over $50."
                  defaultValue={defaultValues?.seoDescription}
                  maxLength={160}
                  rows={3}
                  required
                />
                {errors.seoDescription && (
                  <p className="text-sm text-red-500">{errors.seoDescription}</p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Appears below title in search results</span>
                  <span>
                    {(defaultValues?.seoDescription?.length || 0)}/160
                  </span>
                </div>
              </div>

              {/* SEO Tips */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900">SEO Tips</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Keep title between 50-60 characters</li>
                  <li>• Keep description between 120-160 characters</li>
                  <li>• Include your main keywords naturally</li>
                  <li>• Make it compelling to increase click-through rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues ? 'Save Changes' : 'Create & Continue'}
        </Button>
      </div>
    </form>
  );
}

