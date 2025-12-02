import { NextRequest, NextResponse } from 'next/server';
import type { CheckoutRequest, CheckoutResponse, CheckoutErrorResponse } from '@/lib/api-contracts/checkout';
import type { Order, ShippingAddress, UpsellServices as OrderUpsellServices, PaymentDetails } from '@/lib/schemas/order';

// Using CheckoutRequest from api-contracts

// Validate request data (using CheckoutRequest from contracts)
function validateCheckoutRequest(data: unknown): data is CheckoutRequest {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const d = data as Record<string, unknown>;
  
  if (!d.items || !Array.isArray(d.items) || d.items.length === 0) {
    return false;
  }
  if (!d.shippingAddress || typeof d.shippingAddress !== 'object') {
    return false;
  }
  if (!d.paymentDetails || typeof d.paymentDetails !== 'object') {
    return false;
  }
  const paymentDetails = d.paymentDetails as Record<string, unknown>;
  if (!paymentDetails.method || typeof paymentDetails.method !== 'string') {
    return false;
  }
  if (!d.guestEmail || typeof d.guestEmail !== 'string') {
    return false;
  }
  if (!d.upsellServices || typeof d.upsellServices !== 'object') {
    return false;
  }
  // Optional fields: subtotal, total, shippingFee, upsellTotal are optional and will be recalculated server-side
  return true;
}

// Validate shipping info
function validateShippingInfo(info: ShippingAddress): { valid: boolean; error?: string } {
  if (!info.fullName?.trim()) {
    return { valid: false, error: 'Họ tên không được để trống' };
  }
  if (!info.phone?.trim()) {
    return { valid: false, error: 'Số điện thoại không được để trống' };
  }
  if (!/^(0|\+84)[0-9]{9,10}$/.test(info.phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }
  if (!info.email?.trim()) {
    return { valid: false, error: 'Email không được để trống' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }
  if (!info.address?.trim()) {
    return { valid: false, error: 'Địa chỉ không được để trống' };
  }
  if (!info.ward?.trim()) {
    return { valid: false, error: 'Phường/Xã không được để trống' };
  }
  if (!info.district?.trim()) {
    return { valid: false, error: 'Quận/Huyện không được để trống' };
  }
  if (!info.city?.trim()) {
    return { valid: false, error: 'Thành phố không được để trống' };
  }
  return { valid: true };
}

// Generate order ID
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
}

// Simulate order creation (in real app, save to database)
async function createOrder(data: CheckoutRequest): Promise<Order> {
  const orderId = generateOrderId();
  
  // Calculate totals server-side for security
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const upsellTotal = data.upsellServices.isGiftWrapped ? data.upsellServices.giftWrapFee : 0;
  const shippingFee = data.upsellServices.expressShipping ? 50000 : 30000;
  const total = subtotal + upsellTotal + shippingFee;
  
  // Map upsell services to schema format
  const upsellServices: OrderUpsellServices = {
    vacuumSealing: data.upsellServices.vacuumSealing,
    isGiftWrapped: data.upsellServices.isGiftWrapped,
    giftWrapFee: data.upsellServices.giftWrapFee || 0,
    expressShipping: data.upsellServices.expressShipping,
  };
  
  const paymentDetails: PaymentDetails = {
    method: data.paymentDetails.method,
    status: 'pending',
    amount: total,
  };
  
  const order: Order = {
    orderId,
    guestEmail: data.guestEmail,
    userId: data.userId,
    items: data.items,
    shippingAddress: data.shippingAddress,
    shippingFee,
    shippingMethod: data.shippingMethod || 'standard',
    upsellServices,
    subtotal,
    upsellTotal,
    shippingTotal: shippingFee,
    total,
    paymentDetails,
    orderStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // TODO: Save to database (MongoDB, PostgreSQL, etc.)
  // await db.orders.insertOne(order);
  
  // TODO: Send confirmation email
  // await sendOrderConfirmationEmail(order);
  
  // TODO: Process payment based on payment method
  // if (data.paymentMethod === 'momo' || data.paymentMethod === 'vnpay') {
  //   const paymentResult = await processPayment(order);
  //   if (!paymentResult.success) {
  //     throw new Error('Payment processing failed');
  //   }
  // }

  return order;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request structure
    if (!validateCheckoutRequest(body)) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.' },
        { status: 400 }
      );
    }

    // Validate shipping info
    const shippingValidation = validateShippingInfo(body.shippingAddress);
    if (!shippingValidation.valid) {
      return NextResponse.json(
        { error: shippingValidation.error },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'bank_transfer', 'momo', 'vnpay'];
    if (!validPaymentMethods.includes(body.paymentDetails.method)) {
      return NextResponse.json(
        { error: 'Phương thức thanh toán không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Validate guest email
    if (!body.guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.guestEmail)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Create order
    const order = await createOrder(body);

    // TODO: Save to MongoDB
    // const { orders } = await getCollections();
    // await orders.insertOne(order);

    // Return success response
    const response: CheckoutResponse = {
      success: true,
      data: {
        orderId: order.orderId,
        order: {
          id: order.orderId,
          status: order.orderStatus,
          total: order.total,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          paymentMethod: order.paymentDetails.method,
          estimatedDelivery: order.estimatedDelivery?.toISOString(),
        },
        message: 'Đơn hàng đã được tạo thành công',
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Checkout API error:', error);
    const errorResponse: CheckoutErrorResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET endpoint to retrieve order status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch order from MongoDB
    // const { orders } = await getCollections();
    // const order = await orders.findOne({ orderId });
    // 
    // if (!order) {
    //   return NextResponse.json(
    //     { success: false, error: 'Order not found' },
    //     { status: 404 }
    //   );
    // }
    
    // For now, return mock response
    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: 'pending' as const,
        total: 0,
        itemCount: 0,
        shippingAddress: {} as ShippingAddress,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get order API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve order',
      },
      { status: 500 }
    );
  }
}
