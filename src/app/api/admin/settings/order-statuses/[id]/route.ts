// Order Status API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const { orderStatuses } = await getCollections();

    const existingStatus = await orderStatuses.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: 'Order status not found' },
        { status: 404 }
      );
    }

    let slug = existingStatus.slug;
    if (name && name !== existingStatus.name) {
      slug = generateSlug(name);
      const slugExists = await orderStatuses.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Status with this name already exists' },
          { status: 400 }
        );
      }
    }

    // If setting as default, unset other defaults
    if (isDefault && !existingStatus.isDefault) {
      await orderStatuses.updateMany(
        { isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (slug) updateData.slug = slug;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (canTransitionTo !== undefined) updateData.canTransitionTo = canTransitionTo;
    if (sendNotification !== undefined) updateData.sendNotification = sendNotification;

    await orderStatuses.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedStatus = await orderStatuses.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...statusData } = updatedStatus as any;
    return NextResponse.json({
      status: {
        ...statusData,
        id: statusData.id || _id.toString(),
      },
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order status
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { orderStatuses, orders } = await getCollections();

    const status = await orderStatuses.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!status) {
      return NextResponse.json(
        { error: 'Order status not found' },
        { status: 404 }
      );
    }

    // Check if status is being used
    const ordersUsingStatus = await orders.countDocuments({
      status: status.slug,
    });

    if (ordersUsingStatus > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete status. It is being used by ${ordersUsingStatus} order(s)`,
        },
        { status: 400 }
      );
    }

    // Cannot delete default status
    if (status.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default status' },
        { status: 400 }
      );
    }

    await orderStatuses.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Order status deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


