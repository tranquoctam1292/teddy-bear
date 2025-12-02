// Admin Product API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Product, ProductVariant } from '@/lib/schemas/product';

// Mock database - Replace with actual MongoDB in production
const mockProducts: Product[] = [];

// Helper to generate unique ID
function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateVariantId(): string {
  return `var_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all products with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Filter products
    let filteredProducts = [...mockProducts];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.slug.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Validation
    if (!name || !slug || !description || !category || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.size || variant.price === undefined || variant.stock === undefined) {
        return NextResponse.json(
          { error: 'Each variant must have size, price, and stock' },
          { status: 400 }
        );
      }
    }

    // Calculate min/max price
    const prices = variants.map((v: ProductVariant) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Generate variant IDs
    const variantsWithIds = variants.map((variant: ProductVariant) => ({
      ...variant,
      id: variant.id || generateVariantId(),
    }));

    // Create product
    const newProduct: Product = {
      id: generateId(),
      name,
      slug,
      description,
      category,
      tags: tags || [],
      minPrice,
      maxPrice: prices.length > 1 ? maxPrice : undefined,
      images: images || [],
      variants: variantsWithIds,
      isHot: isHot || false,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaTitle,
      metaDescription,
    };

    mockProducts.push(newProduct);

    return NextResponse.json(
      { product: newProduct, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


