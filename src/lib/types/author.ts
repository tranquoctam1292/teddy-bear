// Author Management Types for E-E-A-T SEO Compliance
import { ObjectId } from 'mongodb';

/**
 * Author Profile - Separate from User Account
 * Supports E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 */
export interface Author {
  _id?: ObjectId;
  id?: string;
  
  // Basic Info
  name: string;
  slug: string; // URL-friendly: /author/john-doe
  email?: string;
  avatar?: string; // URL to profile image
  
  // Bio & Experience
  bio: string; // Short bio (160-200 chars for meta description)
  bioFull?: string; // Full biography (for author page)
  
  // Job & Expertise
  jobTitle?: string; // e.g., "Senior Health Editor"
  company?: string; // e.g., "Medical Institute"
  expertise?: string[]; // e.g., ["Cardiology", "Nutrition"]
  
  // Credentials & Authority (E-E-A-T)
  credentials?: string; // e.g., "MD, PhD"
  education?: string; // e.g., "Harvard Medical School"
  certifications?: string[]; // Professional certifications
  awards?: string[]; // Awards and recognition
  yearsOfExperience?: number;
  
  // Social Proof
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  
  // Link to User Account (if exists)
  userId?: string; // ObjectId of user who owns this profile
  
  // Author Type
  type: 'staff' | 'contributor' | 'guest' | 'expert'; // Type of author
  
  // Status
  status: 'active' | 'inactive';
  
  // SEO
  metaDescription?: string;
  
  // Stats
  postCount?: number; // Calculated field
  reviewedCount?: number; // How many posts they reviewed
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guest Author - Temporary author without account
 */
export interface GuestAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  jobTitle?: string;
  credentials?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
  };
}

/**
 * Author Assignment for Post
 */
export interface PostAuthorInfo {
  // Primary Author (Written by)
  authorId?: string; // Reference to Author _id
  authorName?: string; // For display
  
  // Reviewer/Medical Expert (Reviewed by) - YMYL compliance
  reviewerId?: string; // Reference to Author _id
  reviewerName?: string; // For display
  
  // Guest Author (overrides authorId if set)
  guestAuthor?: GuestAuthor;
  
  // Last reviewed date (important for medical content)
  lastReviewedDate?: Date;
}

/**
 * Author Schema.org Person for JSON-LD
 */
export interface AuthorSchemaOrg {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url?: string; // Author page URL
  image?: string; // Avatar URL
  description?: string; // Bio
  jobTitle?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  alumniOf?: string; // Education
  award?: string[]; // Awards
  sameAs?: string[]; // Social media URLs
  honorificPrefix?: string; // Dr., Prof., etc.
  knowsAbout?: string[]; // Expertise areas
}

/**
 * Author Box Display Props
 */
export interface AuthorBoxProps {
  author: Author | GuestAuthor;
  showBio?: boolean;
  showSocial?: boolean;
  showStats?: boolean;
  variant?: 'compact' | 'detailed';
}

/**
 * Author Filter Options
 */
export interface AuthorFilterOptions {
  status?: 'active' | 'inactive';
  type?: 'staff' | 'contributor' | 'guest' | 'expert';
  search?: string;
  sortBy?: 'name' | 'postCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

