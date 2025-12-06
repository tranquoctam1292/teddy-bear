'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/schemas/post';
import { ProductComparisonView } from './product-comparison-view';
import { GiftGuideView } from './gift-guide-view';
import { ProductLinkCard } from './product-link-card';
import { TableOfContents } from './table-of-contents';
import { SocialShareButtons } from './social-share-buttons';
import { ReadingTimeBadge } from './reading-time-badge';
import { ContentCallout } from './content-callout';
import { ContentDivider } from './content-divider';
import { CTAButton } from './cta-button';

interface BlogPostRendererProps {
  post: Post;
  className?: string;
}

export function BlogPostRenderer({ post, className }: BlogPostRendererProps) {
  const template = post.template || 'default';

  // Extract linked products by position
  const inlineProducts = useMemo(
    () => post.linkedProducts?.filter((lp) => lp.position === 'inline') || [],
    [post.linkedProducts]
  );

  const sidebarProducts = useMemo(
    () => post.linkedProducts?.filter((lp) => lp.position === 'sidebar') || [],
    [post.linkedProducts]
  );

  const bottomProducts = useMemo(
    () => post.linkedProducts?.filter((lp) => lp.position === 'bottom') || [],
    [post.linkedProducts]
  );

  // Parse content and inject inline products
  const renderContent = () => {
    if (!post.content) return null;

    // Enhanced prose styling - now using Tailwind Typography config
    // All styling is defined in tailwind.config.ts for consistency
    // Text alignment matches title (left-aligned, full width, no margin)
    return (
      <div
        className={cn(
          'prose prose-lg',
          // Force full width - override any max-width from prose config
          '!max-w-none w-full',
          // Remove all margins/padding to align perfectly with title
          '!m-0 !p-0',
          // Override max-width for full-width elements (images, tables)
          'prose-img:max-w-full',
          // Table responsive wrapper - wrap tables in scrollable container
          '[&_table]:w-full [&_table]:block [&_table]:overflow-x-auto',
          '[&_table]:-mx-4 [&_table]:px-4',
          '[&_table]:md:mx-0 [&_table]:md:px-0',
          // Mobile adjustments - ensure font size ≥ 16px
          'prose-sm sm:prose-base md:prose-lg',
          // Ensure text aligns with title (left-aligned)
          'text-left',
          // Override prose default max-width for all child elements (p, h1, h2, etc.)
          '[&>*]:!max-w-none [&_p]:!max-w-none [&_h1]:!max-w-none [&_h2]:!max-w-none [&_h3]:!max-w-none [&_h4]:!max-w-none'
        )}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    );
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Template-specific rendering (before main content) */}
      {template === 'gift-guide' && (
        <GiftGuideView
          templateData={post.templateData}
          linkedProducts={post.linkedProducts}
        />
      )}

      {/* Main Content - No nested grid, content flows directly */}
      <div className="space-y-8">
        {/* Default/Review Template Content */}
        {(template === 'default' || template === 'review') && (
          <>
            {renderContent()}

            {/* Inline Products (inserted in content flow) */}
            {inlineProducts.map((linkedProduct, index) => (
              <ProductLinkCard
                key={index}
                productId={linkedProduct.productId}
                displayType={linkedProduct.displayType}
                customMessage={linkedProduct.customMessage}
                className="my-8"
              />
            ))}

            {/* Comparison Table (for review template) */}
            {template === 'review' && post.comparisonTable && (
              <div className="my-8">
                <ProductComparisonView comparisonData={post.comparisonTable} />
              </div>
            )}
          </>
        )}

        {/* Gift Guide Template: Content after GiftGuideView */}
        {template === 'gift-guide' && renderContent()}
      </div>

      {/* Bottom Products with CTA */}
      {bottomProducts.length > 0 && (
        <>
          <ContentDivider variant="decorative" />
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 md:p-12 border border-pink-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Sản phẩm đề xuất</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá những sản phẩm gấu bông cao cấp được đề xuất trong bài viết này
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {bottomProducts.map((linkedProduct, index) => (
                <ProductLinkCard
                  key={index}
                  productId={linkedProduct.productId}
                  displayType={linkedProduct.displayType}
                  customMessage={linkedProduct.customMessage}
                />
              ))}
            </div>
            {/* CTA Button */}
            <div className="text-center">
              <CTAButton
                text="Xem tất cả sản phẩm"
                href="/products"
                variant="primary"
                icon="shopping"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

