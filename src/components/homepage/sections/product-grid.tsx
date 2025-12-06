// Product Grid Component - Phase 3: Product Sections Redesign
// Responsive grid layout for product display
import type { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5 | 6;
  showQuickView?: boolean;
  showWishlist?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  showQuickView = true,
  showWishlist = true,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có sản phẩm nào</p>
      </div>
    );
  }

  // Grid classes based on columns
  const gridClasses = cn(
    'grid gap-3 md:gap-6',
    // Mobile: Always 2 columns, Desktop: Based on columns prop
    columns === 2 && 'grid-cols-2 md:grid-cols-2',
    columns === 3 && 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
    columns === 5 && 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    columns === 6 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    className
  );

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

