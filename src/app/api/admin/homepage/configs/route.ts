// Admin API: Homepage Configurations CRUD
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { homepageFormSchema } from '@/lib/schemas/homepage';
import { generateSlug } from '@/lib/utils/slug';

/**
 * GET /api/admin/homepage/configs
 * List all homepage configurations
 */
export async function GET(request: NextRequest) {
  try {
    // Wrap auth() in try-catch to handle potential exceptions
    let session;
    try {
      session = await auth();
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Authentication service unavailable',
            details:
              process.env.NODE_ENV === 'development'
                ? authError instanceof Error
                  ? authError.message
                  : String(authError)
                : undefined,
          },
        },
        { status: 401 }
      );
    }

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get database connection
    let db;
    try {
      const collections = await getCollections();
      db = collections.db;
    } catch (dbError) {
      console.error('[GET /configs] Database connection error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database connection failed',
            details:
              process.env.NODE_ENV === 'development'
                ? dbError instanceof Error
                  ? dbError.message
                  : String(dbError)
                : undefined,
          },
        },
        { status: 500 }
      );
    }
    
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
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch configurations',
          details:
            process.env.NODE_ENV === 'development'
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage/configs
 * Create new homepage configuration
 */
export async function POST(request: NextRequest) {
  // CRITICAL: Authentication check MUST be first, before any other code
  let session;
  try {
    session = await auth();
  } catch (authError) {
    // Handle auth() exceptions (e.g., config errors, connection issues)
    console.error('[POST /configs] Auth error:', authError);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication service unavailable',
          details:
            process.env.NODE_ENV === 'development'
              ? authError instanceof Error
                ? authError.message
                : String(authError)
              : undefined,
        },
      },
      { status: 401 }
    );
  }

  // Check if session exists
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication required. Please log in to continue.',
        },
      },
      { status: 401 }
    );
  }

  // Authorization check - must be admin
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

  // All auth checks passed, proceed with request processing
  try {
    // Parse request body
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
            details: process.env.NODE_ENV === 'development'
              ? parseError instanceof Error ? parseError.message : String(parseError)
              : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    let validatedData;
    try {
      validatedData = homepageFormSchema.parse({
        name: body.name,
        description: body.description,
        seoTitle: body.seo?.title || body.seoTitle,
        seoDescription: body.seo?.description || body.seoDescription,
      });
    } catch (zodError) {
      // Handle Zod validation errors
      if (zodError && typeof zodError === 'object' && 'errors' in zodError) {
        const zodErrors = zodError as { errors: Array<{ path: string[]; message: string }> };
        const errorMessages = zodErrors.errors.map((err) => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        });
        
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed',
              details: errorMessages,
            },
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: process.env.NODE_ENV === 'development'
              ? zodError instanceof Error ? zodError.message : String(zodError)
              : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Get database connection
    let db;
    try {
      const collections = await getCollections();
      db = collections.db;
    } catch (dbError) {
      console.error('[POST /configs] Database connection error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database connection failed',
            details:
              process.env.NODE_ENV === 'development'
                ? dbError instanceof Error
                  ? dbError.message
                  : String(dbError)
                : undefined,
          },
        },
        { status: 500 }
      );
    }
    
    const homepageConfigs = db.collection('homepage_configs');

    // Generate slug using centralized utility
    let baseSlug = body.slug || generateSlug(validatedData.name);

    // Ensure slug is not empty
    if (!baseSlug) {
      baseSlug = 'homepage-config';
    }

    // Generate unique slug if conflict exists
    let slug = baseSlug;
    let counter = 1;
    let existingConfig = await homepageConfigs.findOne({ slug });
    
    while (existingConfig) {
      slug = `${baseSlug}-${counter}`;
      existingConfig = await homepageConfigs.findOne({ slug });
      counter++;
      
      // Safety limit to prevent infinite loop
      if (counter > 1000) {
        // Fallback to timestamp-based slug
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    // Get user ID with fallback
    // CRITICAL: session.user.id might be undefined if user logged in before fix
    // Use email as fallback identifier if id is missing
    const userId = session.user.id || session.user.email || 'system';
    
    if (!session.user.id) {
      console.warn('[POST /configs] Session user ID is missing, using email as fallback:', {
        email: session.user.email,
        hasId: !!session.user.id,
        sessionUser: session.user,
      });
    }

    // Create config object using validated data
    const newConfig = {
      name: validatedData.name.trim(),
      slug,
      description: validatedData.description?.trim() || '',
      status: body.status || 'draft',
      sections: body.sections || [],
      seo: {
        title: validatedData.seoTitle,
        description: validatedData.seoDescription,
        keywords: body.seo?.keywords || [],
      },
      version: 1,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // DEBUG: Log config object before insert (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[POST /configs] Creating config:', {
        name: newConfig.name,
        slug: newConfig.slug,
        createdBy: newConfig.createdBy,
        hasSeo: !!newConfig.seo,
      });
    }

    // Insert into database
    let result;
    try {
      // DEBUG: Log full config object before insert (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('[POST /configs] Full config object:', JSON.stringify(newConfig, null, 2));
      }
      
      result = await homepageConfigs.insertOne(newConfig);
      
      // DEBUG: Log success
      if (process.env.NODE_ENV === 'development') {
        console.log('[POST /configs] Insert successful:', {
          insertedId: result.insertedId.toString(),
          acknowledged: result.acknowledged,
        });
      }
    } catch (insertError) {
      // CRITICAL: Log full error details
      console.error('[POST /configs] Database insert error:', {
        error: insertError,
        errorName: insertError instanceof Error ? insertError.name : 'Unknown',
        errorMessage: insertError instanceof Error ? insertError.message : String(insertError),
        errorStack: insertError instanceof Error ? insertError.stack : undefined,
        configData: {
          name: newConfig.name,
          slug: newConfig.slug,
          createdBy: newConfig.createdBy,
          hasSeo: !!newConfig.seo,
        },
      });
      
      // Check for specific MongoDB errors
      let errorMessage = 'Failed to save configuration to database';
      if (insertError instanceof Error) {
        // MongoDB duplicate key error
        if (insertError.name === 'MongoServerError' && (insertError as any).code === 11000) {
          errorMessage = 'A configuration with this slug already exists';
        } else {
          errorMessage = insertError.message || errorMessage;
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: errorMessage,
            details:
              process.env.NODE_ENV === 'development'
                ? insertError instanceof Error
                  ? {
                      name: insertError.name,
                      message: insertError.message,
                      stack: insertError.stack,
                    }
                  : String(insertError)
                : undefined,
          },
        },
        { status: 500 }
      );
    }

    // Return success response with standardized format
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
    // CRITICAL: Catch all server errors and return standardized response
    console.error('[POST /configs] Server error:', error);
    
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

    // Generic server error - MUST return standardized format
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        },
      },
      { status: 500 }
    );
  }
}

