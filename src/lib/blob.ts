// Vercel Blob Storage Utility
import { put, del, list } from '@vercel/blob';

/**
 * Upload file to Vercel Blob Storage
 * @param file - File to upload
 * @param filename - Filename for the blob
 * @param folder - Optional folder path (e.g., 'appearance', 'products')
 * @returns URL of the uploaded file
 */
export async function uploadToBlob(
  file: File | Buffer,
  filename: string,
  folder?: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Please add it to your environment variables.');
  }

  // Construct path with folder if provided
  const path = folder ? `${folder}/${filename}` : filename;

  // Convert File to Buffer if needed
  let buffer: Buffer;
  let contentType: string;

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    contentType = file.type;
  } else {
    buffer = file;
    contentType = 'application/octet-stream';
  }

  // Upload to Vercel Blob
  const blob = await put(path, buffer, {
    access: 'public',
    contentType,
    token,
  });

  return blob.url;
}

/**
 * Delete file from Vercel Blob Storage
 * @param url - URL of the blob to delete
 * @returns void
 */
export async function deleteFromBlob(url: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Please add it to your environment variables.');
  }

  // Extract blob URL from full URL if needed
  // Vercel Blob URLs are in format: https://[hash].public.blob.vercel-storage.com/[path]
  try {
    await del(url, { token });
  } catch (error) {
    // File might not exist, log warning but don't throw
    console.warn(`Failed to delete blob: ${url}`, error);
  }
}

/**
 * Extract filename from Vercel Blob URL
 * @param url - Blob URL
 * @returns Filename or null
 */
export function extractFilenameFromBlobUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is a Vercel Blob URL
 * @param url - URL to check
 * @returns boolean
 */
export function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com') || url.includes('vercel-storage.com');
}




