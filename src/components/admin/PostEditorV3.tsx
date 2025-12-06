'use client';

// WordPress-Style Post Editor V3 - Modular & Clean
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Code, Clock, Check } from 'lucide-react';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';
import { analyzeSEO, type SEOAnalysisResult } from '@/lib/seo/analysis-client';
import { saveAnalysisToDatabase } from '@/lib/seo/analysis-save';
import EditorLayout from './EditorLayout';
import RichTextEditor from './RichTextEditor';
import GoogleSnippetPreview from './seo/GoogleSnippetPreview';
import SchemaBuilder from './seo/SchemaBuilder';
import { PublishBox, FeaturedImageBox, GalleryBox, CategoryBox, TagBox, SEOScoreBox } from './sidebar';
import AuthorBoxWidget from './posts/AuthorBoxWidget';
import ProductPickerWidget from './posts/product-picker-widget';
import ReadingTimeDisplay from './posts/reading-time-display';
import TemplateSelector from './posts/template-selector';
import DynamicTemplateFields from './posts/dynamic-template-fields';
import { PostAuthorInfo } from '@/lib/types/author';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ROBOTS_OPTIONS } from '@/lib/schemas/seo';
import { generateSlug } from '@/lib/utils/slug';

// Schemas
const seoSchema = z.object({
  canonicalUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  robots: z.enum(['index, follow', 'noindex, follow', 'noindex, nofollow']).optional(),
  focusKeyword: z.string().optional(),
  altText: z.string().optional(),
});

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']),
  publishDate: z.string().optional(),
  seo: seoSchema.optional(),
  // 🆕 Phase 2: New fields
  linkedProducts: z.array(z.object({
    productId: z.string(),
    position: z.enum(['inline', 'sidebar', 'bottom']),
    displayType: z.enum(['card', 'spotlight', 'cta']),
    customMessage: z.string().optional(),
  })).optional(),
  readingTime: z.number().int().min(0).optional(),
  template: z.enum(['default', 'gift-guide', 'review', 'care-guide', 'story']).optional(),
  templateData: z.record(z.any()).optional(),
  comparisonTable: z.object({
    products: z.array(z.string()),
    features: z.array(z.object({
      name: z.string(),
      values: z.record(z.union([z.string(), z.number(), z.boolean()])),
    })),
    displayOptions: z.object({
      showImages: z.boolean().optional(),
      showPrices: z.boolean().optional(),
      highlightBest: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

type PostFormInput = z.infer<typeof postSchema>;

interface PostEditorV3Props {
  post?: Post;
  onSubmit: (data: PostFormData) => Promise<{ post?: Post } | void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PostEditorV3({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
}: PostEditorV3Props) {
  // State
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [seoScore, setSeoScore] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);
  const [schemaData, setSchemaData] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Author Info (E-E-A-T SEO)
  const [authorInfo, setAuthorInfo] = useState<PostAuthorInfo | undefined>(
    (post as any)?.authorInfo
  );

  // Form
  const methods = useForm<PostFormInput>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords?.join(', ') || '',
          featuredImage: post.featuredImage || '',
          category: post.category || '',
          tags: post.tags || [],
          status: post.status,
          publishDate: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
          seo: post.seo || {},
          // 🆕 Phase 2: New fields
          linkedProducts: post.linkedProducts || [],
          readingTime: post.readingTime,
          template: post.template || 'default',
          templateData: post.templateData || {},
          comparisonTable: post.comparisonTable,
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          metaTitle: '',
          metaDescription: '',
          keywords: '',
          featuredImage: '',
          category: '',
          tags: [],
          status: 'draft',
          publishDate: '',
          seo: {},
          // 🆕 Phase 2: New fields
          linkedProducts: [],
          readingTime: undefined,
          template: 'default',
          templateData: {},
          comparisonTable: undefined,
        },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = methods;

  const watchedValues = watch();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title, { shouldDirty: true });
    if (!post) {
      setValue('slug', generateSlug(title));
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    if (isDirty && !isLoading) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          setIsSaving(true);
          const draftKey = `post-draft-${post?.id || 'new'}`;
          localStorage.setItem(draftKey, JSON.stringify({
            ...watchedValues,
            savedAt: new Date().toISOString(),
          }));
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save error:', error);
        } finally {
          setIsSaving(false);
        }
      }, 3000);
    }
  }, [watchedValues, isDirty, isLoading, post]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `post-draft-${post?.id || 'new'}`;
    const saved = localStorage.getItem(draftKey);
    if (saved && !post) {
      try {
        const draft = JSON.parse(saved);
        setDraftData(draft);
        setShowDraftModal(true);
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(draftKey);
      }
    }
  }, [post]);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    if (draftData) {
      Object.keys(draftData).forEach(key => {
        if (key !== 'savedAt') {
          setValue(key as any, draftData[key]);
        }
      });
      setShowDraftModal(false);
      setDraftData(null);
    }
  };

  // Handle draft discard
  const handleDiscardDraft = () => {
    const draftKey = `post-draft-${post?.id || 'new'}`;
    localStorage.removeItem(draftKey);
    setShowDraftModal(false);
    setDraftData(null);
  };

  // SEO Analysis
  useEffect(() => {
    const runAnalysis = async () => {
      const analysis = await analyzeSEO({
        title: watchedValues.metaTitle || watchedValues.title,
        description: watchedValues.metaDescription || watchedValues.excerpt || '',
        content: watchedValues.content,
        focusKeyword: watchedValues.seo?.focusKeyword || '',
        url: watchedValues.slug ? `/blog/${watchedValues.slug}` : undefined,
      });
      setSeoAnalysis(analysis);
    };

    const timer = setTimeout(runAnalysis, 1000);
    return () => clearTimeout(timer);
  }, [watchedValues, images]);

  // Form submit - Save as draft
  const handleFormSubmit = async (data: PostFormInput) => {
    const keywordsArray = data.keywords
      ? data.keywords.split(',').map((k) => k.trim()).filter(k => k.length > 0)
      : [];

    const submitData: PostFormData = {
      ...data,
      status: 'draft', // Always save as draft when using handleFormSubmit
      keywords: keywordsArray,
      publishedAt: data.publishDate ? new Date(data.publishDate) : undefined,
      authorInfo, // Add author information (E-E-A-T SEO)
    };

    const result = await onSubmit(submitData);

    // Save SEO analysis
    if (seoAnalysis && data.slug) {
      const postId = post?.id || (result as any)?.post?.id;
      if (postId) {
        await saveAnalysisToDatabase(seoAnalysis, 'post', postId, data.slug).catch(console.error);
      }
    }
  };

  // Form submit - Publish
  const handlePublishSubmit = async (data: PostFormInput) => {
    const keywordsArray = data.keywords
      ? data.keywords.split(',').map((k) => k.trim()).filter(k => k.length > 0)
      : [];

    const submitData: PostFormData = {
      ...data,
      status: 'published', // Set status to published when clicking "Xuất bản"
      keywords: keywordsArray,
      publishedAt: data.publishDate ? new Date(data.publishDate) : new Date(), // Set publishedAt if not set
      authorInfo, // Add author information (E-E-A-T SEO)
    };

    const result = await onSubmit(submitData);

    // Save SEO analysis
    if (seoAnalysis && data.slug) {
      const postId = post?.id || (result as any)?.post?.id;
      if (postId) {
        await saveAnalysisToDatabase(seoAnalysis, 'post', postId, data.slug).catch(console.error);
      }
    }
  };

  // Main Content
  const mainContent = (
    <section className="space-y-4">
      {/* Title & Slug */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Input
              {...register('title')}
              onChange={handleTitleChange}
              placeholder="Nhập tiêu đề bài viết"
              className="text-2xl font-bold border-0 px-0 focus:ring-0 placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('slug')}
              placeholder="slug-bai-viet"
              className="text-sm text-gray-600"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Selector */}
      <TemplateSelector />

      {/* Rich Text Editor */}
      <Card>
        <CardContent className="p-0">
          <RichTextEditor
            content={watchedValues.content || ''}
            onChange={(html) => setValue('content', html, { shouldDirty: true })}
            placeholder="Bắt đầu viết nội dung bài viết của bạn..."
            minHeight="500px"
          />
        </CardContent>
      </Card>

      {/* Dynamic Template Fields */}
      <DynamicTemplateFields />

      {/* SEO Section (Collapsed) */}
      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="seo" className="border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                🎯 Tối ưu hóa công cụ tìm kiếm (SEO)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Google Preview */}
                <GoogleSnippetPreview
                  title={watchedValues.metaTitle || watchedValues.title}
                  description={watchedValues.metaDescription || watchedValues.excerpt || ''}
                  url={`emotionalhouse.vn/blog/${watchedValues.slug || 'your-post'}`}
                />

                {/* SEO Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề Meta
                    </label>
                    <Input
                      {...register('metaTitle')}
                      placeholder="Để trống để dùng tiêu đề bài viết"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả Meta
                    </label>
                    <textarea
                      {...register('metaDescription')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Để trống để dùng trích dẫn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ khóa chính
                    </label>
                    <Input
                      {...register('seo.focusKeyword')}
                      placeholder="Từ khóa chính cho bài viết này"
                    />
                  </div>
                </div>

                {/* Advanced SEO */}
                <Accordion type="single" collapsible className="border rounded-lg">
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="px-4 text-sm">
                      Cài đặt SEO nâng cao
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL chuẩn (Canonical)
                        </label>
                        <Input
                          {...register('seo.canonicalUrl')}
                          type="url"
                          placeholder="https://example.com/canonical-url"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thẻ Robots Meta
                        </label>
                        <select
                          {...register('seo.robots')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {ROBOTS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Schema Markup
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowSchemaBuilder(true)}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          {schemaData ? 'Chỉnh sửa Schema' : 'Thêm Schema'}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );

  // Sidebar
  const sidebar = (
    <>
      <PublishBox
        status={watchedValues.status}
        onStatusChange={(s) => setValue('status', s as any)}
        publishDate={watchedValues.publishDate}
        onDateChange={(d) => setValue('publishDate', d)}
        onSave={handleSubmit(handleFormSubmit)}
        onPublish={handleSubmit(handlePublishSubmit)}
        onPreview={() => {
          // Preview với draft mode - cần có post ID và slug
          if (!post?.id) {
            alert('Vui lòng lưu bài viết trước khi xem trước');
            return;
          }
          
          // Use slug if available, otherwise use post ID
          const previewSlug = watchedValues.slug || post.slug || post.id;
          if (!previewSlug) {
            alert('Vui lòng nhập slug trước khi xem trước');
            return;
          }
          
          // Open preview with post ID in query param for better reliability
          window.open(`/blog/${previewSlug}?preview=true&id=${post.id}`, '_blank');
        }}
        isLoading={isLoading}
        isDirty={isDirty}
        lastSaved={lastSaved}
      />

      <FeaturedImageBox
        value={watchedValues.featuredImage}
        onChange={(url) => setValue('featuredImage', url, { shouldDirty: true })}
        onRemove={() => setValue('featuredImage', '', { shouldDirty: true })}
      />

      <GalleryBox
        images={images}
        onAdd={(urls) => setImages([...images, ...urls])}
        onRemove={(index) => setImages(images.filter((_, i) => i !== index))}
        maxImages={10}
      />

      <CategoryBox
        categories={[
          { id: 'news', name: 'Tin tức', count: 15 },
          { id: 'guide', name: 'Hướng dẫn', count: 8 },
          { id: 'tips', name: 'Mẹo hay', count: 12 },
        ]}
        selected={watchedValues.category ? [watchedValues.category] : []}
        onChange={(cats) => setValue('category', cats[0] || '')}
        allowMultiple={false}
        title="Danh mục bài viết"
      />

      <TagBox
        tags={watchedValues.tags}
        onChange={(t) => setValue('tags', t)}
        suggestions={['gấu bông', 'quà tặng', 'teddy', 'plush', 'handmade']}
      />

      <AuthorBoxWidget
        value={authorInfo}
        onChange={setAuthorInfo}
      />

      <ReadingTimeDisplay />

      <ProductPickerWidget />

      <SEOScoreBox
        data={{
          keyword: watchedValues.seo?.focusKeyword || '',
          title: watchedValues.metaTitle || watchedValues.title,
          description: watchedValues.metaDescription || watchedValues.excerpt || '',
          content: watchedValues.content,
          slug: watchedValues.slug,
          featuredImage: watchedValues.featuredImage,
        }}
        onScoreChange={setSeoScore}
      />
    </>
  );

  // Mobile Actions
  const mobileActions = (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={onCancel}
        variant="outline"
        className="flex-1"
      >
        Hủy
      </Button>
      <Button
        type="button"
        onClick={handleSubmit(handleFormSubmit)}
        className="flex-1"
        disabled={isLoading}
      >
        {watchedValues.status === 'published' ? 'Xuất bản' : 'Lưu'}
      </Button>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <EditorLayout
          title={post ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          subtitle="Modern CMS Editor • Auto-save • SEO Intelligence"
          mainContent={mainContent}
          sidebar={sidebar}
          isFullscreen={isFullscreen}
          mobileActions={mobileActions}
        />
      </form>

      {/* Auto-save Indicator */}
      {lastSaved && (
        <aside className="fixed bottom-4 left-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm" role="status" aria-live="polite">
          <Check className="h-4 w-4" />
          Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN')}
        </aside>
      )}

      {/* Draft Restoration Modal */}
      {showDraftModal && draftData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Phát hiện bản nháp chưa lưu
                </h3>
                <p className="text-sm text-gray-600">
                  Tìm thấy bản nháp được lưu tự động lúc{' '}
                  <span className="font-medium text-gray-900">
                    {new Date(draftData.savedAt).toLocaleString('vi-VN')}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscardDraft}
              >
                Xóa bản nháp
              </Button>
              <Button
                type="button"
                onClick={handleRestoreDraft}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Khôi phục
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schema Builder Modal */}
      <SchemaBuilder
        isOpen={showSchemaBuilder}
        onClose={() => setShowSchemaBuilder(false)}
        onApply={(schema) => setSchemaData(schema)}
      />
    </FormProvider>
  );
}

