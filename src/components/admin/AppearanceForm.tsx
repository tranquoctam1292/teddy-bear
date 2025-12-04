'use client';

// Appearance Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import type { AppearanceConfig } from '@/lib/schemas/appearance-settings';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ThemeSelector from './ThemeSelector';
import ColorPicker from './ColorPicker';

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  fontFamily: z.string().optional(),
});

type AppearanceFormData = z.infer<typeof appearanceSchema>;

interface AppearanceFormProps {
  config?: AppearanceConfig;
  onSubmit: (data: AppearanceFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function AppearanceForm({
  config,
  onSubmit,
  isLoading = false,
}: AppearanceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: config
      ? {
          theme: config.theme,
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
          borderRadius: config.borderRadius || 'md',
          fontFamily: config.fontFamily || '',
        }
      : {
          theme: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          borderRadius: 'md',
          fontFamily: '',
        },
  });

  const theme = watch('theme');
  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSelector
            theme={theme}
            onThemeChange={(newTheme) => setValue('theme', newTheme)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Màu sắc chủ đạo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ColorPicker
            label="Màu chính (Primary Color)"
            value={primaryColor}
            onChange={(color) => setValue('primaryColor', color)}
            description="Màu chính được sử dụng cho buttons, links, và các elements quan trọng"
            isLoading={isLoading}
          />

          <div className="border-t pt-6">
            <ColorPicker
              label="Màu phụ (Secondary Color)"
              value={secondaryColor}
              onChange={(color) => setValue('secondaryColor', color)}
              description="Màu phụ được sử dụng cho accents và highlights"
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ bo góc
            </label>
            <select
              {...register('borderRadius')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={isLoading}
            >
              <option value="none">Không bo góc</option>
              <option value="sm">Nhỏ</option>
              <option value="md">Vừa</option>
              <option value="lg">Lớn</option>
              <option value="xl">Rất lớn</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Độ bo góc cho buttons, cards, và các elements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu cấu hình
            </>
          )}
        </Button>
      </div>
    </form>
  );
}




