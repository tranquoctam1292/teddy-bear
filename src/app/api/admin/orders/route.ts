// Admin Order API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Order } from '@/lib/schemas/order';

// GET - List all orders with pagination and filtering
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

    const { orders } = await getCollections();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      query.$or = [
        { orderId: { $regex: searchLower, $options: 'i' } },
        { guestEmail: { $regex: searchLower, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: searchLower, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await orders.countDocuments(query);

    // Fetch orders with pagination
    const ordersList = await orders
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format orders (remove _id, ensure id exists)
    const formattedOrders = ordersList.map((doc: any) => {
      const { _id, ...order } = doc;
      return {
        ...order,
        id: order.id || order.orderId || _id.toString(),
      };
    });

    // Get stats
    const totalOrders = await orders.countDocuments({});
    const unreadOrders = await orders.countDocuments({ orderStatus: 'pending' });

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalOrders,
        pending: unreadOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
