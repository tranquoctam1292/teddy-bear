// Product Attribute API Route (Single)
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

function generateValueId(): string {
  return `val_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// PUT - Update attribute
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
    const { name, type, values, isRequired, order } = body;

    const { productAttributes } = await getCollections();

    const existingAttribute = await productAttributes.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingAttribute) {
      return NextResponse.json(
        { error: 'Attribute not found' },
        { status: 404 }
      );
    }

    let slug = existingAttribute.slug;
    if (name && name !== existingAttribute.name) {
      slug = generateSlug(name);
      const slugExists = await productAttributes.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Attribute with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Process values - assign IDs to new values
    let processedValues = values || [];
    if (Array.isArray(values)) {
      processedValues = values.map((val: any, index: number) => ({
        id: val.id || generateValueId(),
        label: val.label || val.value || '',
        value: val.value || val.label || '',
        color: val.color,
        image: val.image,
        order: val.order !== undefined ? val.order : index,
      }));
    }

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (slug) updateData.slug = slug;
    if (type !== undefined) updateData.type = type;
    if (values !== undefined) updateData.values = processedValues;
    if (isRequired !== undefined) updateData.isRequired = isRequired;
    if (order !== undefined) updateData.order = order;

    await productAttributes.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedAttribute = await productAttributes.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...attrData } = updatedAttribute as any;
    return NextResponse.json({
      attribute: {
        ...attrData,
        id: attrData.id || _id.toString(),
      },
      message: 'Attribute updated successfully',
    });
  } catch (error) {
    console.error('Error updating attribute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete attribute
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
    const { productAttributes } = await getCollections();

    const attribute = await productAttributes.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!attribute) {
      return NextResponse.json(
        { error: 'Attribute not found' },
        { status: 404 }
      );
    }

    await productAttributes.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Attribute deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





