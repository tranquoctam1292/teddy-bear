// SEO Analysis API Routes - Single Analysis
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/analysis/[id]
 * Get single SEO analysis by ID or entityType+entityId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { seoAnalysis } = await getCollections();

    // Try to find by id field first
    let analysis = await seoAnalysis.findOne({ id });
    
    // If not found, try by _id
    if (!analysis) {
      try {
        analysis = await seoAnalysis.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    // If still not found, try entityType+entityId format (entityType:entityId)
    if (!analysis && id.includes(':')) {
      const [entityType, entityId] = id.split(':');
      analysis = await seoAnalysis.findOne({ entityType, entityId });
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const { _id, ...analysisData } = analysis as any;
    const formattedAnalysis = {
      ...analysisData,
      id: analysisData.id || _id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: { analysis: formattedAnalysis },
    });
  } catch (error) {
    console.error('Error fetching SEO analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/analysis/[id]
 * Delete SEO analysis
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { seoAnalysis } = await getCollections();

    // Try to delete by id field first
    let result = await seoAnalysis.deleteOne({ id });
    
    // If not found, try by _id
    if (result.deletedCount === 0) {
      try {
        result = await seoAnalysis.deleteOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    // If still not found, try entityType+entityId format
    if (result.deletedCount === 0 && id.includes(':')) {
      const [entityType, entityId] = id.split(':');
      result = await seoAnalysis.deleteOne({ entityType, entityId });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting SEO analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


