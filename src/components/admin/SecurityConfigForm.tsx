'use client';

// Security Configuration Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Shield } from 'lucide-react';
import type { SecurityConfig } from '@/lib/schemas/security-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const securityConfigSchema = z.object({
  passwordPolicy: z.object({
    minLength: z.number().min(6).max(32),
    requireUppercase: z.boolean(),
    requireLowercase: z.boolean(),
    requireNumbers: z.boolean(),
    requireSpecialChars: z.boolean(),
    maxAge: z.number().min(0),
  }),
  sessionConfig: z.object({
    maxAge: z.number().min(1),
    requireMFA: z.boolean(),
  }),
  rateLimiting: z.object({
    enabled: z.boolean(),
    maxRequests: z.number().min(1),
    windowMs: z.number().min(1000),
  }),
  cors: z.object({
    enabled: z.boolean(),
    allowedOrigins: z.array(z.string()),
  }),
  apiSecurity: z.object({
    requireApiKey: z.boolean(),
    allowedIPs: z.array(z.string()),
  }),
});

type SecurityConfigFormData = z.infer<typeof securityConfigSchema>;

interface SecurityConfigFormProps {
  config?: SecurityConfig;
  onSubmit: (data: SecurityConfigFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SecurityConfigForm({
  config,
  onSubmit,
  isLoading = false,
}: SecurityConfigFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SecurityConfigFormData>({
    resolver: zodResolver(securityConfigSchema),
    defaultValues: config
      ? {
          passwordPolicy: config.passwordPolicy,
          sessionConfig: config.sessionConfig,
          rateLimiting: config.rateLimiting,
          cors: config.cors,
          apiSecurity: config.apiSecurity,
        }
      : {
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
            maxAge: 90,
          },
          sessionConfig: {
            maxAge: 24,
            requireMFA: false,
          },
          rateLimiting: {
            enabled: true,
            maxRequests: 100,
            windowMs: 60000,
          },
          cors: {
            enabled: true,
            allowedOrigins: [],
          },
          apiSecurity: {
            requireApiKey: false,
            allowedIPs: [],
          },
        },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-600" />
          <CardTitle>Cấu hình bảo mật</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Policy */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Chính sách mật khẩu</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ dài tối thiểu
                </label>
                <Input
                  type="number"
                  {...register('passwordPolicy.minLength', { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    {...register('passwordPolicy.requireUppercase')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <label htmlFor="requireUppercase" className="text-sm text-gray-700">
                    Yêu cầu chữ hoa
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireLowercase"
                    {...register('passwordPolicy.requireLowercase')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <label htmlFor="requireLowercase" className="text-sm text-gray-700">
                    Yêu cầu chữ thường
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    {...register('passwordPolicy.requireNumbers')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <label htmlFor="requireNumbers" className="text-sm text-gray-700">
                    Yêu cầu số
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    {...register('passwordPolicy.requireSpecialChars')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <label htmlFor="requireSpecialChars" className="text-sm text-gray-700">
                    Yêu cầu ký tự đặc biệt
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời hạn mật khẩu (ngày)
                </label>
                <Input
                  type="number"
                  {...register('passwordPolicy.maxAge', { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Session Config */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cấu hình phiên</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hết hạn (giờ)
                </label>
                <Input
                  type="number"
                  {...register('sessionConfig.maxAge', { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requireMFA"
                  {...register('sessionConfig.requireMFA')}
                  className="w-4 h-4"
                  disabled={isLoading}
                />
                <label htmlFor="requireMFA" className="text-sm text-gray-700">
                  Yêu cầu xác thực hai yếu tố (MFA)
                </label>
              </div>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Giới hạn tốc độ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rateLimitingEnabled"
                  {...register('rateLimiting.enabled')}
                  className="w-4 h-4"
                  disabled={isLoading}
                />
                <label htmlFor="rateLimitingEnabled" className="text-sm text-gray-700">
                  Bật giới hạn tốc độ
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số request tối đa
                  </label>
                  <Input
                    type="number"
                    {...register('rateLimiting.maxRequests', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cửa sổ thời gian (ms)
                  </label>
                  <Input
                    type="number"
                    {...register('rateLimiting.windowMs', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

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
      </CardContent>
    </Card>
  );
}




