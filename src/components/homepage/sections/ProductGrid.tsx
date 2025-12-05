// Product Grid Section Component
// NOTE: This is a Server Component (async function) that uses database
// It should only be imported in Server Components, not Client Components
import Link from 'next/link';
import { SectionComponentProps } from '@/lib/types/homepage';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
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

export async function ProductGrid({ content }: SectionComponentProps<ProductGridContent>) {
  // Fetch products
  const products = await getProducts(content);

  const columns = content.columns || 4;

  return (
    <Container variant="standard" padding="desktop">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <SectionHeader
          heading={content.heading || ''}
          subheading={content.subheading}
          alignment="center"
          showViewAll={!!content.viewMoreButton}
          viewAllLink={content.viewMoreButton?.link}
          viewAllText={content.viewMoreButton?.text}
        />
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
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {/* View More Button - Fallback if not using SectionHeader */}
          {content.viewMoreButton && !content.heading && (
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href={content.viewMoreButton.link}>{content.viewMoreButton.text}</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

// Helper: Fetch products based on content settings
async function getProducts(content: ProductGridContent) {
  try {
    // Lazy-load database helper to avoid bundling issues
    const { getSectionProducts } = await import('@/lib/db-sections');

    // Map 'name' sort to 'newest' since db-sections doesn't support 'name' yet
    const validSortBy =
      content.sortBy === 'name'
        ? 'newest'
        : content.sortBy &&
          ['newest', 'popular', 'price-asc', 'price-desc'].includes(content.sortBy)
        ? content.sortBy
        : undefined;

    return getSectionProducts({
      productSelection: content.productSelection,
      productIds: content.productIds,
      category: content.category,
      tag: content.tag,
      sortBy: validSortBy,
      limit: content.limit || 12,
    });
  } catch (error) {
    console.error('Error fetching products for grid:', error);
    return [];
  }
}
