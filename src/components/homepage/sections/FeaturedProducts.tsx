// Featured Products Section Component - Phase 3: Product Sections Redesign
// NOTE: This is a Server Component (async function) that uses database
// It should only be imported in Server Components, not Client Components
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import { ProductGrid } from './product-grid';
import type { FeaturedProductsContent } from '@/lib/types/homepage';
import type { SectionComponentProps } from '@/lib/types/homepage';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export async function FeaturedProducts({
  content,
}: SectionComponentProps<FeaturedProductsContent>) {
  // Fetch products based on selection method
  // For Phase 3 demo, use mock data. In production, uncomment database fetch below
  // TODO: Uncomment when ready to use database
  // const dbProducts = await getProducts(content);
  // const products = dbProducts.map(transformDbProductToHomepageProduct);

  // Phase 3: Use mock data
  const products = MOCK_PRODUCTS.slice(0, content.limit || 8);

  if (products.length === 0) {
    return (
      <Container variant="standard" padding="desktop">
        <p className="text-center text-muted-foreground py-12">
          No products found. Please configure product selection.
        </p>
      </Container>
    );
  }

  const columns = (content.columns || 4) as 2 | 3 | 4 | 5 | 6;

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={content.heading || 'Sản phẩm nổi bật'}
        subheading={content.subheading || 'Khám phá bộ sưu tập đa dạng của chúng tôi'}
        alignment="center"
        showViewAll={!!content.viewMoreButton}
        viewAllLink={content.viewMoreButton?.link || '/products'}
        viewAllText={content.viewMoreButton?.text || 'Xem tất cả'}
      />

      {/* Product Grid */}
      <ProductGrid
        products={products}
        columns={columns}
        showQuickView={content.showPrice !== false}
        showWishlist={true}
      />
    </Container>
  );
}

// Helper: Fetch products from database (commented for Phase 3)
// TODO: Uncomment when ready to use database instead of mock data
// async function getProducts(content: FeaturedProductsContent) {
//   const { getSectionProducts } = await import('@/lib/db-sections');
//   return getSectionProducts({
//     productSelection: content.productSelection,
//     productIds: content.productIds,
//     category: content.category,
//     tag: content.tag,
//     sortBy: content.sortBy,
//     limit: content.limit || 8,
//   });
// }
