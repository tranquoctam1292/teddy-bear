// Admin Product API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Product, ProductVariant } from '@/lib/schemas/product';
import { ObjectId } from 'mongodb';

// Helper to generate unique ID for variants
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

    const { products } = await getCollections();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // Get total count for pagination
    const total = await products.countDocuments(query);

    // Fetch products with pagination
    const productsList = await products
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Convert MongoDB documents to Product format (remove _id, use id)
    const formattedProducts = productsList.map((doc: any) => {
      const { _id, ...product } = doc;
      return {
        ...product,
        id: product.id || _id.toString(),
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
      seo,
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

    // Check if slug already exists
    const { products } = await getCollections();
    const existingProduct = await products.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
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
      id: new ObjectId().toString(),
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
      seo: seo && Object.keys(seo).length > 0 ? seo : undefined,
    };

    // Insert into MongoDB
    await products.insertOne(newProduct);

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch(err => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

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
