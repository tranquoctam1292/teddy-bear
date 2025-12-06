import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/admin/media/[id] - Get single media file
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { media } = await getCollections();
    const file = await media.findOne({ _id: new ObjectId(params.id) });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        ...file,
        _id: file._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media file' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/media/[id] - Update media metadata
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { alt, title, caption, description } = body;

    const { media } = await getCollections();

    const result = await media.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          alt,
          title,
          caption,
          description,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    // Get updated file
    const updatedFile = await media.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      file: {
        ...updatedFile,
        _id: updatedFile?._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update media file' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/media/[id] - Delete single media file
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { media } = await getCollections();

    // Get file info before deletion
    const file = await media.findOne({ _id: new ObjectId(params.id) });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await media.deleteOne({ _id: new ObjectId(params.id) });

    // TODO: Delete from Vercel Blob storage
    // const { del } = await import('@vercel/blob');
    // await del(file.url);

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media file' },
      { status: 500 }
    );
  }
}







