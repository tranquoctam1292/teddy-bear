'use client';

// Product Form Component with Variant Management
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/schemas/product';
import { CATEGORIES } from '@/lib/constants';

// Validation Schema
const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, 'Kích thước là bắt buộc'),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0'),
  image: z.string().optional(),
  sku: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  tags: z.array(z.string()),
  images: z.array(z.string()).min(1, 'Cần ít nhất 1 hình ảnh'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 variant'),
  isHot: z.boolean(),
  isActive: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: product.category,
          tags: product.tags || [],
          images: product.images || [],
          variants: product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            price: v.price,
            stock: v.stock,
            image: v.image || '',
            sku: v.sku || '',
          })),
          isHot: product.isHot || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
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
              price: 0,
              stock: 0,
              image: '',
            },
          ],
          isHot: false,
          isActive: true,
          metaTitle: '',
          metaDescription: '',
        },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const images = watch('images');
  const tags = watch('tags');

  const addImage = () => {
    if (imageInput.trim()) {
      setValue('images', [...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setValue(
      'images',
      images.filter((_, i) => i !== index)
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setValue(
      'tags',
      tags.filter((_, i) => i !== index)
    );
  };

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
      // Auto-generate slug for new products
      setValue('slug', generateSlug(name));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thông tin cơ bản
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Gấu Bông Teddy Cổ Điển"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('slug')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="gau-bong-teddy-co-dien"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Chọn danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hình ảnh sản phẩm
        </h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              placeholder="Nhập URL hình ảnh"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {errors.images && (
            <p className="text-sm text-red-600">{errors.images.message}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48">🐻</text></svg>';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Variants</h2>
            <button
              type="button"
              onClick={() =>
                appendVariant({
                  size: '',
                  price: 0,
                  stock: 0,
                  image: '',
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
            >
            <Plus className="w-4 h-4" />
            Thêm Variant
          </button>
        </div>

        {errors.variants && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{errors.variants.message}</p>
          </div>
        )}

        <div className="space-y-4">
          {variantFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Variant {index + 1}</h3>
                {variantFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`variants.${index}.size` as const)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="80cm, 1m2, 1m5..."
                  />
                  {errors.variants?.[index]?.size && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.variants[index]?.size?.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.price` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="250000"
                  />
                  {errors.variants?.[index]?.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.variants[index]?.price?.message}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="10"
                  />
                  {errors.variants?.[index]?.stock && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.variants[index]?.stock?.message}
                    </p>
                  )}
                </div>

                {/* Variant Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh variant (tùy chọn)
                  </label>
                  <input
                    {...register(`variants.${index}.image` as const)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="URL hình ảnh"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Nhập tag và nhấn Enter"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
            >
            <Plus className="w-5 h-5" />
          </button>
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

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('isHot')}
              className="w-5 h-5 text-gray-700 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Sản phẩm Hot</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-5 h-5 text-gray-700 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Hiển thị sản phẩm</span>
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              {...register('metaTitle')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
          >
          Hủy
        </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Lưu sản phẩm</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

