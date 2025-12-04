import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { put } from '@vercel/blob';
import { MediaFile, MediaFilter } from '@/lib/types/media';

// GET /api/admin/media - List all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter: MediaFilter = {
      type: (searchParams.get('type') as any) || 'all',
      search: searchParams.get('search') || '',
      dateRange: (searchParams.get('dateRange') as any) || 'all',
      limit: parseInt(searchParams.get('limit') || '50'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const { media } = await getCollections();

    // Build MongoDB query
    const query: any = {};

    // Filter by type
    if (filter.type && filter.type !== 'all') {
      query.type = filter.type;
    }

    // Search filter
    if (filter.search) {
      query.$or = [
        { filename: { $regex: filter.search, $options: 'i' } },
        { originalName: { $regex: filter.search, $options: 'i' } },
        { alt: { $regex: filter.search, $options: 'i' } },
        { title: { $regex: filter.search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (filter.dateRange && filter.dateRange !== 'all') {
      const now = new Date();
      const dateFilter: any = {};

      switch (filter.dateRange) {
        case 'today':
          dateFilter.$gte = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }

      if (Object.keys(dateFilter).length > 0) {
        query.uploadedAt = dateFilter;
      }
    }

    // Get total count
    const total = await media.countDocuments(query);

    // Get files
    const files = await media
      .find(query)
      .sort({ uploadedAt: -1 })
      .skip(filter.skip || 0)
      .limit(filter.limit || 50)
      .toArray();

    // Calculate storage usage
    const storageUsed = files.reduce((sum, file: any) => sum + (file.size || 0), 0);

    return NextResponse.json({
      success: true,
      files: files.map((file: any) => ({
        ...file,
        _id: file._id?.toString(),
      })),
      total,
      page: Math.floor((filter.skip || 0) / (filter.limit || 50)) + 1,
      totalPages: Math.ceil(total / (filter.limit || 50)),
      storageUsed,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

// POST /api/admin/media - Upload new file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Determine file type
    const mimeType = file.type;
    let fileType: MediaFile['type'] = 'other';
    if (mimeType.startsWith('image/')) {
      fileType = 'image';
    } else if (mimeType.startsWith('video/')) {
      fileType = 'video';
    } else if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text')
    ) {
      fileType = 'document';
    }

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    if (fileType === 'image') {
      // For images, we'll get dimensions on client side or via image processing
      // For now, leave them undefined
    }

    // Create media record
    const { media } = await getCollections();
    
    const mediaFile: Omit<MediaFile, '_id'> = {
      filename: blob.pathname.split('/').pop() || file.name,
      originalName: file.name,
      url: blob.url,
      type: fileType,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      alt: '',
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      caption: '',
      description: '',
      uploadedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await media.insertOne(mediaFile as any);

    return NextResponse.json({
      success: true,
      file: {
        ...mediaFile,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/media (bulk delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { media } = await getCollections();
    const { ObjectId } = await import('mongodb');

    // Get files info before deletion (for cleanup)
    const files = await media
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    // Delete from database
    const result = await media.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    // TODO: Delete from Vercel Blob storage
    // Note: Vercel Blob doesn't provide easy bulk delete, would need to loop

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}


