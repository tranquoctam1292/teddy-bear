// Admin API: Homepage Configurations CRUD
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/homepage/configs
 * List all homepage configurations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    // Count total
    const total = await homepageConfigs.countDocuments(query);

    // Fetch configs
    const configs = await homepageConfigs
      .find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      configs: configs.map((c) => ({ ...c, _id: c._id.toString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching homepage configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configurations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage/configs
 * Create new homepage configuration
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Check if slug already exists
    const existingConfig = await homepageConfigs.findOne({ slug: body.slug });
    if (existingConfig) {
      return NextResponse.json(
        { error: 'A configuration with this slug already exists' },
        { status: 400 }
      );
    }

    // Create config
    const newConfig = {
      ...body,
      status: body.status || 'draft',
      sections: body.sections || [],
      version: 1,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await homepageConfigs.insertOne(newConfig);

    return NextResponse.json(
      {
        message: 'Configuration created successfully',
        config: {
          ...newConfig,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to create configuration' },
      { status: 500 }
    );
  }
}

