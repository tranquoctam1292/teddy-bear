// Order Statuses API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { OrderStatus } from '@/lib/schemas/order-settings';
import { ObjectId } from 'mongodb';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(): string {
  return `status_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all order statuses
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderStatuses } = await getCollections();
    const statuses = await orderStatuses
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedStatuses = statuses.map((status: any) => {
      const { _id, ...statusData } = status;
      return {
        ...statusData,
        id: statusData.id || _id.toString(),
      };
    });

    return NextResponse.json({ statuses: formattedStatuses });
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order status
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      color,
      icon,
      order,
      isDefault,
      canTransitionTo,
      sendNotification,
    } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      );
    }

    const { orderStatuses } = await getCollections();
    const slug = generateSlug(name);

    const existingStatus = await orderStatuses.findOne({ slug });
    if (existingStatus) {
      return NextResponse.json(
        { error: 'Status with this name already exists' },
        { status: 400 }
      );
    }

    // If this is default, unset other defaults
    if (isDefault) {
      await orderStatuses.updateMany(
        { isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    // Get max order if not provided
    let statusOrder = order;
    if (statusOrder === undefined) {
      const maxOrderStatus = await orderStatuses.findOne({}, { sort: { order: -1 } });
      statusOrder = maxOrderStatus ? (maxOrderStatus.order || 0) + 1 : 0;
    }

    const newStatus: OrderStatus = {
      id: generateId(),
      name: name.trim(),
      slug,
      color,
      icon,
      order: statusOrder,
      isDefault: isDefault || false,
      canTransitionTo: canTransitionTo || [],
      sendNotification: sendNotification !== undefined ? sendNotification : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orderStatuses.insertOne(newStatus);

    return NextResponse.json(
      { status: newStatus, message: 'Order status created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


