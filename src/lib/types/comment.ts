// Comment Types for MongoDB
export interface Comment {
  _id?: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorIP?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  postId?: string;
  productId?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithRelations extends Comment {
  post?: {
    _id: string;
    title: string;
    slug: string;
  };
  product?: {
    _id: string;
    name: string;
    slug: string;
  };
  parent?: Comment;
  replies?: CommentWithRelations[];
  replyCount?: number;
}

export interface CommentFilter {
  status?: 'all' | 'pending' | 'approved' | 'spam' | 'trash';
  postId?: string;
  productId?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface CommentStats {
  all: number;
  pending: number;
  approved: number;
  spam: number;
  trash: number;
}

export interface CommentListResponse {
  success: boolean;
  comments: CommentWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  stats?: CommentStats;
}







