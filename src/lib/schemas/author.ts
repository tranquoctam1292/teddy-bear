// Zod Validation Schemas for Author Management
import { z } from 'zod';

/**
 * Social Links Schema
 */
export const socialLinksSchema = z
  .object({
    website: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  })
  .optional();

/**
 * Guest Author Schema (Inline in post)
 */
export const guestAuthorSchema = z.object({
  name: z.string().min(2, 'Guest author name must be at least 2 characters'),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  jobTitle: z.string().optional(),
  credentials: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

/**
 * Author Create/Update Schema
 */
export const authorSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .optional(), // Auto-generated if not provided
  email: z.string().email().optional().or(z.literal('')),
  avatar: z.string().url().optional().or(z.literal('')),

  // Bio & Experience
  bio: z
    .string()
    .min(50, 'Short bio must be at least 50 characters')
    .max(200, 'Short bio must not exceed 200 characters'),
  bioFull: z.string().max(2000, 'Full bio must not exceed 2000 characters').optional(),

  // Job & Expertise
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  expertise: z.array(z.string()).max(10, 'Maximum 10 expertise areas').optional(),

  // Credentials & Authority (E-E-A-T)
  credentials: z.string().max(100, 'Credentials too long').optional(), // e.g., "MD, PhD"
  education: z.string().max(200).optional(),
  certifications: z.array(z.string()).max(10).optional(),
  awards: z.array(z.string()).max(10).optional(),
  yearsOfExperience: z.number().int().min(0).max(70).optional(),

  // Social Proof
  socialLinks: socialLinksSchema,

  // Link to User Account
  userId: z.string().optional(),

  // Author Type
  type: z.enum(['staff', 'contributor', 'guest', 'expert']).default('contributor'),

  // Status
  status: z.enum(['active', 'inactive']).default('active'),

  // SEO
  metaDescription: z.string().max(160).optional(),
});

/**
 * Post Author Info Schema (for post editor)
 */
export const postAuthorInfoSchema = z
  .object({
    // Primary Author
    authorId: z.string().optional(),

    // Reviewer (for YMYL content)
    reviewerId: z.string().optional(),

    // Guest Author (if not using authorId)
    guestAuthor: guestAuthorSchema.optional(),

    // Review date
    lastReviewedDate: z.date().optional(),
  })
  .refine((data) => data.authorId || data.guestAuthor, {
    message: 'Either authorId or guestAuthor must be provided',
  });

/**
 * Author Filter Schema
 */
export const authorFilterSchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
  type: z.enum(['staff', 'contributor', 'guest', 'expert']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'postCount', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * Slug generation helper
 */
export function generateAuthorSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple hyphens
}

/**
 * Validate and sanitize author data
 */
export function validateAuthorData(data: unknown) {
  return authorSchema.parse(data);
}

/**
 * Type exports
 */
export type AuthorFormData = z.infer<typeof authorSchema>;
export type PostAuthorInfoFormData = z.infer<typeof postAuthorInfoSchema>;
export type GuestAuthorFormData = z.infer<typeof guestAuthorSchema>;
