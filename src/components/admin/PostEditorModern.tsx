'use client';

// Modern Post Editor with 2-Column Layout (CMS-style)
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@/lib/tiptap-extensions/fontSize';
import Youtube from '@tiptap/extension-youtube';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  X,
  Eye,
  Clock,
  Check,
  Calendar,
  Tag,
  Folder,
  Maximize2,
  Minimize2,
  Code,
} from 'lucide-react';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';
import { ROBOTS_OPTIONS } from '@/lib/schemas/seo';
import { analyzeSEO, type SEOAnalysisResult } from '@/lib/seo/analysis-client';
import { saveAnalysisToDatabase } from '@/lib/seo/analysis-save';
import GoogleSnippetPreview from './seo/GoogleSnippetPreview';
import SEOScoreCircle from './seo/SEOScoreCircle';
import FeaturedImageUploader from './FeaturedImageUploader';
import WordPressToolbar from './WordPressToolbar';
import MediaLibrary from './MediaLibrary';
import SchemaBuilder from './seo/SchemaBuilder';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [seoScore, setSeoScore] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarSticky, setToolbarSticky] = useState(false);
  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);
  const [schemaData, setSchemaData] = useState<any>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostFormInput>({
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
          publishDate: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
          content: post.content,
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
          seo: {
            canonicalUrl: '',
            robots: 'index, follow',
            focusKeyword: '',
            altText: '',
          },
        },
  });

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
      Image.configure({
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
        alignments: ['left', 'center', 'right'],
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
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
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
      localStorage.setItem(`post-draft-${post?.id || 'new'}`, JSON.stringify({
        ...formData,
        content: editor?.getHTML(),
        savedAt: new Date().toISOString(),
      }));
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
  }, []);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    if (draftData) {
      Object.keys(draftData).forEach(key => {
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
  const handleDiscardDraft = () => {
    const draftKey = `post-draft-${post?.id || 'new'}`;
    localStorage.removeItem(draftKey);
    setShowDraftModal(false);
    setDraftData(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title, { shouldDirty: true });
    if (!post) {
      setValue('slug', generateSlug(title));
    }
    scheduleAutoSave();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags.join(', '), { shouldDirty: true });
      setTagInput('');
      scheduleAutoSave();
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue('tags', newTags.join(', '), { shouldDirty: true });
  };

  const handleFormSubmit = async (data: PostFormInput) => {
    const keywordsArray = data.keywords
      ? data.keywords.split(',').map((k) => k.trim()).filter(k => k.length > 0)
      : [];

    const seoData = data.seo ? {
      ...(data.seo.canonicalUrl && { canonicalUrl: data.seo.canonicalUrl }),
      ...(data.seo.robots && { robots: data.seo.robots }),
      ...(data.seo.focusKeyword && { focusKeyword: data.seo.focusKeyword }),
      ...(data.seo.altText && { altText: data.seo.altText }),
    } : undefined;

    const submitData: PostFormData = {
      ...data,
      tags: tags,
      keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
      seo: seoData && Object.keys(seoData).length > 0 ? seoData : undefined,
      publishedAt: data.publishDate ? new Date(data.publishDate) : undefined,
    };

    const result = await onSubmit(submitData);

    // Clear auto-save draft after successful save
    localStorage.removeItem(`post-draft-${post?.id || 'new'}`);

    // Save SEO analysis
    if (seoAnalysis && data.slug) {
      const postId = post?.id || (result as any)?.post?.id;
      if (postId && postId !== 'new') {
        saveAnalysisToDatabase(
          seoAnalysis,
          'post',
          postId,
          data.slug
        ).catch(err => console.error('Failed to save SEO analysis:', err));
      }
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
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="relative">
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
        <div className="space-y-4">
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
          <div ref={toolbarRef} className="relative">
            <WordPressToolbar
              editor={editor}
              onAddMedia={() => setMediaLibraryOpen(true)}
            />
            
            {/* Distraction-Free Mode Toggle */}
            <div className="absolute top-2 right-2 hidden lg:block">
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
              editor.chain().focus().setImage({ 
                src: file.url,
                alt: file.alt || file.filename,
              }).run();
              setMediaLibraryOpen(false);
            }}
          />

          {/* Editor Content */}
          <Card>
            <CardContent className="p-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <EditorContent editor={editor} />
              </div>
            </CardContent>
          </Card>

          {/* SEO Section (Below Editor) */}
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
                  <AccordionTrigger className="px-4">
                    Cài đặt SEO nâng cao
                  </AccordionTrigger>
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
        </div>

        {/* RIGHT COLUMN - Sidebar (25-30%) */}
        {!isFullscreen && (
          <div className="space-y-6 lg:sticky lg:top-4 lg:h-fit">
            {/* Publish Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <Select {...register('status')} onChange={() => scheduleAutoSave()}>
                    <option value="draft">📝 Bản nháp</option>
                    <option value="published">✅ Đã xuất bản</option>
                    <option value="archived">📦 Lưu trữ</option>
                  </Select>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày xuất bản
                  </label>
                  <Input
                    type="date"
                    {...register('publishDate')}
                    onChange={() => scheduleAutoSave()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Để trống để xuất bản ngay lập tức
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {watchedValues.status === 'published' ? 'Xuất bản' : 'Lưu bản nháp'}
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`/blog/${watchedValues.slug || 'preview'}`, '_blank')}
                    disabled={!watchedValues.slug}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem trước
                  </Button>

                  <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
                    <X className="w-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                {/* Auto-save Status */}
                <div className="pt-4 border-t">
                  {isSaving ? (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="h-3 w-3 animate-pulse" />
                      Saving draft...
                    </p>
                  ) : lastSaved ? (
                    <p className="text-xs text-green-600 flex items-center gap-2">
                      <Check className="h-3 w-3" />
                      Draft saved {lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  ) : isDirty ? (
                    <p className="text-xs text-yellow-600">
                      Unsaved changes
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* SEO Score */}
            <SEOScoreCircle
              data={{
                keyword: watchedValues.seo?.focusKeyword || '',
                title: watchedValues.title,
                description: watchedValues.metaDescription || watchedValues.excerpt || '',
                content: editor.getHTML(),
                slug: watchedValues.slug,
                featuredImage: watchedValues.featuredImage,
              }}
              onScoreChange={setSeoScore}
            />

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Ảnh đại diện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FeaturedImageUploader
                  value={watchedValues.featuredImage}
                  onChange={(url) => {
                    setValue('featuredImage', url, { shouldDirty: true });
                    scheduleAutoSave();
                  }}
                  onRemove={() => {
                    setValue('featuredImage', '', { shouldDirty: true });
                    scheduleAutoSave();
                  }}
                />
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Danh mục & Thẻ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <Input
                    {...register('category')}
                    placeholder="tin tức, hướng dẫn, mẹo..."
                    onChange={() => scheduleAutoSave()}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Thẻ
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Thêm thẻ..."
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      Thêm
                    </Button>
                  </div>
                  
                  {/* Tag List */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pl-3 pr-1 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Chưa có thẻ nào. Thêm thẻ để cải thiện khả năng tìm kiếm.
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Short summary..."
                    onChange={() => scheduleAutoSave()}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
                <p className="text-sm text-gray-600 mt-2">
                  Bạn có muốn khôi phục bản nháp này không?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscardDraft}
                className="px-4"
              >
                Xóa bản nháp
              </Button>
              <Button
                type="button"
                onClick={handleRestoreDraft}
                className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
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
        onApply={(schema) => {
          setSchemaData(schema);
          // You can save schema data with the post
          console.log('Schema applied:', schema);
        }}
      />
    </form>
  );
}

