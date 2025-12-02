'use client';

// Admin Product Edit Page
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/lib/schemas/product';

export default function AdminProductEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && productId) {
      fetchProduct();
    }
  }, [status, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Không tìm thấy sản phẩm');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật sản phẩm');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !product) {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">{product.name}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </main>
    </>
  );
}

