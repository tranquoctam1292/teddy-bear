// Admin Navigation API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { NavigationMenu, NavigationMenuItem } from '@/lib/schemas/navigation';
import { mockMenus } from '@/lib/data/navigation';

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

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (location) {
      // Get menu by location
      const menu = mockMenus.find((m) => m.location === location);
      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ menu });
    }

    // Return all menus
    return NextResponse.json({ menus: mockMenus });
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

    // Check if location already exists
    const existingMenu = mockMenus.find((m) => m.location === location);
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

    mockMenus.push(newMenu);

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

    const menuIndex = mockMenus.findIndex((m) => m.location === location);

    if (menuIndex === -1) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    const existingMenu = mockMenus[menuIndex];

    // Assign IDs to new items if provided
    const itemsWithIds = items ? assignMenuItemIds(items) : existingMenu.items;

    // Update menu
    const updatedMenu: NavigationMenu = {
      ...existingMenu,
      name: name || existingMenu.name,
      items: itemsWithIds,
      isActive: isActive !== undefined ? isActive : existingMenu.isActive,
      updatedAt: new Date(),
    };

    mockMenus[menuIndex] = updatedMenu;

    return NextResponse.json({
      menu: updatedMenu,
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

    const menuIndex = mockMenus.findIndex((m) => m.location === location);

    if (menuIndex === -1) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    mockMenus.splice(menuIndex, 1);

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


