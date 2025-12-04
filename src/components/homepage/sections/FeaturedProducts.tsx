// Featured Products Section Component
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedProductsContent } from '@/lib/types/homepage';
import { ProductCard } from '@/components/shop/ProductCard';
import { getCollections } from '@/lib/db';

interface FeaturedProductsProps {
  content: FeaturedProductsContent;
  layout: any;
  isPreview?: boolean;
}

export async function FeaturedProducts({
  content,
  layout,
  isPreview,
}: FeaturedProductsProps) {
  // Fetch products based on selection method
  const products = await getProducts(content);

  if (products.length === 0) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">
          No products found. Please configure product selection.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="mb-8 text-center">
          {content.heading && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="mt-2 text-lg text-muted-foreground">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${content.columns || 4}, minmax(0, 1fr))`,
        }}
      >
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            showPrice={content.showPrice}
            showRating={content.showRating}
            showAddToCart={content.showAddToCart}
          />
        ))}
      </div>

      {/* View More Button */}
      {content.viewMoreButton && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={content.viewMoreButton.link}>
              {content.viewMoreButton.text}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

async function getProducts(content: FeaturedProductsContent) {
  const { products } = await getCollections();

  let query: any = { status: 'active' };
  let sort: any = {};
  const limit = content.limit || 8;

  // Build query based on selection method
  switch (content.productSelection) {
    case 'manual':
      if (content.productIds && content.productIds.length > 0) {
        query._id = { $in: content.productIds };
      }
      break;

    case 'category':
      if (content.category) {
        query.category = content.category;
      }
      break;

    case 'tag':
      if (content.tag) {
        query.tags = content.tag;
      }
      break;

    case 'automatic':
    default:
      // Will use sorting only
      break;
  }

  // Apply sorting
  switch (content.sortBy) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'popular':
      sort = { views: -1 }; // Assuming views field exists
      break;
    case 'price-asc':
      sort = { price: 1 };
      break;
    case 'price-desc':
      sort = { price: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const productsList = await products
    .find(query)
    .sort(sort)
    .limit(limit)
    .toArray();

  return productsList;
}

