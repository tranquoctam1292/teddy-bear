// Admin Product API Routes - Single Product Operations (MongoDB)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Product, ProductVariant } from '@/lib/schemas/product';
import { ObjectId } from 'mongodb';

function generateVariantId(): string {
  return `var_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { products } = await getCollections();

    // Try to find by id field first, then by _id
    let product = await products.findOne({ id });
    if (!product) {
      // Try MongoDB _id if id doesn't match
      try {
        product = await products.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Format product (remove _id, ensure id exists)
    const { _id, ...productData } = product as any;
    const formattedProduct = {
      ...productData,
      id: productData.id || _id.toString(),
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      tags,
      images,
      variants,
      isHot,
      isActive,
      metaTitle,
      metaDescription,
      seo,
    } = body;

    const { products } = await getCollections();

    // Find product
    let product = await products.findOne({ id });
    if (!product) {
      try {
        product = await products.findOne({ _id: new ObjectId(id) });
      } catch {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== product.slug) {
      const existingProduct = await products.findOne({ slug, id: { $ne: id } });
      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Validate variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (!variant.size || variant.price === undefined || variant.stock === undefined) {
          return NextResponse.json(
            { error: 'Each variant must have size, price, and stock' },
            { status: 400 }
          );
        }
      }

      // Generate IDs for new variants
      const variantsWithIds = variants.map((variant: ProductVariant) => ({
        ...variant,
        id: variant.id || generateVariantId(),
      }));

      // Calculate min/max price
      const prices = variantsWithIds.map((v: ProductVariant) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Update product
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (images !== undefined) updateData.images = images;
      if (isHot !== undefined) updateData.isHot = isHot;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
      if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
      if (seo !== undefined) {
        // Clean SEO data - remove empty strings
        const cleanSeo = seo && Object.keys(seo).length > 0 
          ? {
              ...(seo.canonicalUrl && { canonicalUrl: seo.canonicalUrl }),
              ...(seo.robots && { robots: seo.robots }),
              ...(seo.focusKeyword && { focusKeyword: seo.focusKeyword }),
              ...(seo.altText && { altText: seo.altText }),
            }
          : null;
        updateData.seo = cleanSeo && Object.keys(cleanSeo).length > 0 ? cleanSeo : null;
      }

      updateData.variants = variantsWithIds;
      updateData.minPrice = minPrice;
      updateData.maxPrice = prices.length > 1 ? maxPrice : undefined;

      await products.updateOne(
        { id },
        { $set: updateData }
      );
    } else {
      // Update without changing variants
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (images !== undefined) updateData.images = images;
      if (isHot !== undefined) updateData.isHot = isHot;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
      if (metaDescription !== undefined) updateData.metaDescription = metaDescription;

      await products.updateOne(
        { id },
        { $set: updateData }
      );
    }

    // Fetch updated product
    const updatedProduct = await products.findOne({ id });
    const { _id, ...productData } = updatedProduct as any;
    const formattedProduct = {
      ...productData,
      id: productData.id || _id.toString(),
    };

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch(err => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

    return NextResponse.json({
      product: formattedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { products } = await getCollections();

    // Try to find and delete by id field first
    let result = await products.deleteOne({ id });
    
    // If not found, try MongoDB _id
    if (result.deletedCount === 0) {
      try {
        result = await products.deleteOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
