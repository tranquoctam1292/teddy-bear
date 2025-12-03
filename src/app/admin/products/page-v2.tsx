'use client';

// Enhanced Products List Page - WordPress Style
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/schemas/product';
import { Button } from '@/components/admin/ui/button';
import { Badge } from '@/components/admin/ui/badge';
import { StatusTabs, BulkActions, FilterBar, Pagination } from '@/components/admin/list';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function AdminProductsPageV2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    hot: 0,
    trash: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchStatusCounts();
  }, [statusFilter, currentPage, searchQuery, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/admin/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    // Mock counts
    setStatusCounts({
      all: 156,
      active: 142,
      inactive: 14,
      hot: 25,
      trash: 3,
    });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) return;

    const productIds = Array.from(selectedProducts);
    
    try {
      if (action === 'trash') {
        await Promise.all(
          productIds.map(id =>
            fetch(`/api/admin/products/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: false, isDeleted: true }),
            })
          )
        );
        alert(`Đã chuyển ${productIds.length} sản phẩm vào thùng rác`);
      } else if (action === 'delete') {
        if (!confirm(`Xóa vĩnh viễn ${productIds.length} sản phẩm?`)) return;
        await Promise.all(
          productIds.map(id =>
            fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
          )
        );
        alert(`Đã xóa ${productIds.length} sản phẩm`);
      }

      setSelectedProducts(new Set());
      fetchProducts();
      fetchStatusCounts();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const toggleSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {pagination.total} sản phẩm</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm mới
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <StatusTabs
        tabs={[
          { label: 'Tất cả', value: 'all', count: statusCounts.all },
          { label: 'Đang bán', value: 'active', count: statusCounts.active },
          { label: 'Ẩn', value: 'inactive', count: statusCounts.inactive },
          { label: 'Hot', value: 'hot', count: statusCounts.hot },
          { label: 'Thùng rác', value: 'trash', count: statusCounts.trash },
        ]}
        currentStatus={statusFilter}
        baseUrl="/admin/products"
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col gap-4">
          <BulkActions
            selectedCount={selectedProducts.size}
            onAction={handleBulkAction}
          />

          <FilterBar
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categoryOptions={[
              { value: '', label: 'Tất cả danh mục' },
              { value: 'teddy', label: 'Teddy Bear' },
              { value: 'plush', label: 'Plush Toys' },
              { value: 'accessories', label: 'Phụ kiện' },
            ]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={fetchProducts}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedProducts.size === products.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-gray-600">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-gray-600">Không có sản phẩm nào</p>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <span className="font-medium">
                        {product.variants?.[0]?.price.toLocaleString('vi-VN')} ₫
                      </span>
                      {product.variants && product.variants.length > 1 && (
                        <span className="text-gray-500">
                          {' '}- {product.variants[product.variants.length - 1].price.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {product.variants?.length || 0} variants
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {product.isActive ? (
                          <><Eye className="w-3 h-3 mr-1" /> Hiển thị</>
                        ) : (
                          <><EyeOff className="w-3 h-3 mr-1" /> Ẩn</>
                        )}
                      </Badge>
                      {product.isHot && (
                        <Badge variant="destructive" className="text-xs">
                          Hot
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

