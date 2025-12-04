// Product Grid Section Component
import Link from 'next/link';
import { getCollections } from '@/lib/db';
import { SectionComponentProps } from '@/lib/types/homepage';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGridContent {
  heading?: string;
  subheading?: string;
  
  // Product Selection
  productSelection: 'manual' | 'automatic' | 'category' | 'tag';
  productIds?: string[];
  category?: string;
  tag?: string;
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'name';
  limit?: number;
  
  // Display Options
  columns?: number; // 2, 3, 4, 5, 6
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  
  // View More
  viewMoreButton?: {
    text: string;
    link: string;
  };
}

export async function ProductGrid({
  content,
  layout,
  isPreview,
}: SectionComponentProps<ProductGridContent>) {
  // Fetch products
  const products = await getProducts(content);
  
  const columns = content.columns || 4;
  const showPrice = content.showPrice !== false;
  const showRating = content.showRating !== false;
  const showAddToCart = content.showAddToCart !== false;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center mb-12">
          {content.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              'grid gap-6 mb-8',
              columns === 2 && 'grid-cols-1 md:grid-cols-2',
              columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
              columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
              columns === 5 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
              columns === 6 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            )}
          >
            {products.map((product: any) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>

          {/* View More Button */}
          {content.viewMoreButton && (
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href={content.viewMoreButton.link}>
                  {content.viewMoreButton.text}
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper: Fetch products based on content settings
async function getProducts(content: ProductGridContent) {
  try {
    const { products } = await getCollections();
    
    let query: any = { status: 'published' };
    const limit = content.limit || 12;
    
    // Build query based on selection method
    switch (content.productSelection) {
      case 'category':
        if (content.category) {
          query.category = content.category;
        }
        break;
      
      case 'tag':
        if (content.tag) {
          query.tags = { $in: [content.tag] };
        }
        break;
      
      case 'manual':
        if (content.productIds && content.productIds.length > 0) {
          query._id = { $in: content.productIds };
        }
        break;
      
      case 'automatic':
      default:
        // No additional filter, get all products
        break;
    }
    
    // Sorting
    let sort: any = {};
    switch (content.sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { views: -1, sales: -1 };
        break;
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    const productList = await products
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray();
    
    return productList;
  } catch (error) {
    console.error('Error fetching products for grid:', error);
    return [];
  }
}

