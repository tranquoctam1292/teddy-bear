// Media Types for MongoDB
export interface MediaFile {
  _id?: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  caption?: string;
  description?: string;
  uploadedBy?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface MediaFilter {
  type?: 'image' | 'video' | 'document' | 'all';
  search?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  limit?: number;
  skip?: number;
}

export interface MediaUploadResponse {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export interface MediaListResponse {
  success: boolean;
  files: MediaFile[];
  total: number;
  page: number;
  totalPages: number;
}







