// Admin Product API Routes - Single Product Operations
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Product, ProductVariant } from '@/lib/schemas/product';

// Mock database - Replace with actual MongoDB in production
// This should be imported from a shared store or database
const mockProducts: Product[] = [];

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
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
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
    } = body;

    const productIndex = mockProducts.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const existingProduct = mockProducts[productIndex];

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
      mockProducts[productIndex] = {
        ...existingProduct,
        name: name || existingProduct.name,
        slug: slug || existingProduct.slug,
        description: description || existingProduct.description,
        category: category || existingProduct.category,
        tags: tags !== undefined ? tags : existingProduct.tags,
        images: images !== undefined ? images : existingProduct.images,
        variants: variantsWithIds,
        minPrice,
        maxPrice: prices.length > 1 ? maxPrice : undefined,
        isHot: isHot !== undefined ? isHot : existingProduct.isHot,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        metaTitle: metaTitle !== undefined ? metaTitle : existingProduct.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingProduct.metaDescription,
        updatedAt: new Date(),
      };
    } else {
      // Update without changing variants
      mockProducts[productIndex] = {
        ...existingProduct,
        name: name || existingProduct.name,
        slug: slug || existingProduct.slug,
        description: description || existingProduct.description,
        category: category || existingProduct.category,
        tags: tags !== undefined ? tags : existingProduct.tags,
        images: images !== undefined ? images : existingProduct.images,
        isHot: isHot !== undefined ? isHot : existingProduct.isHot,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        metaTitle: metaTitle !== undefined ? metaTitle : existingProduct.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingProduct.metaDescription,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      product: mockProducts[productIndex],
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
    const productIndex = mockProducts.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    mockProducts.splice(productIndex, 1);

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


