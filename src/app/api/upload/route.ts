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
    
    // Provide more detailed error messages
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      // Check if it's a Blob token error
      if (errorMsg.includes('blob_read_write_token') || errorMsg.includes('token')) {
        return NextResponse.json(
          { 
            error: 'Upload service not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.',
            details: 'Thêm BLOB_READ_WRITE_TOKEN vào file .env.local hoặc environment variables trên Vercel.'
          },
          { status: 500 }
        );
      }
      
      // Check if Blob store doesn't exist
      if (errorMsg.includes('store does not exist') || errorMsg.includes('this store does not exist')) {
        return NextResponse.json(
          { 
            error: 'Vercel Blob store chưa được tạo. Vui lòng tạo Blob store trên Vercel Dashboard.',
            details: 'Truy cập: Vercel Dashboard → Storage → Blob → Tạo store mới. Sau đó copy BLOB_READ_WRITE_TOKEN vào .env.local'
          },
          { status: 500 }
        );
      }
      
      // Check for invalid token
      if (errorMsg.includes('unauthorized') || errorMsg.includes('invalid token') || errorMsg.includes('forbidden')) {
        return NextResponse.json(
          { 
            error: 'Token không hợp lệ hoặc không có quyền truy cập.',
            details: 'Vui lòng kiểm tra lại BLOB_READ_WRITE_TOKEN trong Vercel Dashboard → Storage → Blob'
          },
          { status: 500 }
        );
      }
      
      // Check for network/connection errors
      if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('connection')) {
        return NextResponse.json(
          { 
            error: 'Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.',
            details: error.message
          },
          { status: 500 }
        );
      }
      
      // Return the actual error message (always show in development, sanitized in production)
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Lỗi server khi tải ảnh lên. Vui lòng thử lại sau.';
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.stack : 'Chi tiết lỗi chỉ hiển thị trong development mode'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}






