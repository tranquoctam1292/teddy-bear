// Product Attributes API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { ProductAttribute } from '@/lib/schemas/product-settings';
import { ObjectId } from 'mongodb';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(): string {
  return `attr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateValueId(): string {
  return `val_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all attributes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productAttributes } = await getCollections();
    const attributes = await productAttributes
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedAttributes = attributes.map((attr: any) => {
      const { _id, ...attrData } = attr;
      return {
        ...attrData,
        id: attrData.id || _id.toString(),
      };
    });

    return NextResponse.json({ attributes: formattedAttributes });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new attribute
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, values, isRequired, order } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    if (!['text', 'select', 'multiselect', 'number', 'boolean'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid attribute type' },
        { status: 400 }
      );
    }

    const { productAttributes } = await getCollections();
    const slug = generateSlug(name);

    const existingAttribute = await productAttributes.findOne({ slug });
    if (existingAttribute) {
      return NextResponse.json(
        { error: 'Attribute with this name already exists' },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let attributeOrder = order;
    if (attributeOrder === undefined) {
      const maxOrderAttribute = await productAttributes.findOne({}, { sort: { order: -1 } });
      attributeOrder = maxOrderAttribute ? (maxOrderAttribute.order || 0) + 1 : 0;
    }

    // Process values - assign IDs if not provided
    const processedValues = (values || []).map((val: any, index: number) => ({
      id: val.id || generateValueId(),
      label: val.label || val.value || '',
      value: val.value || val.label || '',
      color: val.color,
      image: val.image,
      order: val.order !== undefined ? val.order : index,
    }));

    const newAttribute: ProductAttribute = {
      id: generateId(),
      name: name.trim(),
      slug,
      type: type as ProductAttribute['type'],
      values: processedValues,
      isRequired: isRequired !== undefined ? isRequired : false,
      order: attributeOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productAttributes.insertOne(newAttribute);

    return NextResponse.json(
      { attribute: newAttribute, message: 'Attribute created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



