// Admin Contact API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { ContactMessage } from '@/lib/schemas/contact';
import { mockContacts } from '@/lib/data/contacts';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isRead = searchParams.get('isRead'); // 'true' or 'false'
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Filter contacts
    let filteredContacts = [...mockContacts];

    if (isRead !== null && isRead !== '') {
      const readFilter = isRead === 'true';
      filteredContacts = filteredContacts.filter((c) => c.isRead === readFilter);
    }

    if (status) {
      filteredContacts = filteredContacts.filter((c) => c.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredContacts = filteredContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.subject.toLowerCase().includes(searchLower) ||
          c.message.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt (newest first)
    filteredContacts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    return NextResponse.json({
      contacts: paginatedContacts,
      pagination: {
        page,
        limit,
        total: filteredContacts.length,
        totalPages: Math.ceil(filteredContacts.length / limit),
      },
      stats: {
        total: mockContacts.length,
        unread: mockContacts.filter((c) => !c.isRead).length,
        read: mockContacts.filter((c) => c.isRead).length,
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


