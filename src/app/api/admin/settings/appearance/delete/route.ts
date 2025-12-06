// Delete Logo/Favicon API Route - Using Vercel Blob
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { deleteFromBlob, isBlobUrl } from '@/lib/blob';

// Use Node.js runtime for file system operations
export const runtime = 'nodejs';

// DELETE - Delete logo or favicon
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'logo' or 'favicon'

    if (!type || !['logo', 'favicon'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be logo or favicon' },
        { status: 400 }
      );
    }

    const { appearanceConfig } = await getCollections();
    
    // Check if collection is available
    if (!appearanceConfig) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }
    
    const config = await appearanceConfig.findOne({});

    if (!config) {
      return NextResponse.json(
        { error: 'Appearance config not found' },
        { status: 404 }
      );
    }

    const fileUrl = config[type as 'logo' | 'favicon'];
    if (!fileUrl) {
      return NextResponse.json(
        { error: `${type} not found` },
        { status: 404 }
      );
    }

    // Delete file from Vercel Blob if it's a blob URL
    // Also try to delete from filesystem if it's a local file (for backward compatibility)
    if (isBlobUrl(fileUrl)) {
      try {
        await deleteFromBlob(fileUrl);
      } catch (error) {
        console.warn(`Failed to delete blob: ${fileUrl}`, error);
        // Continue anyway
      }
    } else {
      // Legacy: Try to delete from filesystem if it's a local path
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const filePath = join(process.cwd(), 'public', fileUrl);
        await unlink(filePath);
      } catch (error) {
        // File might not exist, continue anyway
        console.warn(`File not found: ${fileUrl}`, error);
      }
    }

    // Update config
    await appearanceConfig.updateOne(
      {},
      { 
        $unset: { [type]: '' },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({
      message: `${type} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

