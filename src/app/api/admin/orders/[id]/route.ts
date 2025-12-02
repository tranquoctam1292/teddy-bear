// Admin Order API Routes - Single Order Operations
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Order } from '@/lib/schemas/order';
import { mockOrders } from '@/lib/data/orders';

// GET - Get single order by orderId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const order = mockOrders.find((o) => o.orderId === params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const { orderStatus, trackingNumber } = body;

    const orderIndex = mockOrders.findIndex((o) => o.orderId === params.id);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate orderStatus
    const validStatuses: Order['orderStatus'][] = [
      'pending',
      'confirmed',
      'processing',
      'shipping',
      'delivered',
      'cancelled',
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    // Update order
    const existingOrder = mockOrders[orderIndex];
    mockOrders[orderIndex] = {
      ...existingOrder,
      orderStatus: orderStatus || existingOrder.orderStatus,
      trackingNumber: trackingNumber !== undefined ? trackingNumber : existingOrder.trackingNumber,
      updatedAt: new Date(),
      ...(orderStatus === 'delivered' && !existingOrder.deliveredAt
        ? { deliveredAt: new Date() }
        : {}),
    };

    return NextResponse.json({
      order: mockOrders[orderIndex],
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

