// Admin Contact API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { ContactMessage } from '@/lib/schemas/contact';

// GET - List all contact messages with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { contacts } = await getCollections();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isRead = searchParams.get('isRead'); // 'true' or 'false'
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = {};

    if (isRead !== null && isRead !== '') {
      query.isRead = isRead === 'true';
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      query.$or = [
        { name: { $regex: searchLower, $options: 'i' } },
        { email: { $regex: searchLower, $options: 'i' } },
        { subject: { $regex: searchLower, $options: 'i' } },
        { message: { $regex: searchLower, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await contacts.countDocuments(query);

    // Fetch contacts with pagination
    const contactsList = await contacts
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format contacts
    const formattedContacts = contactsList.map((doc: any) => {
      const { _id, ...contact } = doc;
      return {
        ...contact,
        id: contact.id || _id.toString(),
      };
    });

    // Get stats
    const totalContacts = await contacts.countDocuments({});
    const unreadContacts = await contacts.countDocuments({ isRead: false });
    const readContacts = await contacts.countDocuments({ isRead: true });

    return NextResponse.json({
      contacts: formattedContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalContacts,
        unread: unreadContacts,
        read: readContacts,
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
