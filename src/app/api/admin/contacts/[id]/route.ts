// Admin Contact API Routes - Single Contact Operations (MongoDB)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { ContactMessage } from '@/lib/schemas/contact';
import { ObjectId } from 'mongodb';

// GET - Get single contact message by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { contacts } = await getCollections();

    // Try to find by id field first, then by _id
    let contact = await contacts.findOne({ id });
    if (!contact) {
      try {
        contact = await contacts.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

    // Format contact
    const { _id, ...contactData } = contact as any;
    const formattedContact = {
      ...contactData,
      id: contactData.id || _id.toString(),
    };

    return NextResponse.json({ contact: formattedContact });
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();
    const { isRead, status, adminNotes, isReplied } = body;

    const { contacts } = await getCollections();

    // Find contact
    let contact = await contacts.findOne({ id });
    if (!contact) {
      try {
        contact = await contacts.findOne({ _id: new ObjectId(id) });
      } catch {
        return NextResponse.json(
          { error: 'Contact message not found' },
          { status: 404 }
        );
      }
    }

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

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
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (isRead !== undefined) {
      updateData.isRead = isRead;
      if (isRead === true && !contact.readAt) {
        updateData.readAt = new Date();
      }
    }

    if (isReplied !== undefined) {
      updateData.isReplied = isReplied;
      if (isReplied === true && !contact.repliedAt) {
        updateData.repliedAt = new Date();
      }
    }

    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    await contacts.updateOne(
      { id },
      { $set: updateData }
    );

    // Fetch updated contact
    const updatedContact = await contacts.findOne({ id });
    const { _id, ...contactData } = updatedContact as any;
    const formattedContact = {
      ...contactData,
      id: contactData.id || _id.toString(),
    };

    return NextResponse.json({
      contact: formattedContact,
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { contacts } = await getCollections();

    // Try to find and delete by id field first
    let result = await contacts.deleteOne({ id });
    
    // If not found, try MongoDB _id
    if (result.deletedCount === 0) {
      try {
        result = await contacts.deleteOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }

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
