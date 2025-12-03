// Keyword Tracking API Routes - Single Keyword
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { KeywordTracking, RankingHistoryEntry } from '@/lib/schemas/keyword-tracking';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/keywords/[id]
 * Get single keyword tracking
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
    const { keywordTracking } = await getCollections();

    // Try to find by id field first
    let keyword = await keywordTracking.findOne({ id });
    
    // If not found, try by _id
    if (!keyword) {
      try {
        keyword = await keywordTracking.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword tracking not found' },
        { status: 404 }
      );
    }

    const { _id, ...keywordData } = keyword as any;
    const formattedKeyword = {
      ...keywordData,
      id: keywordData.id || _id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: { keyword: formattedKeyword },
    });
  } catch (error) {
    console.error('Error fetching keyword tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/keywords/[id]
 * Update keyword tracking
 */
export async function PUT(
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
    const body = await request.json();
    const { keywordTracking } = await getCollections();

    // Find keyword
    let keyword = await keywordTracking.findOne({ id });
    if (!keyword) {
      try {
        keyword = await keywordTracking.findOne({ _id: new ObjectId(id) });
      } catch {
        return NextResponse.json(
          { error: 'Keyword tracking not found' },
          { status: 404 }
        );
      }
    }

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword tracking not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update fields
    if (body.keyword !== undefined) updateData.keyword = body.keyword;
    if (body.entityType !== undefined) updateData.entityType = body.entityType;
    if (body.entityId !== undefined) updateData.entityId = body.entityId;
    if (body.entitySlug !== undefined) updateData.entitySlug = body.entitySlug;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.currentRank !== undefined) {
      updateData.previousRank = keyword.currentRank;
      updateData.currentRank = body.currentRank;
      // Update best/worst rank
      if (body.currentRank !== null && body.currentRank !== undefined) {
        if (!keyword.bestRank || body.currentRank < keyword.bestRank) {
          updateData.bestRank = body.currentRank;
        }
        if (!keyword.worstRank || body.currentRank > keyword.worstRank) {
          updateData.worstRank = body.currentRank;
        }
      }
    }
    if (body.searchVolume !== undefined) updateData.searchVolume = body.searchVolume;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.cpc !== undefined) updateData.cpc = body.cpc;
    if (body.competition !== undefined) updateData.competition = body.competition;
    if (body.checkFrequency !== undefined) updateData.checkFrequency = body.checkFrequency;
    if (body.targetRank !== undefined) updateData.targetRank = body.targetRank;
    if (body.targetDate !== undefined) updateData.targetDate = body.targetDate;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // Add ranking history entry if rank is updated
    if (body.currentRank !== undefined && body.currentRank !== null) {
      const historyEntry: RankingHistoryEntry = {
        date: new Date(),
        rank: body.currentRank,
        searchVolume: body.searchVolume || keyword.searchVolume,
        difficulty: body.difficulty || keyword.difficulty,
        notes: body.notes || keyword.notes,
      };

      const currentHistory = keyword.rankingHistory || [];
      updateData.rankingHistory = [...currentHistory, historyEntry];
      updateData.lastChecked = new Date();
      updateData.totalChecks = (keyword.totalChecks || 0) + 1;
    }

    await keywordTracking.updateOne(
      { id: keyword.id || id },
      { $set: updateData }
    );

    // Fetch updated keyword
    const updatedKeyword = await keywordTracking.findOne({ id: keyword.id || id });
    const { _id, ...keywordData } = updatedKeyword as any;
    const formattedKeyword = {
      ...keywordData,
      id: keywordData.id || _id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        keyword: formattedKeyword,
        message: 'Keyword tracking updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating keyword tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/keywords/[id]
 * Delete keyword tracking
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
    const { keywordTracking } = await getCollections();

    // Try to delete by id field first
    let result = await keywordTracking.deleteOne({ id });
    
    // If not found, try by _id
    if (result.deletedCount === 0) {
      try {
        result = await keywordTracking.deleteOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Keyword tracking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Keyword tracking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting keyword tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


