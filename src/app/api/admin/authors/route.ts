// Admin API: Authors CRUD
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { authorSchema, authorFilterSchema, generateAuthorSlug } from '@/lib/schemas/author';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/authors
 * List all authors with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = authorFilterSchema.parse({
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    const { authors, posts } = await getCollections();

    // Build query
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { bio: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Count total
    const total = await authors.countDocuments(query);

    // Sort
    const sortField = filters.sortBy === 'postCount' ? 'postCount' : filters.sortBy;
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    // Fetch authors
    const authorsList = await authors
      .find(query)
      .sort({ [sortField]: sortDirection })
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .toArray();

    // Calculate post counts for each author
    const authorsWithStats = await Promise.all(
      authorsList.map(async (author) => {
        const postCount = await posts.countDocuments({
          'authorInfo.authorId': author._id.toString(),
          status: 'published',
        });
        
        const reviewedCount = await posts.countDocuments({
          'authorInfo.reviewerId': author._id.toString(),
          status: 'published',
        });

        return {
          ...author,
          id: author._id.toString(),
          postCount,
          reviewedCount,
        };
      })
    );

    return NextResponse.json({
      authors: authorsWithStats,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/authors
 * Create new author
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate data
    const validatedData = authorSchema.parse(body);

    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = generateAuthorSlug(validatedData.name);
    }

    const { authors } = await getCollections();

    // Check if slug already exists
    const existingAuthor = await authors.findOne({ slug: validatedData.slug });
    if (existingAuthor) {
      return NextResponse.json(
        { error: 'An author with this slug already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (validatedData.email) {
      const existingEmail = await authors.findOne({ email: validatedData.email });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'An author with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Create author
    const newAuthor = {
      ...validatedData,
      postCount: 0,
      reviewedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await authors.insertOne(newAuthor);

    return NextResponse.json(
      {
        message: 'Author created successfully',
        author: {
          ...newAuthor,
          id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating author:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid author data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}

