// Payment Methods API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { PaymentMethod } from '@/lib/schemas/order-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `payment_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentMethods } = await getCollections();
    const methods = await paymentMethods
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedMethods = methods.map((method: any) => {
      const { _id, ...methodData } = method;
      // Don't expose sensitive keys in response
      const safeConfig = { ...methodData.config };
      if (safeConfig.secretKey) {
        safeConfig.secretKey = '***hidden***';
      }
      if (safeConfig.apiKey) {
        safeConfig.apiKey = '***hidden***';
      }
      return {
        ...methodData,
        config: safeConfig,
        id: methodData.id || _id.toString(),
      };
    });

    return NextResponse.json({ methods: formattedMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, enabled, config, fee, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const { paymentMethods } = await getCollections();

    const existingMethod = await paymentMethods.findOne({ slug });
    if (existingMethod) {
      return NextResponse.json(
        { error: 'Payment method with this slug already exists' },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let methodOrder = order;
    if (methodOrder === undefined) {
      const maxOrderMethod = await paymentMethods.findOne({}, { sort: { order: -1 } });
      methodOrder = maxOrderMethod ? (maxOrderMethod.order || 0) + 1 : 0;
    }

    const newMethod: PaymentMethod = {
      id: generateId(),
      name: name.trim(),
      slug: slug.trim(),
      enabled: enabled !== undefined ? enabled : false,
      config: config || {},
      fee: fee || { type: 'fixed', value: 0 },
      order: methodOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await paymentMethods.insertOne(newMethod);

    // Don't expose sensitive keys
    const safeConfig = { ...newMethod.config };
    if (safeConfig.secretKey) safeConfig.secretKey = '***hidden***';
    if (safeConfig.apiKey) safeConfig.apiKey = '***hidden***';

    return NextResponse.json(
      {
        method: {
          ...newMethod,
          config: safeConfig,
        },
        message: 'Payment method created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


