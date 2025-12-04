'use client';

// SMTP Configuration Form Component
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, TestTube } from 'lucide-react';
import type { SMTPConfig } from '@/lib/schemas/notification-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const smtpConfigSchema = z.object({
  provider: z.enum(['smtp', 'resend', 'sendgrid', 'mailgun']),
  enabled: z.boolean(),
  config: z.record(z.any()).optional(),
});

type SMTPConfigFormData = z.infer<typeof smtpConfigSchema>;

interface SMTPConfigFormProps {
  config?: SMTPConfig;
  onSubmit: (data: SMTPConfigFormData) => Promise<void>;
  onTest?: () => Promise<void>;
  isLoading?: boolean;
  isTesting?: boolean;
}

export default function SMTPConfigForm({
  config,
  onSubmit,
  onTest,
  isLoading = false,
  isTesting = false,
}: SMTPConfigFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SMTPConfigFormData>({
    resolver: zodResolver(smtpConfigSchema),
    defaultValues: config
      ? {
          provider: config.provider,
          enabled: config.enabled,
          config: config.config || {},
        }
      : {
          provider: 'smtp',
          enabled: false,
          config: {},
        },
  });

  const provider = watch('provider');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình SMTP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              {...register('provider')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={isLoading}
            >
              <option value="smtp">SMTP</option>
              <option value="resend">Resend</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
            </select>
          </div>

          {provider === 'smtp' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <Input
                    {...register('config.host')}
                    placeholder="smtp.gmail.com"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <Input
                    type="number"
                    {...register('config.port', { valueAsNumber: true })}
                    placeholder="587"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    {...register('config.username')}
                    placeholder="your-email@gmail.com"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    {...register('config.password')}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="secure"
                  {...register('config.secure')}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  disabled={isLoading}
                />
                <label htmlFor="secure" className="text-sm font-medium text-gray-700">
                  Use TLS/SSL
                </label>
              </div>
            </>
          )}

          {provider === 'resend' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <Input
                  type="password"
                  {...register('config.apiKey')}
                  placeholder="re_..."
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <Input
                    {...register('config.fromEmail')}
                    placeholder="noreply@example.com"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Name
                  </label>
                  <Input
                    {...register('config.fromName')}
                    placeholder="Your Store"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          {(provider === 'sendgrid' || provider === 'mailgun') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <Input
                type="password"
                {...register('config.apiKey')}
                placeholder="SG.xxx or mailgun key"
                disabled={isLoading}
              />
              {provider === 'mailgun' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain
                  </label>
                  <Input
                    {...register('config.domain')}
                    placeholder="mg.example.com"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {config?.testResult && (
            <div
              className={`p-3 rounded-md ${
                config.testResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-sm ${
                  config.testResult.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {config.testResult.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Tested at: {new Date(config.testResult.testedAt).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              {...register('enabled')}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={isLoading}
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Bật cấu hình SMTP
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            {onTest && (
              <Button
                type="button"
                variant="outline"
                onClick={onTest}
                disabled={isLoading || isTesting}
              >
                {isTesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Đang test...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test kết nối
                  </>
                )}
              </Button>
            )}
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



