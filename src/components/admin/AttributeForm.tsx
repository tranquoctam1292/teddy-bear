'use client';

// Attribute Form Component
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import type { ProductAttribute, AttributeValue } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const attributeValueSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Label là bắt buộc'),
  value: z.string().min(1, 'Value là bắt buộc'),
  color: z.string().optional(),
  image: z.string().optional(),
  order: z.number(),
});

const attributeSchema = z.object({
  name: z.string().min(1, 'Tên thuộc tính là bắt buộc'),
  type: z.enum(['text', 'select', 'multiselect', 'number', 'boolean']),
  values: z.array(attributeValueSchema),
  isRequired: z.boolean(),
  order: z.number().min(0),
});

type AttributeFormData = z.infer<typeof attributeSchema>;

interface AttributeFormProps {
  attribute?: ProductAttribute;
  onSubmit: (data: AttributeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AttributeForm({
  attribute,
  onSubmit,
  onCancel,
  isLoading = false,
}: AttributeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AttributeFormData>({
    resolver: zodResolver(attributeSchema),
    defaultValues: attribute
      ? {
          name: attribute.name,
          type: attribute.type,
          values: attribute.values || [],
          isRequired: attribute.isRequired,
          order: attribute.order,
        }
      : {
          name: '',
          type: 'select',
          values: [],
          isRequired: false,
          order: 0,
        },
  });

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
    swap: swapValues,
  } = useFieldArray({
    control,
    name: 'values',
  });

  const attributeType = watch('type');
  const values = watch('values');

  const handleFormSubmit = async (data: AttributeFormData) => {
    // Ensure values have IDs and proper order
    const processedValues = data.values.map((val, index) => ({
      ...val,
      id: val.id || `val_${Date.now()}_${index}`,
      order: val.order !== undefined ? val.order : index,
    }));

    await onSubmit({
      ...data,
      values: processedValues,
    });
  };

  const addValue = () => {
    appendValue({
      label: '',
      value: '',
      order: values.length,
    });
  };

  const getTypeLabel = (type: ProductAttribute['type']) => {
    const labels: Record<ProductAttribute['type'], string> = {
      text: 'Văn bản',
      select: 'Chọn một',
      multiselect: 'Chọn nhiều',
      number: 'Số',
      boolean: 'Có/Không',
    };
    return labels[type];
  };

  const needsValues = ['select', 'multiselect'].includes(attributeType);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{attribute ? 'Chỉnh sửa thuộc tính' : 'Tạo thuộc tính mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thuộc tính <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Kích thước, Màu sắc"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại thuộc tính <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={isLoading}
              >
                <option value="text">Văn bản</option>
                <option value="select">Chọn một</option>
                <option value="multiselect">Chọn nhiều</option>
                <option value="number">Số</option>
                <option value="boolean">Có/Không</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự
              </label>
              <Input
                type="number"
                {...register('order', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.order && (
                <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
              )}
            </div>
          </div>

          {needsValues && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Giá trị có sẵn <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addValue}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giá trị
                </Button>
              </div>

              {valueFields.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Chưa có giá trị nào. Click "Thêm giá trị" để bắt đầu.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addValue}
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm giá trị đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {valueFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move mt-2" />
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            {...register(`values.${index}.label`)}
                            placeholder="Label (hiển thị)"
                            disabled={isLoading}
                          />
                          {errors.values?.[index]?.label && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.values[index]?.label?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register(`values.${index}.value`)}
                            placeholder="Value (giá trị)"
                            disabled={isLoading}
                          />
                          {errors.values?.[index]?.value && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.values[index]?.value?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register(`values.${index}.color`)}
                            type="color"
                            className="w-full h-10 cursor-pointer"
                            placeholder="Màu sắc (tùy chọn)"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Input
                            {...register(`values.${index}.image`)}
                            placeholder="URL hình ảnh (tùy chọn)"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValue(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.values && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.values.message || 'Cần ít nhất một giá trị'}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              {...register('isRequired')}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={isLoading}
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
              Thuộc tính bắt buộc
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
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
                  Lưu
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



