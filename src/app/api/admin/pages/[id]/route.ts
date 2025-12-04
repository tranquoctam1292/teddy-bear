import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/admin/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { pages } = await getCollections();
    const page = await pages.findOne({ _id: new ObjectId(params.id) });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    // Get parent page if exists
    let parent = null;
    if (page.parentId) {
      parent = await pages.findOne({ _id: new ObjectId(page.parentId) });
    }

    // Get child pages
    const children = await pages
      .find({ parentId: params.id })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      page: {
        ...page,
        _id: page._id?.toString(),
        parent: parent
          ? {
              _id: parent._id?.toString(),
              title: parent.title,
              slug: parent.slug,
            }
          : null,
        children: children.map((child: any) => ({
          ...child,
          _id: child._id?.toString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/pages/[id] - Update page
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    const { pages } = await getCollections();

    // Check if slug is being changed and if it's unique
    if (slug) {
      const existing = await pages.findOne({
        slug,
        _id: { $ne: new ObjectId(params.id) },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update
    const update: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (content !== undefined) update.content = content;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (status !== undefined) {
      update.status = status;
      if (status === 'published') {
        // Only set publishedAt if it's being published for the first time
        const currentPage = await pages.findOne({
          _id: new ObjectId(params.id),
        });
        if (currentPage && currentPage.status !== 'published') {
          update.publishedAt = new Date();
        }
      }
    }
    if (parentId !== undefined) update.parentId = parentId || null;
    if (template !== undefined) update.template = template;
    if (order !== undefined) update.order = order;
    if (seoTitle !== undefined) update.seoTitle = seoTitle;
    if (seoDescription !== undefined) update.seoDescription = seoDescription;
    if (featuredImage !== undefined) update.featuredImage = featuredImage;
    if (customCSS !== undefined) update.customCSS = customCSS;
    if (customJS !== undefined) update.customJS = customJS;

    const result = await pages.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    // Get updated page
    const updatedPage = await pages.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      page: {
        ...updatedPage,
        _id: updatedPage?._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages/[id] - Delete single page
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { pages } = await getCollections();

    // Check if page has children
    const children = await pages.countDocuments({ parentId: params.id });
    if (children > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete page with child pages. Delete children first.',
        },
        { status: 400 }
      );
    }

    const result = await pages.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}


