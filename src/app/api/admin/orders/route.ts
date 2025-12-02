// Admin Order API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Order } from '@/lib/schemas/order';
import { mockOrders } from '@/lib/data/orders';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Filter orders
    let filteredOrders = [...mockOrders];

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.orderStatus === status
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.guestEmail.toLowerCase().includes(searchLower) ||
          order.shippingAddress.fullName.toLowerCase().includes(searchLower) ||
          order.shippingAddress.phone.includes(search)
      );
    }

    // Sort by createdAt (newest first)
    filteredOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
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

