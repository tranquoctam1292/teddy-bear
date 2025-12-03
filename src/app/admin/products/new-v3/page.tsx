'use client';

// Test Page for ProductFormV3
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFormV3 from '@/components/admin/ProductFormV3';

export default function NewProductV3Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      alert('Sản phẩm đã được tạo thành công!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy?')) {
      router.push('/admin/products');
    }
  };

  return (
    <ProductFormV3
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

