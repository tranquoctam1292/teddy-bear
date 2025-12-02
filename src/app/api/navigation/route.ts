// Public Navigation API Route (Read-only)
import { NextRequest, NextResponse } from 'next/server';
import type { NavigationMenu } from '@/lib/schemas/navigation';
import { mockMenus } from '@/lib/data/navigation';

// GET - Get menu by location (Public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Missing required parameter: location' },
        { status: 400 }
      );
    }

    // Find active menu by location
    const menu = mockMenus.find(
      (m) => m.location === location && m.isActive
    );

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


