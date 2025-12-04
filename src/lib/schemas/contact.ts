// Contact Message Schema
import type { ObjectId } from 'mongodb';

/**
 * Contact Message Schema
 * For tracking customer inquiries from contact form
 */
export interface ContactMessage {
  _id?: ObjectId;
  id: string; // Unique identifier
  name: string; // Customer name
  email: string; // Customer email
  phone?: string; // Customer phone (optional)
  subject: string; // Message subject
  message: string; // Message content
  
  // Status tracking
  isRead: boolean; // Whether admin has read the message
  isReplied: boolean; // Whether admin has replied
  status: 'new' | 'read' | 'replied' | 'archived'; // Message status
  
  // Admin notes
  adminNotes?: string; // Internal notes for admin
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date; // When admin read the message
  repliedAt?: Date; // When admin replied
}

/**
 * Contact Message Summary (for listing pages)
 */
export interface ContactMessageSummary {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  status: ContactMessage['status'];
  createdAt: Date;
}





