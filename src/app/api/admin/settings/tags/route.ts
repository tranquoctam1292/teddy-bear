// Product Tags API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { ProductTag } from '@/lib/schemas/product-settings';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId(): string {
  return `tag_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all tags
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productTags, products } = await getCollections();
    const tags = await productTags.find({}).sort({ createdAt: -1 }).toArray();

    // Calculate product count for each tag
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag: any) => {
        const count = await products.countDocuments({
          tags: { $in: [tag.name] },
        });
        return {
          ...tag,
          productCount: count,
        };
      })
    );

    const formattedTags = tagsWithCounts.map((tag: any) => {
      const { _id, ...tagData } = tag;
      return {
        ...tagData,
        id: tagData.id || _id.toString(),
      };
    });

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, color, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const { productTags } = await getCollections();
    const slug = generateSlug(name);

    const existingTag = await productTags.findOne({ slug });
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 400 }
      );
    }

    const newTag: ProductTag = {
      id: generateId(),
      name: name.trim(),
      slug,
      color,
      description: description?.trim(),
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productTags.insertOne(newTag);

    return NextResponse.json(
      { tag: newTag, message: 'Tag created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




