// Admin Contact API Routes - Single Contact Operations
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { ContactMessage } from '@/lib/schemas/contact';
import { mockContacts } from '@/lib/data/contacts';

// GET - Get single contact message by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contact = mockContacts.find((c) => c.id === params.id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update contact message (mark as read, update status, add notes)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isRead, status, adminNotes, isReplied } = body;

    const contactIndex = mockContacts.findIndex((c) => c.id === params.id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    const existingContact = mockContacts[contactIndex];

    // Validate status if provided
    const validStatuses: ContactMessage['status'][] = [
      'new',
      'read',
      'replied',
      'archived',
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update contact
    const updatedContact: ContactMessage = {
      ...existingContact,
      isRead: isRead !== undefined ? isRead : existingContact.isRead,
      isReplied: isReplied !== undefined ? isReplied : existingContact.isReplied,
      status: status || existingContact.status,
      adminNotes: adminNotes !== undefined ? adminNotes : existingContact.adminNotes,
      readAt:
        isRead === true && !existingContact.readAt
          ? new Date()
          : existingContact.readAt,
      repliedAt:
        isReplied === true && !existingContact.repliedAt
          ? new Date()
          : existingContact.repliedAt,
      updatedAt: new Date(),
    };

    mockContacts[contactIndex] = updatedContact;

    return NextResponse.json({
      contact: updatedContact,
      message: 'Contact message updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contactIndex = mockContacts.findIndex((c) => c.id === params.id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    mockContacts.splice(contactIndex, 1);

    return NextResponse.json({
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


