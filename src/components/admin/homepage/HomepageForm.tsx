'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { homepageFormSchema, type HomepageFormFormData } from '@/lib/schemas/homepage';
import { useToast } from '@/hooks/use-toast';

interface HomepageFormProps {
  action: (
    formData: FormData
  ) => Promise<
    | { success: true; id: string }
    | { success: false; error: { code: string; message: string } }
    | void
  >;
  defaultValues?: {
    name?: string;
    description?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
}

export function HomepageForm({ action, defaultValues }: HomepageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    watch,
  } = useForm<HomepageFormFormData>({
    resolver: zodResolver(homepageFormSchema),
    mode: 'onChange', // Validate on change for better UX
    reValidateMode: 'onChange', // Re-validate on change
    shouldFocusError: true, // Focus first error field on submit
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      seoTitle: defaultValues?.seoTitle || '',
      seoDescription: defaultValues?.seoDescription || '',
    },
  });


  const seoTitleLength = watch('seoTitle')?.length || 0;
  const seoDescriptionLength = watch('seoDescription')?.length || 0;

  const onSubmit = async (data: HomepageFormFormData) => {
    try {
      // Convert form data to FormData for Server Action compatibility
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('seoTitle', data.seoTitle);
      formData.append('seoDescription', data.seoDescription);

      const result = await action(formData);

      // Check if result contains error (from Server Action)
      if (result && typeof result === 'object' && 'success' in result && !result.success) {
        // Handle error response from Server Action
        const errorMessage =
          result.error?.message || 'Không thể lưu cấu hình. Vui lòng thử lại.';
        
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: errorMessage,
        });
        return; // Exit early, don't proceed with redirect
      }

      // Handle redirect for create flow (when id is returned)
      if (result && typeof result === 'object' && 'id' in result && result.id) {
        // Show success toast
        toast({
          variant: 'default',
          title: 'Thành công!',
          description: 'Cấu hình trang chủ đã được tạo. Đang chuyển đến trang chỉnh sửa...',
        });
        // Small delay to show toast before redirect
        setTimeout(() => {
          router.push(`/admin/homepage/${result.id}/edit`);
        }, 500);
      } else {
        // For update flow (no redirect needed)
        toast({
          variant: 'default',
          title: 'Đã lưu!',
          description: 'Cấu hình đã được cập nhật thành công.',
        });
      }
    } catch (error) {
      console.error('[HomepageForm] Form submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Không thể lưu cấu hình. Vui lòng thử lại.';
      
      // Show error toast
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-12rem)]">
      {/* Form Container with Max Width */}
      <form id="homepage-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    General information about this homepage configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Configuration Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Sale 2024"
                  {...register('name')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-red-600 mt-1" role="alert">
                    ⚠️ {errors.name.message}
                  </p>
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
                  placeholder="Brief description of this homepage configuration..."
                  {...register('description')}
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
            <TabsContent value="seo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your homepage for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
              {/* SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="seoTitle">
                  Page Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="seoTitle"
                  placeholder="Best Teddy Shop - Quality Toys for Kids"
                  maxLength={60}
                  {...register('seoTitle')}
                  aria-invalid={errors.seoTitle ? 'true' : 'false'}
                  className={errors.seoTitle ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.seoTitle && (
                  <p className="text-sm font-medium text-red-600 mt-1" role="alert">
                    ⚠️ {errors.seoTitle.message}
                  </p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Appears in search results and browser tab</span>
                  <span className={seoTitleLength > 60 ? 'text-red-500' : ''}>
                    {seoTitleLength}/60
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
                  placeholder="Shop our collection of high-quality teddy bears and toys for children of all ages. Free shipping on orders over $50."
                  maxLength={160}
                  rows={3}
                  {...register('seoDescription')}
                  aria-invalid={errors.seoDescription ? 'true' : 'false'}
                  className={errors.seoDescription ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.seoDescription && (
                  <p className="text-sm font-medium text-red-600 mt-1" role="alert">
                    ⚠️ {errors.seoDescription.message}
                  </p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Appears below title in search results</span>
                  <span className={seoDescriptionLength > 160 ? 'text-red-500' : ''}>
                    {seoDescriptionLength}/160
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

          {/* Validation Summary - Always visible when errors exist */}
          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Vui lòng sửa các lỗi sau để tiếp tục:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                    {errors.name && <li><strong>Configuration Name:</strong> {errors.name.message}</li>}
                    {errors.seoTitle && <li><strong>Page Title:</strong> {errors.seoTitle.message}</li>}
                    {errors.seoDescription && (
                      <li><strong>Meta Description:</strong> {errors.seoDescription.message}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Inside form but positioned at bottom */}
          <div className="flex justify-end gap-4 pt-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {defaultValues ? 'Save Changes' : 'Create & Continue'}
            </Button>
          </div>
        </div>
      </form>

      {/* Sticky Action Bar - Mobile only for better UX on scroll */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-10 lg:hidden">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="homepage-form"
              disabled={isSubmitting || !isValid}
              size="sm"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {defaultValues ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

