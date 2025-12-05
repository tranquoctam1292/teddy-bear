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

    // For now, render content as-is
    // In the future, we can parse HTML and inject ProductLinkCard at specific positions
    return (
      <div
        className="prose prose-lg max-w-none prose-pink prose-headings:text-gray-900 prose-a:text-pink-600 prose-strong:text-gray-900"
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Table of Contents */}
          {post.tableOfContents && post.tableOfContents.length > 0 && (
            <TableOfContents items={post.tableOfContents} />
          )}

          {/* Sidebar Products */}
          {sidebarProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sản phẩm liên quan</h3>
              {sidebarProducts.map((linkedProduct, index) => (
                <ProductLinkCard
                  key={index}
                  productId={linkedProduct.productId}
                  displayType={linkedProduct.displayType}
                  customMessage={linkedProduct.customMessage}
                />
              ))}
            </div>
          )}

          {/* Social Share */}
          <SocialShareButtons
            url={`/blog/${post.slug}`}
            title={post.title}
            description={post.excerpt}
            variant="default"
          />
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
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
      </div>

      {/* Bottom Products */}
      {bottomProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm đề xuất</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bottomProducts.map((linkedProduct, index) => (
              <ProductLinkCard
                key={index}
                productId={linkedProduct.productId}
                displayType={linkedProduct.displayType}
                customMessage={linkedProduct.customMessage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

