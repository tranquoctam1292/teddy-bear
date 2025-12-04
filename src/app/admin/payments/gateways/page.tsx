'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { PaymentGateway } from '@/lib/types/payment';
import {
  GatewayCard,
  GatewayConfigModal,
} from '@/components/admin/payments';

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configuringGateway, setConfiguringGateway] = useState<any>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/payments/gateways');
      if (!response.ok) throw new Error('Failed to load gateways');

      const data = await response.json();
      setGateways(data.gateways || []);
    } catch (error) {
      console.error('Error loading gateways:', error);
      alert('Không thể tải cổng thanh toán!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (name: string, enabled: boolean) => {
    try {
      const gateway = gateways.find((g) => g.name === name);
      if (!gateway) return;

      const response = await fetch('/api/admin/payments/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          enabled,
          testMode: gateway.testMode,
          config: gateway.config || {},
        }),
      });

      if (!response.ok) throw new Error('Failed to toggle gateway');

      loadGateways();
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleConfigure = (gateway: any) => {
    setConfiguringGateway(gateway);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = async (config: any) => {
    try {
      const response = await fetch('/api/admin/payments/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to save config');

      alert('Lưu cấu hình thành công!');
      setIsConfigModalOpen(false);
      setConfiguringGateway(null);
      loadGateways();
    } catch (error) {
      console.error('Save config error:', error);
      throw error;
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-7 w-7" />
              Cổng thanh toán
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và cấu hình các phương thức thanh toán
            </p>
          </div>
          <Button onClick={loadGateways} variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">
            💡 Hướng dẫn cấu hình
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Bật/tắt cổng thanh toán bằng công tắc</li>
            <li>• Click "Cấu hình" để nhập API keys và thông tin kết nối</li>
            <li>• Sử dụng Test Mode để kiểm tra trước khi đưa vào production</li>
            <li>• Mỗi cổng cần cấu hình riêng theo hướng dẫn của nhà cung cấp</li>
          </ul>
        </div>
      </div>

      {/* Gateways Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map((gateway) => (
            <GatewayCard
              key={gateway.name}
              gateway={gateway}
              onToggle={handleToggle}
              onConfigure={handleConfigure}
            />
          ))}
        </div>
      )}

      {/* Configuration Modal */}
      <GatewayConfigModal
        gateway={configuringGateway}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setConfiguringGateway(null);
        }}
        onSave={handleSaveConfig}
      />

      {/* Documentation */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">📚 Tài liệu tích hợp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://sandbox.vnpayment.vn/apis/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏦</div>
              <div>
                <p className="font-medium text-gray-900">VNPay API</p>
                <p className="text-sm text-gray-600">
                  Hướng dẫn tích hợp VNPay
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://developers.momo.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <p className="font-medium text-gray-900">MoMo Developer</p>
                <p className="text-sm text-gray-600">
                  Tài liệu API MoMo
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://developer.paypal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">💳</div>
              <div>
                <p className="font-medium text-gray-900">PayPal Developer</p>
                <p className="text-sm text-gray-600">
                  PayPal integration docs
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://stripe.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="font-medium text-gray-900">Stripe Docs</p>
                <p className="text-sm text-gray-600">
                  Complete Stripe documentation
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}



