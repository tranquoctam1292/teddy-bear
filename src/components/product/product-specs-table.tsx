'use client';

/**
 * Product Specs Table
 * Bảng thông số kỹ thuật sản phẩm
 */

import type { Product } from '@/lib/schemas/product';

interface ProductSpecsTableProps {
  product: Product;
}

export default function ProductSpecsTable({ product }: ProductSpecsTableProps) {
  const specs = [
    {
      label: 'Kích thước',
      value: product.dimensions
        ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} cm`
        : 'Chưa có thông tin',
    },
    {
      label: 'Trọng lượng',
      value: product.weight ? `${product.weight} gram` : 'Chưa có thông tin',
    },
    {
      label: 'Chất liệu',
      value: product.material || 'Chưa có thông tin',
    },
    {
      label: 'Độ tuổi phù hợp',
      value: product.ageRange || 'Tất cả lứa tuổi',
    },
    {
      label: 'Bảo hành',
      value: product.warranty || 'Không có thông tin',
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-gray-900">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




