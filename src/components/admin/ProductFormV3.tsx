'use client';

// WordPress-Style Product Form V3 - Enhanced with New Sections
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import type { Product } from '@/lib/schemas/product';
import { productSchema, type ProductFormData } from '@/lib/schemas/product';
import { CATEGORIES } from '@/lib/constants';
import { analyzeSEO } from '@/lib/seo/analysis-client';
import { generateSlug } from '@/lib/utils/slug';
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

// Import new sections
import ProductDetailsSection from './products/product-details-section';
import GiftFeaturesSection from './products/gift-features-section';
import MediaExtendedSection from './products/media-extended-section';
import CollectionComboSection from './products/collection-combo-section';
import VariantFormEnhanced from './products/variant-form-enhanced';

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
  const [schemaData, setSchemaData] = useState<unknown>(null);
  const [images, setImages] = useState<string[]>(product?.images || []);

  // Wrapper to handle form submission with proper typing
  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: product.category,
          tags: product.tags || [],
          images: product.images || [],
          variants: product.variants || [],
          isHot: product.isHot ?? false,
          isActive: product.isActive ?? true,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          // NEW: Chi tiết sản phẩm
          material: product.material,
          dimensions: product.dimensions,
          weight: product.weight,
          ageRange: product.ageRange,
          careInstructions: product.careInstructions,
          safetyInfo: product.safetyInfo,
          warranty: product.warranty,
          // NEW: Tính năng quà tặng
          giftWrapping: product.giftWrapping ?? false,
          giftWrappingOptions: product.giftWrappingOptions || [],
          giftMessageEnabled: product.giftMessageEnabled ?? false,
          giftMessageTemplate: product.giftMessageTemplate,
          specialOccasions: product.specialOccasions || [],
          // NEW: Media mở rộng
          videoUrl: product.videoUrl,
          videoThumbnail: product.videoThumbnail,
          images360: product.images360 || [],
          lifestyleImages: product.lifestyleImages || [],
          // NEW: Bộ sưu tập & Combo
          collection: product.collection,
          relatedProducts: product.relatedProducts || [],
          comboProducts: product.comboProducts || [],
          bundleDiscount: product.bundleDiscount,
        }
      : {
          name: '',
          slug: '',
          description: '',
          category: '',
          tags: [],
          images: [],
          variants: [
            {
              size: '',
              color: '',
              colorCode: '',
              price: 0,
              stock: 0,
              sku: '',
              image: '',
              weight: undefined,
              dimensions: undefined,
              isPopular: false,
            },
          ],
          isHot: false,
          isActive: true,
          metaTitle: '',
          metaDescription: '',
          // NEW: Default values for new fields
          material: '',
          dimensions: undefined,
          weight: undefined,
          ageRange: '',
          careInstructions: '',
          safetyInfo: '',
          warranty: '',
          giftWrapping: false,
          giftWrappingOptions: [],
          giftMessageEnabled: false,
          giftMessageTemplate: '',
          specialOccasions: [],
          videoUrl: '',
          videoThumbnail: '',
          images360: [],
          lifestyleImages: [],
          collection: '',
          relatedProducts: [],
          comboProducts: [],
          bundleDiscount: undefined,
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
  const uniqueSizes = Array.from(
    new Set(
      watchedValues.variants
        ?.map((v) => v?.size)
        .filter(Boolean) as string[]
    )
  );
  const uniqueColors = Array.from(
    new Set(
      watchedValues.variants
        ?.map((v) => {
          if (v?.color && v?.colorCode) {
            return { name: v.color, code: v.colorCode };
          }
          return null;
        })
        .filter(Boolean) as { name: string; code: string }[]
    )
  );

  // Main Content
  const mainContent = (
    <FormProvider {...methods}>
      <section className="space-y-4">
        <Accordion type="multiple" defaultValue={['basic', 'description']} className="w-full">
          {/* Basic Info */}
          <AccordionItem value="basic">
            <AccordionTrigger className="text-lg font-semibold">
              Thông tin cơ bản
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-4">
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
            </AccordionContent>
          </AccordionItem>

          {/* Description */}
          <AccordionItem value="description">
            <AccordionTrigger className="text-lg font-semibold">
              Mô tả sản phẩm
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 p-0">
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
                    <p className="text-sm text-red-600 px-4 pb-4">
                      {errors.description.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Product Details */}
          <AccordionItem value="details">
            <AccordionTrigger className="text-lg font-semibold">
              Chi tiết sản phẩm
            </AccordionTrigger>
            <AccordionContent>
              <ProductDetailsSection />
            </AccordionContent>
          </AccordionItem>

          {/* Variants & Stock */}
          <AccordionItem value="variants">
            <AccordionTrigger className="text-lg font-semibold">
              Biến thể & Kho
            </AccordionTrigger>
            <AccordionContent>
              <VariantFormEnhanced />
            </AccordionContent>
          </AccordionItem>

          {/* Media Extended */}
          <AccordionItem value="media">
            <AccordionTrigger className="text-lg font-semibold">
              Media mở rộng
            </AccordionTrigger>
            <AccordionContent>
              <MediaExtendedSection />
            </AccordionContent>
          </AccordionItem>

          {/* Gift Features */}
          <AccordionItem value="gift">
            <AccordionTrigger className="text-lg font-semibold">
              Quà tặng & Dịch vụ
            </AccordionTrigger>
            <AccordionContent>
              <GiftFeaturesSection />
            </AccordionContent>
          </AccordionItem>

          {/* Collection & Combo */}
          <AccordionItem value="collection">
            <AccordionTrigger className="text-lg font-semibold">
              SEO & Collection
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <CollectionComboSection />

              {/* SEO Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </FormProvider>
  );

  // Sidebar
  const sidebar = (
    <>
      <PublishBox
        status={watchedValues.isActive ? 'published' : 'draft'}
        onStatusChange={(s) => setValue('isActive', s === 'published')}
        publishDate=""
        onDateChange={() => {}}
        onSave={handleSubmit(handleFormSubmit)}
        onPublish={handleSubmit(handleFormSubmit)}
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
        categories={CATEGORIES.map((cat) => ({ id: cat.value, name: cat.label }))}
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

      <AttributesBox sizes={uniqueSizes} colors={uniqueColors} />

      <SEOScoreBox
        data={{
          keyword: '',
          title: watchedValues.metaTitle || watchedValues.name,
          description:
            watchedValues.metaDescription ||
            watchedValues.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
            '',
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
      <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
        Hủy
      </Button>
      <Button
        type="button"
        onClick={handleSubmit(handleFormSubmit)}
        className="flex-1"
        disabled={isLoading}
      >
        Lưu
      </Button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
