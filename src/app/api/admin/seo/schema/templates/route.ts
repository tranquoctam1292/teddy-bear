// Schema Templates API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SCHEMA_TEMPLATES, getSchemaTemplate, cloneTemplate } from '@/lib/seo/schema-builder';
import type { SchemaType } from '@/lib/seo/schema-builder';

/**
 * GET /api/admin/seo/schema/templates
 * Get all schema templates or specific template
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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as SchemaType | null;

    if (type) {
      // Return specific template
      const template = getSchemaTemplate(type);
      const cloned = cloneTemplate(type);

      return NextResponse.json({
        success: true,
        data: {
          template: {
            ...template,
            template: cloned,
          },
        },
      });
    }

    // Return all templates
    const templates = Object.values(SCHEMA_TEMPLATES).map(t => ({
      type: t.type,
      name: t.name,
      description: t.description,
      requiredFields: t.requiredFields,
      optionalFields: t.optionalFields,
    }));

    return NextResponse.json({
      success: true,
      data: {
        templates,
      },
    });
  } catch (error) {
    console.error('Error fetching schema templates:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




