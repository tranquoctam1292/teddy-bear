'use client';

// Checkbox gói quà, hút chân không
// Vacuum Sealing: Free, Gift Wrapping: +30,000 VND, Express Shipping: Conditional
import { useCartStore } from '@/store/useCartStore';
import { UPSELL_SERVICES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Gift, Package, Truck } from 'lucide-react';

export default function UpsellServices() {
  const { upsellServices, updateUpsellServices, getUpsellTotal } = useCartStore();

  const handleToggle = (service: keyof typeof upsellServices) => {
    updateUpsellServices({
      [service]: !upsellServices[service],
    });
  };

  return (
    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Dịch vụ bổ sung
      </h3>

      {/* Vacuum Sealing - Free */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.vacuumSealing}
          onChange={() => handleToggle('vacuumSealing')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.VACUUM_SEALING.name}
            </span>
            <span className="text-sm text-green-600 font-semibold">Miễn phí</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.VACUUM_SEALING.description}
          </p>
        </div>
      </label>

      {/* Gift Wrapping - Paid */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.giftWrapping}
          onChange={() => handleToggle('giftWrapping')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.GIFT_WRAPPING.name}
            </span>
            <span className="text-sm text-pink-600 font-semibold">
              +{formatCurrency(UPSELL_SERVICES.GIFT_WRAPPING.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.GIFT_WRAPPING.description}
          </p>
        </div>
      </label>

      {/* Express Shipping - Conditional */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.expressShipping}
          onChange={() => handleToggle('expressShipping')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.EXPRESS_SHIPPING.name}
            </span>
            <span className="text-sm text-pink-600 font-semibold">
              +{formatCurrency(UPSELL_SERVICES.EXPRESS_SHIPPING.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.EXPRESS_SHIPPING.description}
          </p>
        </div>
      </label>

      {/* Total Upsell Price */}
      {getUpsellTotal() > 0 && (
        <div className="pt-4 border-t border-pink-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tổng phí dịch vụ:</span>
            <span className="text-lg font-bold text-pink-600">
              {formatCurrency(getUpsellTotal())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
