// Universal Upload API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToBlob } from '@/lib/blob';

export const runtime = 'nodejs';

// POST - Upload any image/file
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'media';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images only for now)
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Max: 5MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const safeFilename = file.name
      .replace(/[^a-z0-9.-]/gi, '-')
      .toLowerCase();
    const filename = `${timestamp}-${safeFilename}`;

    // Upload to Vercel Blob
    const fileUrl = await uploadToBlob(file, filename, folder);

    return NextResponse.json({
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Check if it's a Blob token error
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Upload service not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




