// A/B Testing for SEO API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface ABTest {
  id: string;
  name: string;
  entityType: 'product' | 'post' | 'page';
  entityId: string;
  
  // Variants
  variantA: {
    title: string;
    description: string;
    content?: string;
  };
  variantB: {
    title: string;
    description: string;
    content?: string;
  };
  
  // Current active variant
  activeVariant: 'A' | 'B';
  
  // Metrics
  variantAMetrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions?: number;
  };
  variantBMetrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions?: number;
  };
  
  // Status
  status: 'running' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  winner?: 'A' | 'B' | 'tie';
  
  // Configuration
  trafficSplit: number; // Percentage for variant A (0-100)
  minSampleSize: number; // Minimum impressions to determine winner
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/admin/seo/ab-testing
 * Get all A/B tests
 */
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

    const { abTests } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const entityType = searchParams.get('entityType');

    const query: any = {};
    if (status) query.status = status;
    if (entityType) query.entityType = entityType;

    const tests = await abTests
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = tests.map((t: any) => {
      const { _id, ...data } = t;
      return { ...data, id: data.id || _id.toString() };
    });

    return NextResponse.json({
      success: true,
      data: {
        tests: formatted,
      },
    });
  } catch (error) {
    console.error('Error fetching A/B tests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/ab-testing
 * Create new A/B test
 */
export async function POST(request: NextRequest) {
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
    const {
      name,
      entityType,
      entityId,
      variantA,
      variantB,
      trafficSplit = 50,
      minSampleSize = 1000,
      endDate,
    } = body;

    if (!name || !entityType || !entityId || !variantA || !variantB) {
      return NextResponse.json(
        { error: 'Missing required fields: name, entityType, entityId, variantA, variantB' },
        { status: 400 }
      );
    }

    const { abTests } = await getCollections();

    const testData: ABTest = {
      id: new ObjectId().toString(),
      name,
      entityType,
      entityId,
      variantA,
      variantB,
      activeVariant: 'A', // Start with A
      variantAMetrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
      },
      variantBMetrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
      },
      status: 'running',
      startDate: new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      trafficSplit,
      minSampleSize,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await abTests.insertOne(testData as any);

    const { _id, ...formatted } = testData as any;

    return NextResponse.json({
      success: true,
      data: {
        test: {
          ...formatted,
          id: formatted.id || _id.toString(),
        },
        message: 'A/B test created successfully',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}





