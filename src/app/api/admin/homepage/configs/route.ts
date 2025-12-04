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
    // 1. Authentication check (CRITICAL - must be first)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // 2. Authorization check
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
          },
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid JSON in request body',
          },
        },
        { status: 400 }
      );
    }

    // 4. Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name is required and must be at least 2 characters',
          },
        },
        { status: 400 }
      );
    }

    // 5. Get database connection
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // 6. Generate slug if not provided
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // 7. Check if slug already exists
    const existingConfig = await homepageConfigs.findOne({ slug });
    if (existingConfig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'A configuration with this slug already exists',
          },
        },
        { status: 409 }
      );
    }

    // 8. Create config object
    const newConfig = {
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || '',
      status: body.status || 'draft',
      sections: body.sections || [],
      seo: {
        title: body.seo?.title || body.seoTitle || '',
        description: body.seo?.description || body.seoDescription || '',
        keywords: body.seo?.keywords || [],
      },
      version: 1,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 9. Insert into database
    const result = await homepageConfigs.insertOne(newConfig);

    // 10. Return success response with standardized format
    return NextResponse.json(
      {
        success: true,
        data: {
          config: {
            ...newConfig,
            _id: result.insertedId.toString(),
          },
        },
        message: 'Configuration created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating homepage config:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // MongoDB errors
      if (error.name === 'MongoServerError') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'SERVER_ERROR',
              message: 'Database error occurred',
              details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
          },
          { status: 500 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create configuration',
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        },
      },
      { status: 500 }
    );
  }
}

