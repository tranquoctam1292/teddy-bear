// Product Tag API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// PUT - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, color, description } = body;

    const { productTags } = await getCollections();

    const existingTag = await productTags.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    let slug = existingTag.slug;
    if (name && name !== existingTag.name) {
      slug = generateSlug(name);
      const slugExists = await productTags.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Tag with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (slug) updateData.slug = slug;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description?.trim();

    await productTags.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedTag = await productTags.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...tagData } = updatedTag as any;
    return NextResponse.json({
      tag: {
        ...tagData,
        id: tagData.id || _id.toString(),
      },
      message: 'Tag updated successfully',
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { productTags } = await getCollections();

    const tag = await productTags.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    await productTags.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



