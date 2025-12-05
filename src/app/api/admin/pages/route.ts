import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { Page, PageFilter } from '@/lib/types/page';

// GET /api/admin/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter: PageFilter = {
      status: (searchParams.get('status') as any) || 'all',
      search: searchParams.get('search') || '',
      parentId: searchParams.get('parentId') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const { pages } = await getCollections();

    // Build MongoDB query
    const query: any = {};

    // Filter by status
    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    // Filter by parent
    if (filter.parentId !== undefined) {
      query.parentId = filter.parentId === 'null' ? null : filter.parentId;
    }

    // Search filter
    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { slug: { $regex: filter.search, $options: 'i' } },
        { content: { $regex: filter.search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await pages.countDocuments(query);

    // Get pages with pagination
    const pagesList = await pages
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(filter.skip || 0)
      .limit(filter.limit || 50)
      .toArray();

    return NextResponse.json({
      success: true,
      pages: pagesList.map((page: any) => ({
        ...page,
        _id: page._id?.toString(),
      })),
      total,
      page: Math.floor((filter.skip || 0) / (filter.limit || 50)) + 1,
      totalPages: Math.ceil(total / (filter.limit || 50)),
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      status,
      parentId,
      template,
      order,
      seoTitle,
      seoDescription,
      featuredImage,
      customCSS,
      customJS,
    } = body;

    // Validation
    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const { pages } = await getCollections();

    // Check if slug already exists
    const existing = await pages.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create page
    const newPage: Omit<Page, '_id'> = {
      title,
      slug,
      content: content || '',
      excerpt: excerpt || '',
      status: status || 'draft',
      parentId: parentId || undefined,
      template: template || 'default',
      order: order || 0,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || '',
      featuredImage: featuredImage || '',
      customCSS: customCSS || '',
      customJS: customJS || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: status === 'published' ? new Date() : undefined,
    };

    const result = await pages.insertOne(newPage as any);

    return NextResponse.json({
      success: true,
      page: {
        ...newPage,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/pages (bulk update)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { pages } = await getCollections();
    const { ObjectId } = await import('mongodb');

    let update: any = {};

    switch (action) {
      case 'publish':
        update = { status: 'published', publishedAt: new Date() };
        break;
      case 'draft':
        update = { status: 'draft' };
        break;
      case 'trash':
        update = { status: 'trash' };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    update.updatedAt = new Date();

    const result = await pages.updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      { $set: update }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error bulk updating pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pages' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages (bulk delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { pages } = await getCollections();
    const { ObjectId } = await import('mongodb');

    const result = await pages.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete pages' },
      { status: 500 }
    );
  }
}




