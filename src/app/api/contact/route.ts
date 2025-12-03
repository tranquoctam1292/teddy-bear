// Public Contact API Route - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import type { ContactMessage } from '@/lib/schemas/contact';

// Helper to generate unique ID
function generateId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// POST - Submit contact form message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create contact message
    const newContact: ContactMessage = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      isRead: false,
      isReplied: false,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    try {
      const { contacts } = await getCollections();
      await contacts.insertOne(newContact);
    } catch (dbError) {
      console.error('Error saving contact to database:', dbError);
      // Continue even if database fails (for backward compatibility)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
        contactId: newContact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
