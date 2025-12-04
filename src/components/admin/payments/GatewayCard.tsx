'use client';

import { PaymentGateway } from '@/lib/types/payment';
import { Button } from '@/components/admin/ui/button';
import { Switch } from '@/components/admin/ui/switch';
import { Settings, CheckCircle, XCircle } from 'lucide-react';

interface GatewayCardProps {
  gateway: PaymentGateway & { icon?: string; description?: string; fields?: string[] };
  onToggle: (name: string, enabled: boolean) => void;
  onConfigure: (gateway: any) => void;
}

export default function GatewayCard({
  gateway,
  onToggle,
  onConfigure,
}: GatewayCardProps) {
  const isConfigured = gateway.config && Object.keys(gateway.config).length > 0;

  return (
    <div
      className={`bg-white border-2 rounded-lg p-6 transition-all ${
        gateway.enabled
          ? 'border-green-500 shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{gateway.icon || '💳'}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {gateway.displayName}
            </h3>
            <p className="text-sm text-gray-600">{gateway.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        {gateway.enabled ? (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            <span>Đang hoạt động</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            <XCircle className="h-3 w-3" />
            <span>Tắt</span>
          </div>
        )}
      </div>

      {/* Configuration Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Trạng thái cấu hình:</span>
          <span
            className={`font-medium ${
              isConfigured ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {isConfigured ? '✓ Đã cấu hình' : '⚠ Chưa cấu hình'}
          </span>
        </div>
        {gateway.testMode && (
          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-200">
            <span className="text-gray-600">Chế độ:</span>
            <span className="font-medium text-blue-600">🧪 Test Mode</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={gateway.enabled}
            onCheckedChange={(checked) => onToggle(gateway.name, checked)}
          />
          <span className="text-sm font-medium text-gray-700">
            {gateway.enabled ? 'Bật' : 'Tắt'}
          </span>
        </div>

        <Button
          onClick={() => onConfigure(gateway)}
          size="sm"
          variant="outline"
        >
          <Settings className="h-4 w-4 mr-2" />
          Cấu hình
        </Button>
      </div>
    </div>
  );
}


