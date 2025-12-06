'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Editor } from '@tiptap/core';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Image as ImageIcon, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form schema
const imageEditSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(), // Maps to title attribute
  width: z.string().optional(),
  height: z.string().optional(),
  align: z.enum(['left', 'center', 'right', 'none']),
  href: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type ImageEditFormData = z.infer<typeof imageEditSchema>;

export interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  align?: 'left' | 'center' | 'right';
  href?: string;
}

interface ImageEditDialogProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  currentData: ImageAttributes | null;
  onReplaceImage?: () => void;
}

export default function ImageEditDialog({
  editor,
  isOpen,
  onClose,
  currentData,
  onReplaceImage,
}: ImageEditDialogProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isLinked, setIsLinked] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ImageEditFormData>({
    resolver: zodResolver(imageEditSchema),
    defaultValues: {
      alt: '',
      caption: '',
      width: '',
      height: '',
      align: 'left' as const,
      href: '',
    },
  });

  // Load image and calculate aspect ratio from natural dimensions
  useEffect(() => {
    if (!isOpen || !currentData?.src) return;

    // Store current attributes for fallback (avoid dependency warning)
    const fallbackWidth = currentData.width;
    const fallbackHeight = currentData.height;

    // Helper function to parse dimension
    const parseDimension = (dim: string | number | undefined): number => {
      if (!dim) return 0;
      const dimStr = typeof dim === 'string' ? dim.replace('px', '').replace('%', '') : String(dim);
      return parseInt(dimStr, 10) || 0;
    };

    // Create image object to get natural dimensions
    const img = document.createElement('img');

    img.onload = () => {
      // Get natural dimensions (actual image size)
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // Calculate aspect ratio from natural dimensions
      if (naturalWidth > 0 && naturalHeight > 0) {
        const calculatedRatio = naturalWidth / naturalHeight;
        // Validate ratio (not NaN or Infinity)
        if (isFinite(calculatedRatio) && calculatedRatio > 0) {
          setAspectRatio(calculatedRatio);
        } else {
          // Fallback: try to calculate from current attributes
          const widthNum = parseDimension(fallbackWidth);
          const heightNum = parseDimension(fallbackHeight);
          if (widthNum > 0 && heightNum > 0) {
            setAspectRatio(widthNum / heightNum);
          } else {
            setAspectRatio(1); // Default to square
          }
        }
      } else {
        // Fallback: try to calculate from current attributes
        const widthNum = parseDimension(fallbackWidth);
        const heightNum = parseDimension(fallbackHeight);
        if (widthNum > 0 && heightNum > 0) {
          setAspectRatio(widthNum / heightNum);
        } else {
          setAspectRatio(1); // Default to square
        }
      }
    };

    img.onerror = () => {
      // If image fails to load, fallback to attributes or default
      const widthNum = parseDimension(fallbackWidth);
      const heightNum = parseDimension(fallbackHeight);
      if (widthNum > 0 && heightNum > 0) {
        setAspectRatio(widthNum / heightNum);
      } else {
        setAspectRatio(1);
      }
    };

    // Start loading image
    img.src = currentData.src;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentData?.src]); // Only depend on src - natural dimensions are calculated from actual image

  // Reset form values when dialog opens
  useEffect(() => {
    if (isOpen && currentData) {
      // Parse width and height from current attributes
      let widthNum = 0;
      let heightNum = 0;

      if (currentData.width) {
        const widthStr =
          typeof currentData.width === 'string'
            ? currentData.width.replace('px', '').replace('%', '')
            : String(currentData.width);
        widthNum = parseInt(widthStr, 10) || 0;
      }

      if (currentData.height) {
        const heightStr =
          typeof currentData.height === 'string'
            ? currentData.height.replace('px', '').replace('%', '')
            : String(currentData.height);
        heightNum = parseInt(heightStr, 10) || 0;
      }

      // Reset form values
      reset({
        alt: currentData.alt || '',
        caption: currentData.title || '',
        width: widthNum > 0 ? String(widthNum) : '',
        height: heightNum > 0 ? String(heightNum) : '',
        align: currentData.align || 'left',
        href: currentData.href || '',
      });

      // Reset lock state
      setIsLinked(true);
    }
  }, [isOpen, currentData, reset]);

  const watchedValues = watch();
  const align = watch('align');

  // Handle width change with aspect ratio lock
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;

    // Update width value
    setValue('width', newWidth, { shouldValidate: true });

    // Auto-calculate height if linked
    if (isLinked && newWidth && aspectRatio > 0 && isFinite(aspectRatio)) {
      const widthNum = parseInt(newWidth, 10);
      if (!isNaN(widthNum) && widthNum > 0) {
        // Formula: Height = Width / AspectRatio
        const calculatedHeight = Math.round(widthNum / aspectRatio);
        if (calculatedHeight > 0) {
          setValue('height', String(calculatedHeight), { shouldValidate: true });
        }
      }
    }
  };

  // Handle height change with aspect ratio lock
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;

    // Update height value
    setValue('height', newHeight, { shouldValidate: true });

    // Auto-calculate width if linked
    if (isLinked && newHeight && aspectRatio > 0 && isFinite(aspectRatio)) {
      const heightNum = parseInt(newHeight, 10);
      if (!isNaN(heightNum) && heightNum > 0) {
        // Formula: Width = Height * AspectRatio
        const calculatedWidth = Math.round(heightNum * aspectRatio);
        if (calculatedWidth > 0) {
          setValue('width', String(calculatedWidth), { shouldValidate: true });
        }
      }
    }
  };

  // Register inputs with custom onChange handlers
  const widthRegister = register('width');
  const heightRegister = register('height');

  const onSubmit = (data: ImageEditFormData): void => {
    if (!editor || !currentData) return;

    // Find image node in editor
    const { state } = editor;
    const { selection } = state;

    let imagePos: number | null = null;
    state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === currentData.src) {
        imagePos = pos;
        return false;
      }
    });

    if (imagePos === null) {
      // Try to find image near selection
      const { $anchor } = selection;
      state.doc.nodesBetween($anchor.pos - 1, $anchor.pos + 1, (node, pos) => {
        if (node.type.name === 'image') {
          imagePos = pos;
          return false;
        }
      });
    }

    if (imagePos === null) {
      console.error('Image node not found');
      onClose();
      return;
    }

    // Build attributes object
    const attrs: Partial<ImageAttributes> = {
      alt: data.alt || undefined,
      title: data.caption || undefined,
      align: data.align === 'none' ? 'left' : data.align,
      href: data.href || undefined,
    };

    // Handle width
    if (data.width) {
      // Check if it's a percentage or pixels
      const widthStr = data.width.trim();
      if (widthStr.endsWith('%')) {
        attrs.width = widthStr;
      } else {
        const numWidth = parseInt(widthStr, 10);
        if (!isNaN(numWidth)) {
          attrs.width = numWidth > 0 ? `${numWidth}px` : undefined;
        }
      }
    }

    // Handle height
    if (data.height) {
      const heightStr = data.height.trim();
      if (heightStr.endsWith('%')) {
        attrs.height = heightStr;
      } else {
        const numHeight = parseInt(heightStr, 10);
        if (!isNaN(numHeight)) {
          attrs.height = numHeight > 0 ? `${numHeight}px` : undefined;
        }
      }
    }

    // Update image node
    editor.chain().focus().setNodeSelection(imagePos).updateAttributes('image', attrs).run();

    onClose();
  };

  const handleReplaceImage = () => {
    if (onReplaceImage) {
      onReplaceImage();
    } else {
      console.log('Open Media Library');
    }
    onClose();
  };

  if (!currentData) {
    return null;
  }

  // Calculate file size (mock data if not available)
  const fileSize = 'Unknown size'; // You can calculate from actual file if needed

  // Extract filename from src
  const filename = currentData.src.split('/').pop() || 'image.jpg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-[100]">
        <DialogHeader>
          <DialogTitle>Chi tiết hình ảnh</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
            {/* Left Column - Form Settings */}
            <div className="space-y-4">
              {/* Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="alt">Văn bản thay thế</Label>
                <Input
                  id="alt"
                  {...register('alt')}
                  placeholder="Mô tả ảnh cho accessibility"
                  className={errors.alt ? 'border-red-500' : ''}
                />
                {errors.alt && <p className="text-sm text-red-500">{errors.alt.message}</p>}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Chú thích</Label>
                <Textarea
                  id="caption"
                  {...register('caption')}
                  placeholder="Nhập chú thích cho ảnh"
                  rows={3}
                  className={errors.caption ? 'border-red-500' : ''}
                />
                {errors.caption && <p className="text-sm text-red-500">{errors.caption.message}</p>}
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label>Kích thước</Label>
                <div className="flex items-end gap-2">
                  {/* Width Input */}
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="width" className="text-xs text-muted-foreground">
                      Chiều rộng (px)
                    </Label>
                    <Input
                      id="width"
                      type="text"
                      {...widthRegister}
                      onChange={(e) => {
                        widthRegister.onChange(e);
                        handleWidthChange(e);
                      }}
                      placeholder="Auto"
                      className={errors.width ? 'border-red-500' : ''}
                    />
                  </div>

                  {/* Link/Unlink Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLinked(!isLinked)}
                    className={cn(
                      'h-10 w-10 mb-0',
                      isLinked
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-gray-400 hover:text-gray-600'
                    )}
                    aria-label={isLinked ? 'Mở khóa tỷ lệ' : 'Khóa tỷ lệ'}
                    title={isLinked ? 'Mở khóa tỷ lệ' : 'Khóa tỷ lệ'}
                  >
                    <Link2
                      className={cn(
                        'h-4 w-4',
                        isLinked ? 'stroke-[2.5]' : 'stroke-[1.5] opacity-60'
                      )}
                    />
                  </Button>

                  {/* Height Input */}
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="height" className="text-xs text-muted-foreground">
                      Chiều cao (px)
                    </Label>
                    <Input
                      id="height"
                      type="text"
                      {...heightRegister}
                      onChange={(e) => {
                        heightRegister.onChange(e);
                        handleHeightChange(e);
                      }}
                      placeholder="Auto"
                      className={errors.height ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                {errors.width && <p className="text-sm text-red-500">{errors.width.message}</p>}
                {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
              </div>

              {/* Alignment */}
              <div className="space-y-2">
                <Label htmlFor="align">Căn chỉnh</Label>
                <Select
                  value={align}
                  onValueChange={(value) => setValue('align', value as ImageEditFormData['align'])}
                >
                  <SelectTrigger id="align" className={errors.align ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Chọn căn chỉnh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Trái</SelectItem>
                    <SelectItem value="center">Giữa</SelectItem>
                    <SelectItem value="right">Phải</SelectItem>
                    <SelectItem value="none">Không</SelectItem>
                  </SelectContent>
                </Select>
                {errors.align && <p className="text-sm text-red-500">{errors.align.message}</p>}
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="href">Liên kết</Label>
                <Input
                  id="href"
                  type="url"
                  {...register('href')}
                  placeholder="https://example.com"
                  className={errors.href ? 'border-red-500' : ''}
                />
                {errors.href && <p className="text-sm text-red-500">{errors.href.message}</p>}
                <p className="text-xs text-muted-foreground">Nhập URL để ảnh có thể click vào</p>
              </div>

              {/* Replace Image Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReplaceImage}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thay thế ảnh
                </Button>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Xem trước</Label>
                <div className="border rounded-lg overflow-hidden bg-gray-50 p-4 flex items-center justify-center min-h-[300px]">
                  <div className="relative w-full max-w-md">
                    <div
                      className="relative"
                      style={{
                        width:
                          watchedValues.width && !watchedValues.width.includes('%')
                            ? `${watchedValues.width}px`
                            : '100%',
                        height:
                          watchedValues.height && !watchedValues.height.includes('%')
                            ? `${watchedValues.height}px`
                            : 'auto',
                        textAlign:
                          align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
                      }}
                    >
                      <Image
                        src={currentData.src}
                        alt={watchedValues.alt || currentData.alt || ''}
                        width={600}
                        height={400}
                        className="rounded-lg object-contain max-w-full h-auto"
                        style={{
                          width:
                            watchedValues.width && !watchedValues.width.includes('%')
                              ? `${watchedValues.width}px`
                              : '100%',
                          height:
                            watchedValues.height && !watchedValues.height.includes('%')
                              ? `${watchedValues.height}px`
                              : 'auto',
                        }}
                      />
                    </div>
                    {watchedValues.caption && (
                      <p className="text-sm text-center text-muted-foreground mt-2 italic">
                        {watchedValues.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Thông tin tệp</Label>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{filename}</span>
                  </div>
                  <p className="text-muted-foreground">{fileSize}</p>
                  {currentData.width && currentData.height && (
                    <p className="text-muted-foreground">
                      {typeof currentData.width === 'string'
                        ? currentData.width
                        : `${currentData.width}px`}{' '}
                      ×{' '}
                      {typeof currentData.height === 'string'
                        ? currentData.height
                        : `${currentData.height}px`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Cập nhật</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
