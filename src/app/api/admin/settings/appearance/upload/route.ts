// File Upload API Route (Logo & Favicon) - Using Vercel Blob
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { uploadToBlob, deleteFromBlob, isBlobUrl } from '@/lib/blob';

// Use Node.js runtime for file system operations
export const runtime = 'nodejs';

// POST - Upload logo or favicon
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'favicon'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['logo', 'favicon'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be logo or favicon' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = type === 'logo' 
      ? ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
      : ['image/png', 'image/x-icon', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB for logo, 500KB for favicon)
    const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 500 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Max size: ${maxSize / 1024}KB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}-${timestamp}.${extension}`;

    // Get existing config to delete old file if exists
    const { appearanceConfig } = await getCollections();
    
    // Check if collection is available
    if (!appearanceConfig) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }
    
    const existing = await appearanceConfig.findOne({});
    
    // Delete old file if exists and is a blob URL
    if (existing && existing[type as 'logo' | 'favicon']) {
      const oldUrl = existing[type as 'logo' | 'favicon'];
      if (oldUrl && isBlobUrl(oldUrl)) {
        try {
          await deleteFromBlob(oldUrl);
        } catch (error) {
          console.warn('Failed to delete old file:', error);
          // Continue anyway
        }
      }
    }

    // Upload to Vercel Blob
    const fileUrl = await uploadToBlob(file, filename, 'appearance');

    // Update appearance config (already fetched above)

    const updateData: any = {
      [type]: fileUrl,
      updatedAt: new Date(),
    };

    if (existing) {
      await appearanceConfig.updateOne({}, { $set: updateData });
    } else {
      // Create default config if doesn't exist
      const defaultConfig = {
        id: `appearance_${Date.now()}`,
        theme: 'light',
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        borderRadius: 'md',
        [type]: fileUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await appearanceConfig.insertOne(defaultConfig);
    }

    return NextResponse.json({
      url: fileUrl,
      message: `${type} uploaded successfully`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

