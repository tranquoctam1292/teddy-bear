// Comment Schema & Validation
import type { ObjectId } from 'mongodb';
import { z } from 'zod';

/**
 * Comment Status
 */
export type CommentStatus = 'approved' | 'pending' | 'spam' | 'auto-spam';

/**
 * Comment Interface
 */
export interface Comment {
  _id?: ObjectId;
  id?: string; // Alternative ID field
  postId: string; // Reference to Post
  authorName: string;
  authorEmail: string;
  content: string;
  parentId?: string; // For nested replies
  status: CommentStatus;
  spamScore?: number; // 0-100, higher = more likely spam
  spamReasons?: string[]; // Reasons why marked as spam
  ipAddress?: string; // For rate limiting
  userAgent?: string; // For bot detection
  likes?: number;
  dislikes?: number;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Spam Detection Result
 */
export interface SpamDetectionResult {
  isSpam: boolean;
  score: number; // 0-100
  reasons: string[];
}

/**
 * Comment Input Schema (for API validation)
 */
export const commentInputSchema = z.object({
  postId: z.string().min(1, 'Post ID là bắt buộc'),
  authorName: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự')
    .regex(/^[^<>]*$/, 'Tên không được chứa ký tự đặc biệt'),
  authorEmail: z
    .string()
    .email('Email không hợp lệ')
    .max(255, 'Email không được quá 255 ký tự'),
  content: z
    .string()
    .min(10, 'Nội dung bình luận phải có ít nhất 10 ký tự')
    .max(2000, 'Nội dung bình luận không được quá 2000 ký tự')
    .refine(
      (val) => {
        // Basic HTML sanitization check
        const htmlTags = /<[^>]*>/g;
        const stripped = val.replace(htmlTags, '');
        return stripped.length >= 10;
      },
      { message: 'Nội dung không hợp lệ' }
    ),
  parentId: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;

/**
 * Comment Update Schema (for Admin)
 */
export const commentUpdateSchema = z.object({
  status: z.enum(['approved', 'pending', 'spam', 'auto-spam']).optional(),
  spamScore: z.number().int().min(0).max(100).optional(),
  spamReasons: z.array(z.string()).optional(),
});

export type CommentUpdate = z.infer<typeof commentUpdateSchema>;

