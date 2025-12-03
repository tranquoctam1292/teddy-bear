'use client';

// WordPress-Style Product Form V3
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Code } from 'lucide-react';
import type { Product } from '@/lib/schemas/product';
import { CATEGORIES } from '@/lib/constants';
import { analyzeSEO } from '@/lib/seo/analysis-client';
import EditorLayout from './EditorLayout';
import RichTextEditor from './RichTextEditor';
import SchemaBuilder from './seo/SchemaBuilder';
import { PublishBox, FeaturedImageBox, GalleryBox, CategoryBox, TagBox, SEOScoreBox, AttributesBox } from './sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Schemas
const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, 'Kích thước là bắt buộc'),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng phải >= 0'),
  sku: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, 'Cần ít nhất 1 ảnh'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 biến thể'),
  isHot: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormV3Props {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductFormV3({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormV3Props) {
  const [seoScore, setSeoScore] = useState(0);
  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);
  const [schemaData, setSchemaData] = useState<any>(null);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      slug: '',
      description: '',
      category: '',
      tags: [],
      images: [],
      variants: [{ size: '', color: '', colorCode: '', price: 0, stock: 0, sku: '' }],
      isHot: false,
      isActive: true,
    },
  });

  const { fields: variants, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const watchedValues = watch();

  // Auto-generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!product) {
      setValue('slug', generateSlug(name));
    }
  };

  // Sync images with form
  useEffect(() => {
    setValue('images', images);
  }, [images, setValue]);

  // Extract unique sizes and colors from variants
  const uniqueSizes = Array.from(new Set(variants.map(v => watchedValues.variants?.[variants.indexOf(v)]?.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(
    variants
      .map(v => {
        const variant = watchedValues.variants?.[variants.indexOf(v)];
        return variant?.color && variant?.colorCode 
          ? { name: variant.color, code: variant.colorCode }
          : null;
      })
      .filter(Boolean)
  )) as { name: string; code: string }[];

  // Main Content
  const mainContent = (
    <div className="space-y-4">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              onChange={handleNameChange}
              placeholder="Gấu Bông Teddy Cổ Điển"
              className="text-lg font-semibold"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('slug')}
              placeholder="gau-bong-teddy-co-dien"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Mô tả sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="Viết mô tả chi tiết về sản phẩm..."
                minHeight="350px"
              />
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-600 px-4 pb-4">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Biến thể sản phẩm</CardTitle>
            <Button
              type="button"
              onClick={() => append({ size: '', color: '', colorCode: '', price: 0, stock: 0, sku: '' })}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm biến thể
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Biến thể #{index + 1}</h4>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Kích thước *</label>
                  <Input
                    {...register(`variants.${index}.size`)}
                    placeholder="80cm"
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Màu sắc</label>
                  <Input
                    {...register(`variants.${index}.color`)}
                    placeholder="Nâu"
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Giá (VNĐ) *</label>
                  <Input
                    {...register(`variants.${index}.price`, { valueAsNumber: true })}
                    type="number"
                    placeholder="250000"
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Tồn kho *</label>
                  <Input
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                    type="number"
                    placeholder="100"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="seo" className="border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                🎯 Tối ưu hóa SEO
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề Meta
                  </label>
                  <Input
                    {...register('metaTitle')}
                    placeholder="Để trống để dùng tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả Meta
                  </label>
                  <textarea
                    {...register('metaDescription')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Để trống để dùng mô tả ngắn"
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSchemaBuilder(true)}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    {schemaData ? 'Chỉnh sửa Schema' : 'Thêm Schema Product'}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  // Sidebar
  const sidebar = (
    <>
      <PublishBox
        status={watchedValues.isActive ? 'published' : 'draft'}
        onStatusChange={(s) => setValue('isActive', s === 'published')}
        publishDate=""
        onDateChange={() => {}}
        onSave={handleSubmit(onSubmit)}
        onPublish={handleSubmit(onSubmit)}
        onPreview={() => window.open(`/products/${watchedValues.slug}`, '_blank')}
        isLoading={isLoading}
        isDirty={isDirty}
      />

      <FeaturedImageBox
        value={images[0]}
        onChange={(url) => {
          if (images.length === 0) {
            setImages([url]);
          } else {
            setImages([url, ...images.slice(1)]);
          }
        }}
        onRemove={() => setImages(images.slice(1))}
      />

      <GalleryBox
        images={images}
        onAdd={(urls) => setImages([...images, ...urls])}
        onRemove={(index) => setImages(images.filter((_, i) => i !== index))}
        onSetFeatured={(index) => {
          const newImages = [...images];
          const [featured] = newImages.splice(index, 1);
          setImages([featured, ...newImages]);
        }}
        featuredIndex={0}
        maxImages={10}
      />

      <CategoryBox
        categories={CATEGORIES.map(cat => ({ id: cat, name: cat }))}
        selected={watchedValues.category ? [watchedValues.category] : []}
        onChange={(cats) => setValue('category', cats[0] || '')}
        allowMultiple={false}
        title="Danh mục sản phẩm"
      />

      <TagBox
        tags={watchedValues.tags}
        onChange={(t) => setValue('tags', t)}
        suggestions={['gấu bông', 'teddy bear', 'quà tặng', 'handmade', 'cao cấp']}
      />

      <AttributesBox
        sizes={uniqueSizes}
        colors={uniqueColors}
      />

      <SEOScoreBox
        data={{
          keyword: '',
          title: watchedValues.metaTitle || watchedValues.name,
          description: watchedValues.metaDescription || watchedValues.description?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
          content: watchedValues.description || '',
          slug: watchedValues.slug,
          featuredImage: images[0],
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
        onClick={handleSubmit(onSubmit)}
        className="flex-1"
        disabled={isLoading}
      >
        Lưu
      </Button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EditorLayout
          title={product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          subtitle="Modern Product Editor • Rich Features • SEO Optimized"
          mainContent={mainContent}
          sidebar={sidebar}
          mobileActions={mobileActions}
        />
      </form>

      <SchemaBuilder
        isOpen={showSchemaBuilder}
        onClose={() => setShowSchemaBuilder(false)}
        onApply={(schema) => setSchemaData(schema)}
      />
    </>
  );
}

