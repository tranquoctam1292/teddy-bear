// Bulk Import/Export API for Redirects
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { RedirectRule } from '@/lib/schemas/redirect-rule';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/redirects/bulk/export
 * Export redirects as CSV or JSON
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

    const { redirectRules } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json'; // json or csv

    // Get all redirects
    const redirects = await redirectRules
      .find({})
      .sort({ priority: -1, createdAt: -1 })
      .toArray();

    const formattedRedirects = redirects.map((doc: any) => {
      const { _id, ...redirectData } = doc;
      return {
        ...redirectData,
        id: redirectData.id || _id.toString(),
      };
    });

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'source',
        'destination',
        'type',
        'matchType',
        'status',
        'priority',
        'notes',
        'createdAt',
        'updatedAt',
      ];

      const csvRows = [
        headers.join(','),
        ...formattedRedirects.map((redirect) =>
          headers
            .map((header) => {
              const value = redirect[header];
              if (value === null || value === undefined) return '';
              if (value instanceof Date) return value.toISOString();
              // Escape commas and quotes in CSV
              const stringValue = String(value).replace(/"/g, '""');
              return `"${stringValue}"`;
            })
            .join(',')
        ),
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="redirects-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON
    return NextResponse.json({
      success: true,
      data: {
        redirects: formattedRedirects,
        exportedAt: new Date().toISOString(),
        total: formattedRedirects.length,
      },
    });
  } catch (error) {
    console.error('Error exporting redirects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/redirects/bulk/import
 * Import redirects from CSV or JSON
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
    const { redirects, overwrite = false } = body;

    if (!Array.isArray(redirects) || redirects.length === 0) {
      return NextResponse.json(
        { error: 'Invalid redirects data. Expected an array.' },
        { status: 400 }
      );
    }

    const { redirectRules } = await getCollections();
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const redirectData of redirects) {
      try {
        const {
          source,
          destination,
          type = '301',
          matchType = 'exact',
          status = 'active',
          priority = 0,
          notes,
          id,
        } = redirectData;

        if (!source || !destination) {
          results.errors.push(`Missing source or destination: ${JSON.stringify(redirectData)}`);
          results.skipped++;
          continue;
        }

        // Validate redirect type
        if (!['301', '302', '307', '308'].includes(type)) {
          results.errors.push(`Invalid redirect type: ${type}`);
          results.skipped++;
          continue;
        }

        // Validate match type
        if (!['exact', 'regex', 'prefix'].includes(matchType)) {
          results.errors.push(`Invalid match type: ${matchType}`);
          results.skipped++;
          continue;
        }

        // Check if redirect exists
        const existingRedirect = await redirectRules.findOne({
          source,
          matchType,
        });

        if (existingRedirect) {
          if (overwrite) {
            // Update existing
            await redirectRules.updateOne(
              { source, matchType },
              {
                $set: {
                  destination,
                  type,
                  status,
                  priority,
                  notes,
                  updatedAt: new Date(),
                },
              }
            );
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // Create new
          const newRedirect: RedirectRule = {
            id: id || new ObjectId().toString(),
            source,
            destination,
            type: type as any,
            matchType: matchType as any,
            status: status as any,
            priority: priority || 0,
            notes,
            createdBy: session.user?.email || session.user?.name || 'admin',
            hitCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await redirectRules.insertOne(newRedirect as any);
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(`Error processing redirect: ${error.message}`);
        results.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        total: redirects.length,
        message: `Import completed: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`,
      },
    });
  } catch (error) {
    console.error('Error importing redirects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}








