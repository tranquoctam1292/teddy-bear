// Product Categories API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { ProductCategory } from '@/lib/schemas/product-settings';
import { ObjectId } from 'mongodb';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to generate ID
function generateId(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all categories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productCategories } = await getCollections();
    const categories = await productCategories
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedCategories = categories.map((cat: any) => {
      const { _id, ...category } = cat;
      return {
        ...category,
        id: category.id || _id.toString(),
      };
    });

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, image, order, isActive, parentId } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { productCategories } = await getCollections();
    const slug = generateSlug(name);

    // Check if slug already exists
    const existingCategory = await productCategories.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let categoryOrder = order;
    if (categoryOrder === undefined) {
      const maxOrderCategory = await productCategories
        .findOne({}, { sort: { order: -1 } });
      categoryOrder = maxOrderCategory ? (maxOrderCategory.order || 0) + 1 : 0;
    }

    // Create category
    const newCategory: ProductCategory = {
      id: generateId(),
      name: name.trim(),
      slug,
      description: description?.trim(),
      icon,
      image,
      order: categoryOrder,
      isActive: isActive !== undefined ? isActive : true,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productCategories.insertOne(newCategory);

    return NextResponse.json(
      { category: newCategory, message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


