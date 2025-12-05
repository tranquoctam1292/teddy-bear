// Product Category API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
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

// GET - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { productCategories } = await getCollections();

    const category = await productCategories.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const { _id, ...categoryData } = category as any;
    return NextResponse.json({
      category: {
        ...categoryData,
        id: categoryData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update category
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
    const { name, description, icon, image, order, isActive, parentId } = body;

    const { productCategories } = await getCollections();

    // Check if category exists
    const existingCategory = await productCategories.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = generateSlug(name);
      // Check if new slug already exists
      const slugExists = await productCategories.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description?.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (parentId !== undefined) updateData.parentId = parentId;

    await productCategories.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    // Get updated category
    const updatedCategory = await productCategories.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...categoryData } = updatedCategory as any;
    return NextResponse.json({
      category: {
        ...categoryData,
        id: categoryData.id || _id.toString(),
      },
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
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
    const { productCategories, products } = await getCollections();

    // Check if category exists
    const category = await productCategories.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is being used by any products
    const productsUsingCategory = await products.countDocuments({
      category: category.slug,
    });

    if (productsUsingCategory > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It is being used by ${productsUsingCategory} product(s)`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await productCategories.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





