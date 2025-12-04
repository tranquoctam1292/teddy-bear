import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { PAYMENT_GATEWAYS } from '@/lib/types/payment';

// GET /api/admin/payments/gateways - List all payment gateways
export async function GET(request: NextRequest) {
  try {
    const { paymentGateways } = await getCollections();

    const gateways = await paymentGateways.find({}).toArray();

    // Merge with default gateways
    const enrichedGateways = PAYMENT_GATEWAYS.map((defaultGateway) => {
      const existingGateway = gateways.find(
        (g: any) => g.name === defaultGateway.id
      );

      if (existingGateway) {
        return {
          ...defaultGateway,
          ...existingGateway,
          _id: existingGateway._id?.toString(),
        };
      }

      // Return default gateway with disabled state
      return {
        ...defaultGateway,
        name: defaultGateway.id,
        displayName: defaultGateway.name,
        enabled: false,
        testMode: true,
        config: {},
      };
    });

    return NextResponse.json({
      success: true,
      gateways: enrichedGateways,
    });
  } catch (error) {
    console.error('Error fetching gateways:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment gateways' },
      { status: 500 }
    );
  }
}

// POST /api/admin/payments/gateways - Create/Update gateway config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, enabled, testMode, config } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Gateway name is required' },
        { status: 400 }
      );
    }

    const { paymentGateways } = await getCollections();

    // Check if gateway exists
    const existing = await paymentGateways.findOne({ name });

    if (existing) {
      // Update
      await paymentGateways.updateOne(
        { name },
        {
          $set: {
            enabled,
            testMode,
            config,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create
      const gatewayInfo = PAYMENT_GATEWAYS.find((g) => g.id === name);
      await paymentGateways.insertOne({
        name,
        displayName: gatewayInfo?.name || name,
        enabled: enabled || false,
        testMode: testMode !== undefined ? testMode : true,
        config: config || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    }

    return NextResponse.json({
      success: true,
      message: 'Gateway configuration saved successfully',
    });
  } catch (error) {
    console.error('Error saving gateway config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save gateway configuration' },
      { status: 500 }
    );
  }
}


