// Public Navigation API Route - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// GET - Get menu by location (public, no auth required)
export async function GET(request: NextRequest) {
  try {
    const { navigation } = await getCollections();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    // Get menu by location (only active menus)
    const menu = await navigation.findOne({ location, isActive: true });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Format menu (remove _id, ensure id exists)
    const { _id, ...menuData } = menu as any;
    const formattedMenu = {
      ...menuData,
      id: menuData.id || _id.toString(),
    };

    return NextResponse.json({ menu: formattedMenu });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    // Fallback to empty menu if database fails
    return NextResponse.json({
      menu: {
        location: 'header',
        name: 'Main Menu',
        items: [],
        isActive: true,
      },
    });
  }
}
