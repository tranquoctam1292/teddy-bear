import { NextRequest, NextResponse } from 'next/server';
import type {
  AddToCartRequest,
  UpdateUpsellServicesRequest,
  CartResponse,
  CartErrorResponse,
} from '@/lib/api-contracts/cart';
import type { Cart, CartItem } from '@/lib/schemas/cart';
import { getCollections } from '@/lib/db';

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const body: AddToCartRequest = await request.json();

    // Validate request
    if (!body.productId || !body.variantId || !body.quantity || body.quantity < 1) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Invalid request data',
        details: {
          message: 'productId, variantId, and quantity (>= 1) are required',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find product and variant from MongoDB
    const { products } = await getCollections();
    const productDoc = await products.findOne({ id: body.productId, isActive: true });
    
    if (!productDoc) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Product not found',
        details: {
          field: 'productId',
          message: `Product with ID ${body.productId} does not exist`,
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Format product (map minPrice to basePrice for compatibility)
    const productDocAny = productDoc as any;
    const product = {
      ...productDocAny,
      id: productDocAny.id || productDocAny._id.toString(),
      basePrice: productDocAny.minPrice || productDocAny.basePrice || 0,
      variants: productDocAny.variants || [],
      name: productDocAny.name || '',
      images: productDocAny.images || [],
    };

    const variant = product.variants.find((v: any) => v.id === body.variantId);
    if (!variant) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Variant not found',
        details: {
          field: 'variantId',
          message: `Variant with ID ${body.variantId} does not exist for this product`,
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check stock availability
    if (variant.stock < body.quantity) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Insufficient stock',
        details: {
          message: `Only ${variant.stock} items available in stock`,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create cart item
    const cartItem: CartItem = {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      quantity: body.quantity,
      image: variant.image || product.images[0] || '',
    };

    // TODO: Get or create cart from database
    // For now, return the cart item structure
    // In real implementation, you would:
    // 1. Get user's cart (from session or userId)
    // 2. Check if item already exists, update quantity if so
    // 3. Add new item if not exists
    // 4. Recalculate totals
    // 5. Save to database

    const mockCart: Cart = {
      items: [cartItem],
      upsellServices: {
        vacuumSealing: false,
        giftWrapping: false,
        expressShipping: false,
      },
      subtotal: cartItem.price * cartItem.quantity,
      upsellTotal: 0,
      shippingFee: 30000,
      total: cartItem.price * cartItem.quantity + 30000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response: CartResponse = {
      success: true,
      data: {
        cart: mockCart,
        totals: {
          subtotal: mockCart.subtotal,
          upsellTotal: mockCart.upsellTotal,
          shippingFee: mockCart.shippingFee,
          total: mockCart.total,
          itemCount: mockCart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Add to cart API error:', error);
    const errorResponse: CartErrorResponse = {
      success: false,
      error: 'Failed to add item to cart',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT /api/cart/upsell-services
 * Update upsell services
 */
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Check if it's upsell-services update
    if (url.pathname.includes('upsell-services')) {
      const body: UpdateUpsellServicesRequest = await request.json();
      
      // TODO: Update cart's upsell services in database
      // For now, return mock response
      const mockCart: Cart = {
        items: [],
        upsellServices: {
          vacuumSealing: body.upsellServices.vacuumSealing ?? false,
          giftWrapping: body.upsellServices.giftWrapping ?? false,
          expressShipping: body.upsellServices.expressShipping ?? false,
        },
        subtotal: 0,
        upsellTotal: body.upsellServices.giftWrapping ? 30000 : 0,
        shippingFee: body.upsellServices.expressShipping ? 50000 : 30000,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response: CartResponse = {
        success: true,
        data: {
          cart: mockCart,
          totals: {
            subtotal: mockCart.subtotal,
            upsellTotal: mockCart.upsellTotal,
            shippingFee: mockCart.shippingFee,
            total: mockCart.total,
            itemCount: 0,
          },
        },
      };

      return NextResponse.json(response);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
  } catch (error) {
    console.error('Update cart API error:', error);
    const errorResponse: CartErrorResponse = {
      success: false,
      error: 'Failed to update cart',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}


