// Schema Validation API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { validateSchema } from '@/lib/seo/schema-builder';

/**
 * POST /api/admin/seo/schema/validate
 * Validate schema structure
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
    const { schema } = body;

    if (!schema) {
      return NextResponse.json(
        { error: 'Missing required field: schema' },
        { status: 400 }
      );
    }

    // Validate schema
    const result = validateSchema(schema);

    return NextResponse.json({
      success: true,
      data: {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings,
      },
    });
  } catch (error) {
    console.error('Error validating schema:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




