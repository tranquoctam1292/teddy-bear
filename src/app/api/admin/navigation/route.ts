// Admin Navigation API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { NavigationMenu, NavigationMenuItem } from '@/lib/schemas/navigation';
import { ObjectId } from 'mongodb';

// Helper to generate unique ID
function generateId(): string {
  return `menu_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateMenuItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Helper to assign IDs to menu items recursively
function assignMenuItemIds(items: NavigationMenuItem[]): NavigationMenuItem[] {
  return items.map((item) => ({
    ...item,
    id: item.id || generateMenuItemId(),
    children: item.children ? assignMenuItemIds(item.children) : undefined,
  }));
}

// GET - List all menus or get menu by location
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { navigation } = await getCollections();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (location) {
      // Get menu by location
      const menu = await navigation.findOne({ location });
      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }
      const { _id, ...menuData } = menu as any;
      return NextResponse.json({
        menu: {
          ...menuData,
          id: menuData.id || _id.toString(),
        },
      });
    }

    // Return all menus
    const menusList = await navigation.find({}).toArray();
    const formattedMenus = menusList.map((doc: any) => {
      const { _id, ...menu } = doc;
      return {
        ...menu,
        id: menu.id || _id.toString(),
      };
    });

    return NextResponse.json({ menus: formattedMenus });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new menu
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { location, name, items, isActive } = body;

    // Validation
    if (!location || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: location, name' },
        { status: 400 }
      );
    }

    const { navigation } = await getCollections();

    // Check if location already exists
    const existingMenu = await navigation.findOne({ location });
    if (existingMenu) {
      return NextResponse.json(
        { error: 'Menu location already exists' },
        { status: 400 }
      );
    }

    // Assign IDs to menu items
    const itemsWithIds = items ? assignMenuItemIds(items) : [];

    // Create menu
    const newMenu: NavigationMenu = {
      id: generateId(),
      location,
      name,
      items: itemsWithIds,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    await navigation.insertOne(newMenu);

    return NextResponse.json(
      { menu: newMenu, message: 'Menu created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing menu
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { location, name, items, isActive } = body;

    if (!location) {
      return NextResponse.json(
        { error: 'Missing required field: location' },
        { status: 400 }
      );
    }

    const { navigation } = await getCollections();

    // Find menu
    const menu = await navigation.findOne({ location });
    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Assign IDs to new items if provided
    const itemsWithIds = items ? assignMenuItemIds(items) : menu.items;

    // Update menu
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (items !== undefined) updateData.items = itemsWithIds;
    if (isActive !== undefined) updateData.isActive = isActive;

    await navigation.updateOne(
      { location },
      { $set: updateData }
    );

    // Fetch updated menu
    const updatedMenu = await navigation.findOne({ location });
    const { _id, ...menuData } = updatedMenu as any;
    const formattedMenu = {
      ...menuData,
      id: menuData.id || _id.toString(),
    };

    return NextResponse.json({
      menu: formattedMenu,
      message: 'Menu updated successfully',
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Missing required parameter: location' },
        { status: 400 }
      );
    }

    const { navigation } = await getCollections();

    const result = await navigation.deleteOne({ location });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Menu deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
