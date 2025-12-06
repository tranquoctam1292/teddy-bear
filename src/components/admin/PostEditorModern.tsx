'use client';

// Modern Post Editor with 2-Column Layout (CMS-style)
import { useEditor, EditorContent } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import StarterKit from '@tiptap/starter-kit';
import CustomImage from '@/components/editor/extensions/CustomImage';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { KeyboardShortcuts } from '@/components/editor/extensions/KeyboardShortcuts';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@/lib/tiptap-extensions/fontSize';
import Youtube from '@tiptap/extension-youtube';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Save, X, Check, Maximize2, Minimize2, Code, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';
import { ROBOTS_OPTIONS } from '@/lib/schemas/seo';
import { type SEOAnalysisResult } from '@/lib/seo/analysis-client';
import { saveAnalysisToDatabase } from '@/lib/seo/analysis-save';
import { generateSlug } from '@/lib/utils/slug';
import GoogleSnippetPreview from './seo/GoogleSnippetPreview';
import ImageBubbleMenu from '@/components/editor/components/ImageBubbleMenu';
import WordPressToolbar from './WordPressToolbar';
import MediaLibrary from './MediaLibrary';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Same schemas as before
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
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  publishDate: z.string().optional(),
  seo: seoSchema.optional(),
  template: z.enum(['default', 'gift-guide', 'review', 'care-guide', 'story']).optional(),
  templateData: z.record(z.any()).optional(),
});

type PostFormInput = z.infer<typeof postSchema> & {
  content: string;
};

interface PostEditorProps {
  post?: Post;
  onSubmit: (data: PostFormData) => Promise<{ post?: Post } | void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PostEditorModern({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
}: PostEditorProps) {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tagInput, setTagInput] = useState('');
  const [seoAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toolbarSticky, setToolbarSticky] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);
  const [schemaData] = useState<any>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formMethods = useForm<PostFormInput>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords?.join(', ') || '',
          featuredImage: post.featuredImage || '',
          category: post.category || '',
          tags: post.tags?.join(', ') || '',
          status: post.status,
          publishDate: post.publishedAt
            ? new Date(post.publishedAt).toISOString().split('T')[0]
            : '',
          content: post.content,
          template: post.template || 'default',
          templateData: post.templateData || {},
          seo: post.seo || {
            canonicalUrl: '',
            robots: 'index, follow',
            focusKeyword: '',
            altText: '',
          },
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          metaTitle: '',
          metaDescription: '',
          keywords: '',
          featuredImage: '',
          category: '',
          tags: '',
          status: 'draft',
          publishDate: '',
          content: '',
          template: 'default',
          templateData: {},
          seo: {
            canonicalUrl: '',
            robots: 'index, follow',
            focusKeyword: '',
            altText: '',
          },
        },
  });

  // Destructure form methods
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = formMethods;

  // Watch form values for auto-save and SEO preview
  const watchedValues = watch();

  // Media Library state
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

  // Tiptap Editor with WordPress-style extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung bài viết của bạn...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      KeyboardShortcuts.configure({
        // onOpenLinkModal will be set by WordPressToolbar via editor storage
        // Extension will check editor.__openLinkModal first
      }),
    ],
    content: post?.content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML(), { shouldDirty: true });
      // Trigger auto-save
      scheduleAutoSave();
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] p-6 w-full',
        style: 'width: 100%; max-width: 100%;',
      },
    },
  });

  // Sticky toolbar disabled - causes overlap issues
  // Toolbar will stay in its original position
  useEffect(() => {
    // Removed sticky functionality to prevent overlap
    setToolbarSticky(false);
  }, []);

  // Auto-save functionality
  const scheduleAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (isDirty && !isLoading) {
        autoSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
  };

  const autoSave = async () => {
    try {
      setIsSaving(true);
      // Save to localStorage as draft
      const formData = watchedValues;
      localStorage.setItem(
        `post-draft-${post?.id || 'new'}`,
        JSON.stringify({
          ...formData,
          content: editor?.getHTML(),
          savedAt: new Date().toISOString(),
        })
      );
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle draft restoration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRestoreDraft = () => {
    if (draftData) {
      Object.keys(draftData).forEach((key) => {
        if (key !== 'savedAt' && key !== 'content') {
          setValue(key as any, draftData[key]);
        }
      });
      editor?.commands.setContent(draftData.content);
      setShowDraftModal(false);
      setDraftData(null);
    }
  };

  // Handle draft discard
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDiscardDraft = () => {
    const draftKey = `post-draft-${post?.id || 'new'}`;
    localStorage.removeItem(draftKey);
    setShowDraftModal(false);
    setDraftData(null);
  };

  // Tag management functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags.join(', '), { shouldDirty: true });
      setTagInput('');
      scheduleAutoSave();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue('tags', newTags.join(', '), { shouldDirty: true });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title, { shouldDirty: true });
    if (!post) {
      setValue('slug', generateSlug(title));
    }
    scheduleAutoSave();
  };

  const handleFormSubmit = async (data: PostFormInput) => {
    const keywordsArray = data.keywords
      ? data.keywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    const seoData = data.seo
      ? {
          ...(data.seo.canonicalUrl && { canonicalUrl: data.seo.canonicalUrl }),
          ...(data.seo.robots && { robots: data.seo.robots }),
          ...(data.seo.focusKeyword && { focusKeyword: data.seo.focusKeyword }),
          ...(data.seo.altText && { altText: data.seo.altText }),
        }
      : undefined;

    // Set publishedAt when publishing (if not already set)
    let publishedAt: Date | undefined;
    if (data.status === 'published') {
      publishedAt = data.publishDate
        ? new Date(data.publishDate)
        : post?.publishedAt
        ? new Date(post.publishedAt)
        : new Date();
    } else if (data.publishDate) {
      publishedAt = new Date(data.publishDate);
    }

    const submitData: PostFormData = {
      ...data,
      tags: tags,
      keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
      seo: seoData && Object.keys(seoData).length > 0 ? seoData : undefined,
      publishedAt,
      template: data.template || 'default',
      templateData: data.templateData || {},
    } as PostFormData;

    try {
      const result = await onSubmit(submitData);

      // Clear auto-save draft after successful save
      localStorage.removeItem(`post-draft-${post?.id || 'new'}`);

      // Show success message
      const isPublishing = data.status === 'published';
      toast({
        variant: 'default',
        title: isPublishing ? 'Đã xuất bản!' : 'Đã lưu nháp!',
        description: isPublishing
          ? 'Bài viết đã được xuất bản thành công. Bạn có thể tiếp tục chỉnh sửa.'
          : 'Bài viết đã được lưu nháp. Bạn có thể tiếp tục chỉnh sửa.',
      });

      // Save SEO analysis
      if (seoAnalysis && data.slug) {
        const postId = post?.id || (result as any)?.post?.id;
        if (postId && postId !== 'new') {
          saveAnalysisToDatabase(seoAnalysis, 'post', postId, data.slug).catch((err) =>
            console.error('Failed to save SEO analysis:', err)
          );
        }
      }
    } catch (error) {
      // Error is already handled by parent component
      // Just re-throw to prevent further execution
      throw error;
    }
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleFormSubmit as any)}>
        {/* Auto-save Indicator */}
        {lastSaved && (
          <div className="fixed bottom-4 left-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Draft saved at {lastSaved.toLocaleTimeString('vi-VN')}
          </div>
        )}

        {/* Sticky Action Bar (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 flex gap-2">
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>

        {/* 2-Column Layout */}
        <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'lg:grid-cols-[1fr_360px]'} gap-6`}>
          {/* LEFT COLUMN - Main Content (70-75%) */}
          <section className="space-y-4">
            {/* Title & Slug */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <Input
                    {...register('title')}
                    onChange={handleTitleChange}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="text-2xl font-bold border-none focus:ring-0 px-0 placeholder:text-gray-300"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">URL:</span>
                  <Input
                    {...register('slug')}
                    placeholder="url-slug"
                    className="flex-1 h-8 text-sm border-gray-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* WordPress-Style Toolbar (Sticky below page header) */}
            <div ref={toolbarRef}>
              <WordPressToolbar
                editor={editor}
                onAddMedia={() => setMediaLibraryOpen(true)}
                onOpenLinkModal={() => {
                  // WordPressToolbar will set editor.__openLinkModal in useEffect
                  // KeyboardShortcuts extension will call it directly
                }}
              />

              {/* Distraction-Free Mode Toggle */}
              <div className="absolute top-2 right-2 hidden lg:block z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Distraction Free
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Media Library Modal */}
            <MediaLibrary
              isOpen={mediaLibraryOpen}
              onClose={() => setMediaLibraryOpen(false)}
              onSelect={(file) => {
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: file.url,
                    alt: file.alt || file.filename,
                  })
                  .run();
                setMediaLibraryOpen(false);
              }}
            />

            {/* Editor Content */}
            <Card>
              <CardContent className="p-0">
                <div className="border border-gray-200 rounded-lg bg-white w-full">
                  <div className="w-full [&_.ProseMirror]:w-full [&_.ProseMirror]:max-w-full [&_.ProseMirror]:px-6 [&_.ProseMirror]:py-6 overflow-hidden rounded-b-lg">
                    <EditorContent editor={editor} />
                    {editor && (
                      <ImageBubbleMenu
                        editor={editor}
                        onReplaceImage={() => setMediaLibraryOpen(true)}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* RIGHT COLUMN - Sidebar (25-30%) */}
          {!isFullscreen && (
            <aside className="hidden lg:block space-y-4">
              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu bài viết
                      </>
                    )}
                  </Button>
                  <Button type="button" onClick={onCancel} variant="outline" className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                </CardContent>
              </Card>

              {/* SEO Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tối ưu hóa công cụ tìm kiếm (SEO)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Google Snippet Preview */}
                  <GoogleSnippetPreview
                    title={watchedValues.metaTitle || watchedValues.title}
                    description={watchedValues.metaDescription || watchedValues.excerpt || ''}
                    url={`https://emotionalhouse.vn/blog/${watchedValues.slug || 'your-post'}`}
                  />

                  {/* Meta Title & Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề Meta
                      </label>
                      <Input
                        {...register('metaTitle')}
                        placeholder="Để trống để dùng tiêu đề bài viết"
                        onChange={() => scheduleAutoSave()}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tối ưu: 30-60 ký tự. Để trống để dùng tiêu đề bài viết.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả Meta
                      </label>
                      <textarea
                        {...register('metaDescription')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Để trống để dùng trích dẫn"
                        onChange={() => scheduleAutoSave()}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tối ưu: 70-160 ký tự. Để trống để dùng trích dẫn.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Từ khóa chính
                      </label>
                      <Input
                        {...register('seo.focusKeyword')}
                        placeholder="Từ khóa chính cho bài viết này"
                        onChange={() => scheduleAutoSave()}
                      />
                    </div>
                  </div>

                  {/* Advanced SEO (Accordion) */}
                  <Accordion type="single" collapsible className="border rounded-lg">
                    <AccordionItem value="advanced">
                      <AccordionTrigger className="px-4">Cài đặt SEO nâng cao</AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              URL chuẩn (Canonical)
                            </label>
                            <Input
                              {...register('seo.canonicalUrl')}
                              type="url"
                              placeholder="https://example.com/canonical-url"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              URL gốc để tránh nội dung trùng lặp.
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Thẻ Robots Meta
                            </label>
                            <select
                              {...register('seo.robots')}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                              {ROBOTS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Từ khóa (phân cách bằng dấu phẩy)
                            </label>
                            <Input
                              {...register('keywords')}
                              placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                            />
                          </div>

                          {/* Schema Markup */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Schema Markup (JSON-LD)
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => setShowSchemaBuilder(true)}
                            >
                              <Code className="w-4 h-4 mr-2" />
                              {schemaData ? 'Chỉnh sửa Schema' : 'Thêm Schema Markup'}
                            </Button>
                            {schemaData && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                                ✅ Schema đã được thiết lập ({schemaData['@type']})
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
