'use client';

// Post Editor Component with Tiptap Rich Text Editor
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';
import { ROBOTS_OPTIONS } from '@/lib/schemas/seo';
import { analyzeSEO, type SEOAnalysisResult } from '@/lib/seo/analysis-client';
import { saveAnalysisToDatabase } from '@/lib/seo/analysis-save';
import SEOAnalysisDisplay from './seo/SEOAnalysisDisplay';
import { generateSlug } from '@/lib/utils/slug';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

// SEO Schema
const seoSchema = z.object({
  canonicalUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  robots: z.enum(['index, follow', 'noindex, follow', 'noindex, nofollow']).optional(),
  focusKeyword: z.string().optional(),
  altText: z.string().optional(),
});

// Validation Schema for form input (keywords and tags are strings in form)
const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(), // String in form, converted to array on submit
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // String in form, converted to array on submit
  status: z.enum(['draft', 'published', 'archived']),
  seo: seoSchema.optional(),
});

// Form input type (what the form uses)
type PostFormInput = z.infer<typeof postSchema> & {
  content: string;
};

interface PostEditorProps {
  post?: Post;
  onSubmit: (data: PostFormData) => Promise<{ post?: Post } | void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PostEditor({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
}: PostEditorProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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
          content: '',
          seo: {
            canonicalUrl: '',
            robots: 'index, follow',
            focusKeyword: '',
            altText: '',
          },
        },
  });

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết bài của bạn...',
      }),
    ],
    content: post?.content || '',
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!post) {
      setValue('slug', generateSlug(title));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags.join(', '));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue('tags', newTags.join(', '));
  };

  const handleFormSubmit = async (data: PostFormInput) => {
    const keywordsArray = data.keywords 
      ? data.keywords.split(',').map((k) => k.trim()).filter(k => k.length > 0)
      : [];
    
    // Clean SEO data - remove empty strings
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
    };
    
    // Save post first
    const result = await onSubmit(submitData);
    
    // Save SEO analysis after post is saved (non-blocking)
    if (seoAnalysis && data.slug) {
      const postId = post?.id || (result as any)?.post?.id;
      if (postId && postId !== 'new') {
        // Save analysis in background (non-blocking)
        // Don't await - let it run in background
        saveAnalysisToDatabase(
          seoAnalysis,
          'post',
          postId,
          data.slug
        ).catch(err => {
          console.error('Failed to save SEO analysis:', err);
          // Don't block the save process
        });
      }
    }
    
    // Note: Redirect is handled by parent component after onSubmit completes
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('title')}
              onChange={handleTitleChange}
              placeholder="Nhập tiêu đề bài viết"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <Input {...register('slug')} placeholder="url-friendly-slug" />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              placeholder="Mô tả ngắn về bài viết..."
            />
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <Select {...register('status')}>
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <Input {...register('category')} placeholder="news, tips, stories..." />
            </div>
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nội dung</h2>
          <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
              }`}
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
              }`}
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Nhập URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('link') ? 'bg-gray-200' : ''
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Nhập URL hình ảnh:');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">Nội dung là bắt buộc</p>
        )}
      </div>

      {/* SEO Basic */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Cơ Bản</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <Input {...register('metaTitle')} placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (phân cách bằng dấu phẩy)
            </label>
            <Input {...register('keywords')} placeholder="keyword1, keyword2, keyword3" />
          </div>
        </div>
      </div>

      {/* SEO Advanced */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cấu Hình SEO Nâng Cao</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canonical URL
            </label>
            <Input
              {...register('seo.canonicalUrl')}
              type="url"
              placeholder="https://example.com/canonical-url"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL gốc để tránh duplicate content. Để trống để sử dụng URL mặc định.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Robots Meta Tag
            </label>
            <select
              {...register('seo.robots')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            >
              {ROBOTS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hướng dẫn search engines cách index trang này.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus Keyword
            </label>
            <Input
              {...register('seo.focusKeyword')}
              placeholder="Từ khóa chính cho bài viết"
            />
            <p className="mt-1 text-xs text-gray-500">
              Từ khóa chính để theo dõi và tối ưu SEO.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text (Ảnh đại diện)
            </label>
            <Input
              {...register('seo.altText')}
              placeholder="Mô tả ảnh đại diện (nếu khác tiêu đề bài viết)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Alt text cho ảnh đại diện. Để trống sẽ sử dụng tiêu đề bài viết.
            </p>
          </div>
        </div>
      </div>

      {/* Media & Tags */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Media & Tags</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <Input {...register('featuredImage')} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Nhập tag và nhấn Enter"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu bài viết
            </>
          )}
        </Button>
      </div>
    </form>
  );
}


