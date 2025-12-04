// Payment Method API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET - Get single payment method
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { paymentMethods } = await getCollections();

    const method = await paymentMethods.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    const { _id, ...methodData } = method as any;
    // Don't expose sensitive keys
    const safeConfig = { ...methodData.config };
    if (safeConfig.secretKey) safeConfig.secretKey = '***hidden***';
    if (safeConfig.apiKey) safeConfig.apiKey = '***hidden***';

    return NextResponse.json({
      method: {
        ...methodData,
        config: safeConfig,
        id: methodData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update payment method
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
    const { name, slug, enabled, config, fee, order } = body;

    const { paymentMethods } = await getCollections();

    const existingMethod = await paymentMethods.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existingMethod.slug) {
      const slugExists = await paymentMethods.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Payment method with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Merge config (preserve existing sensitive keys if not provided)
    let updatedConfig = { ...existingMethod.config };
    if (config) {
      // Only update provided config fields, preserve sensitive keys if not changed
      Object.keys(config).forEach((key) => {
        if (config[key] !== '***hidden***' && config[key] !== undefined) {
          updatedConfig[key] = config[key];
        }
      });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (enabled !== undefined) updateData.enabled = enabled;
    if (config !== undefined) updateData.config = updatedConfig;
    if (fee !== undefined) updateData.fee = fee;
    if (order !== undefined) updateData.order = order;

    await paymentMethods.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedMethod = await paymentMethods.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...methodData } = updatedMethod as any;
    // Don't expose sensitive keys
    const safeConfig = { ...methodData.config };
    if (safeConfig.secretKey) safeConfig.secretKey = '***hidden***';
    if (safeConfig.apiKey) safeConfig.apiKey = '***hidden***';

    return NextResponse.json({
      method: {
        ...methodData,
        config: safeConfig,
        id: methodData.id || _id.toString(),
      },
      message: 'Payment method updated successfully',
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment method
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
    const { paymentMethods } = await getCollections();

    const method = await paymentMethods.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    await paymentMethods.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



