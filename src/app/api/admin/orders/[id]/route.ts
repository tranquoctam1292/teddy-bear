// Admin Order API Routes - Single Order Operations (MongoDB)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Order } from '@/lib/schemas/order';
import { ObjectId } from 'mongodb';

// GET - Get single order by ID
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
    const { orders } = await getCollections();

    // Try to find by orderId first, then by _id
    let order = await orders.findOne({ orderId: id });
    if (!order) {
      try {
        order = await orders.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format order
    const { _id, ...orderData } = order as any;
    const formattedOrder = {
      ...orderData,
      id: orderData.id || orderData.orderId || _id.toString(),
    };

    return NextResponse.json({ order: formattedOrder });
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
    const { orderStatus, trackingNumber, estimatedDelivery } = body;

    const { orders } = await getCollections();

    // Find order
    let order = await orders.findOne({ orderId: id });
    if (!order) {
      try {
        order = await orders.findOne({ _id: new ObjectId(id) });
      } catch {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (orderStatus) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
      if (!validStatuses.includes(orderStatus)) {
        return NextResponse.json(
          { error: 'Invalid order status' },
          { status: 400 }
        );
      }
      updateData.orderStatus = orderStatus;
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery);
    }

    await orders.updateOne(
      { orderId: id },
      { $set: updateData }
    );

    // Fetch updated order
    const updatedOrder = await orders.findOne({ orderId: id });
    const { _id, ...orderData } = updatedOrder as any;
    const formattedOrder = {
      ...orderData,
      id: orderData.id || orderData.orderId || _id.toString(),
    };

    return NextResponse.json({
      order: formattedOrder,
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
