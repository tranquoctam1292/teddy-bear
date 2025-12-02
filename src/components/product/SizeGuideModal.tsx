'use client';

// Popup so sánh kích thước
// Hướng dẫn chọn size - giúp khách hàng hình dung kích thước thực tế
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: Array<{ id: string; size: string; price: number }>;
}

const sizeComparisons = [
  {
    size: '80cm',
    description: 'Kích thước nhỏ gọn',
    comparison: 'Khoảng bằng một chiếc gối ôm',
    height: '80cm',
    suitable: 'Phù hợp để đặt trên giường, ghế sofa',
  },
  {
    size: '1m2',
    description: 'Kích thước trung bình',
    comparison: 'Khoảng bằng một đứa trẻ 4-5 tuổi',
    height: '120cm',
    suitable: 'Phù hợp để ôm khi ngủ, trang trí phòng',
  },
  {
    size: '1m5',
    description: 'Kích thước lớn',
    comparison: 'Khoảng bằng một người lớn ngồi',
    height: '150cm',
    suitable: 'Món quà ấn tượng, trang trí không gian lớn',
  },
  {
    size: '2m',
    description: 'Kích thước khổng lồ',
    comparison: 'Cao hơn một người lớn',
    height: '200cm',
    suitable: 'Món quà đặc biệt, trang trí sự kiện',
  },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
  variants,
}: SizeGuideModalProps) {
  // Get available sizes from variants
  const availableSizes = variants.map((v) => v.size);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Ruler className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Hướng dẫn chọn kích thước
                    </h2>
                    <p className="text-sm text-gray-600">
                      So sánh kích thước để chọn sản phẩm phù hợp
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Visual Size Comparison */}
                <div className="mb-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    So sánh trực quan
                  </h3>
                  <div className="flex items-end justify-center gap-4 h-64">
                    {sizeComparisons
                      .filter((s) => availableSizes.includes(s.size))
                      .map((sizeInfo) => {
                        const heightPercent =
                          sizeInfo.size === '80cm'
                            ? 40
                            : sizeInfo.size === '1m2'
                            ? 60
                            : sizeInfo.size === '1m5'
                            ? 75
                            : 100;

                        return (
                          <div
                            key={sizeInfo.size}
                            className="flex flex-col items-center gap-2 flex-1"
                          >
                            <div
                              className="w-full bg-gradient-to-t from-pink-400 to-pink-500 rounded-t-lg shadow-lg flex items-end justify-center"
                              style={{ height: `${heightPercent}%` }}
                            >
                              <span className="text-white font-bold text-sm mb-2">
                                {sizeInfo.size}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 text-center font-medium">
                              {sizeInfo.height}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Size Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  {sizeComparisons
                    .filter((s) => availableSizes.includes(s.size))
                    .map((sizeInfo) => (
                      <div
                        key={sizeInfo.size}
                        className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-pink-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-pink-600 font-bold text-lg">
                              {sizeInfo.size}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {sizeInfo.description}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.height} chiều cao
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-medium text-sm">
                              ≈
                            </span>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.comparison}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-medium text-sm">
                              ✓
                            </span>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.suitable}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💡 Mẹo chọn size
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                      Nếu mua làm quà, hãy cân nhắc không gian nhà người nhận
                    </li>
                    <li>
                      Size lớn hơn thường có giá trị cảm xúc cao hơn nhưng cần không gian lớn
                    </li>
                    <li>
                      Size nhỏ gọn phù hợp để mang theo khi đi du lịch
                    </li>
                    <li>
                      Nếu không chắc chắn, hãy chọn size trung bình (1m2) - phù hợp nhất
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
