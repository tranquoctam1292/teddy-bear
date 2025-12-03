'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/admin/ui/dialog';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Switch } from '@/components/admin/ui/switch';

interface GatewayConfigModalProps {
  gateway: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => Promise<void>;
}

export default function GatewayConfigModal({
  gateway,
  isOpen,
  onClose,
  onSave,
}: GatewayConfigModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [configFields, setConfigFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gateway) {
      setTestMode(gateway.testMode !== undefined ? gateway.testMode : true);
      setConfigFields(gateway.config || {});
    }
  }, [gateway]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await onSave({
        name: gateway.name,
        enabled: gateway.enabled,
        testMode,
        config: configFields,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Không thể lưu cấu hình!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setConfigFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!gateway) return null;

  const fields = gateway.fields || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{gateway.icon}</span>
            Cấu hình {gateway.displayName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">Test Mode</p>
              <p className="text-sm text-blue-700">
                Sử dụng API test để kiểm tra trước khi đưa vào production
              </p>
            </div>
            <Switch checked={testMode} onCheckedChange={setTestMode} />
          </div>

          {/* Configuration Fields */}
          {fields.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Thông tin API</h4>
              {fields.map((field: string) => (
                <div key={field}>
                  <Label className="capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Input
                    type="text"
                    value={configFields[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={`Nhập ${field}...`}
                    className="mt-1"
                    required={gateway.enabled}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
              Gateway này không cần cấu hình thêm
            </div>
          )}

          {/* Documentation Link */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              📚 Hướng dẫn cấu hình chi tiết: <br />
              <a
                href={`https://docs.${gateway.name}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://docs.{gateway.name}.com
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose} variant="outline">
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

