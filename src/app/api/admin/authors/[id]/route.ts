// Admin API: Single Author Operations
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { authorSchema, generateAuthorSlug } from '@/lib/schemas/author';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/authors/[id]
 * Get single author by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { authors, posts } = await getCollections();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    const author = await authors.findOne({ _id: new ObjectId(id) });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Get post counts
    const postCount = await posts.countDocuments({
      'authorInfo.authorId': id,
      status: 'published',
    });

    const reviewedCount = await posts.countDocuments({
      'authorInfo.reviewerId': id,
      status: 'published',
    });

    return NextResponse.json({
      ...author,
      id: author._id.toString(),
      postCount,
      reviewedCount,
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/authors/[id]
 * Update author
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = authorSchema.parse(body);

    // Generate slug if name changed
    if (!validatedData.slug && validatedData.name) {
      validatedData.slug = generateAuthorSlug(validatedData.name);
    }

    const { authors } = await getCollections();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    const authorId = new ObjectId(id);

    // Check if author exists
    const existingAuthor = await authors.findOne({ _id: authorId });
    if (!existingAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Check if slug is taken by another author
    if (validatedData.slug && validatedData.slug !== existingAuthor.slug) {
      const slugTaken = await authors.findOne({
        slug: validatedData.slug,
        _id: { $ne: authorId },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug already taken by another author' },
          { status: 400 }
        );
      }
    }

    // Check if email is taken by another author
    if (validatedData.email && validatedData.email !== existingAuthor.email) {
      const emailTaken = await authors.findOne({
        email: validatedData.email,
        _id: { $ne: authorId },
      });
      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email already taken by another author' },
          { status: 400 }
        );
      }
    }

    // Update author
    const result = await authors.updateOne(
      { _id: authorId },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Fetch updated author
    const updatedAuthor = await authors.findOne({ _id: authorId });

    return NextResponse.json({
      message: 'Author updated successfully',
      author: {
        ...updatedAuthor,
        id: updatedAuthor?._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating author:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid author data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/authors/[id]
 * Delete author
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { authors, posts } = await getCollections();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    // Check if author has posts
    const postCount = await posts.countDocuments({
      $or: [
        { 'authorInfo.authorId': id },
        { 'authorInfo.reviewerId': id },
      ],
    });

    if (postCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete author with existing posts',
          message: `This author has ${postCount} post(s). Please reassign or delete them first.`,
        },
        { status: 400 }
      );
    }

    // Delete author
    const result = await authors.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Author deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}

