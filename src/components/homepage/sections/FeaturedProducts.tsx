// Featured Products Section Component - Phase 3: Product Sections Redesign
// NOTE: This is a Server Component (async function) that uses database
// It should only be imported in Server Components, not Client Components
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import { ProductGrid } from './product-grid';
import type { FeaturedProductsContent } from '@/lib/types/homepage';
import type { SectionComponentProps } from '@/lib/types/homepage';
import type { Product } from '@/types';

export async function FeaturedProducts(
  props: SectionComponentProps<FeaturedProductsContent> | { content: FeaturedProductsContent }
) {
  const { content } = props;
  // Fetch products from database
  const dbProducts = await getProducts(content);
  const products = dbProducts.map(transformDbProductToProduct);

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

// Helper: Fetch products from database
async function getProducts(content: FeaturedProductsContent) {
  try {
    const { getSectionProducts } = await import('@/lib/db-sections');
    return getSectionProducts({
      productSelection: content.productSelection,
      productIds: content.productIds,
      category: content.category,
      tag: content.tag,
      sortBy: content.sortBy,
      limit: content.limit || 8,
    });
  } catch (error) {
    console.error('Error fetching products for FeaturedProducts:', error);
    return [];
  }
}

// Helper: Transform database product to Product type
function transformDbProductToProduct(dbProduct: any): Product {
  const { _id, ...productData } = dbProduct;
  
  // Ensure images array exists
  const images = Array.isArray(productData.images) 
    ? productData.images 
    : productData.image 
    ? [productData.image]
    : [];
  
  // Ensure variants array exists
  const variants = Array.isArray(productData.variants) ? productData.variants : [];
  
  return {
    id: productData.id || _id.toString(),
    name: productData.name,
    slug: productData.slug,
    description: productData.description || '',
    category: productData.category || '',
    tags: Array.isArray(productData.tags) ? productData.tags : [],
    basePrice: productData.minPrice || 0,
    maxPrice: productData.maxPrice,
    images: images,
    variants: variants,
    isHot: productData.isHot || false,
    // Pass through additional fields that ProductCard might use
    rating: productData.rating,
    material: productData.material,
    ageRange: productData.ageRange,
  } as Product;
}
