// Appearance Configuration API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { AppearanceConfig } from '@/lib/schemas/appearance-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `appearance_${Date.now()}`;
}

// GET - Get appearance configuration
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appearanceConfig } = await getCollections();
    const config = await appearanceConfig.findOne({});

    if (!config) {
      // Return default config
      return NextResponse.json({
        config: {
          id: generateId(),
          theme: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          borderRadius: 'md',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const { _id, ...configData } = config as any;
    return NextResponse.json({
      config: {
        ...configData,
        id: configData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching appearance config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update appearance configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { theme, primaryColor, secondaryColor, logo, favicon, fontFamily, borderRadius } = body;

    // Validate theme
    if (theme && !['light', 'dark', 'auto'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme. Must be light, dark, or auto' },
        { status: 400 }
      );
    }

    // Validate colors (hex format)
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primaryColor && !hexColorRegex.test(primaryColor)) {
      return NextResponse.json(
        { error: 'Invalid primary color format. Must be hex color (e.g., #3B82F6)' },
        { status: 400 }
      );
    }
    if (secondaryColor && !hexColorRegex.test(secondaryColor)) {
      return NextResponse.json(
        { error: 'Invalid secondary color format. Must be hex color (e.g., #8B5CF6)' },
        { status: 400 }
      );
    }

    // Validate borderRadius
    if (borderRadius && !['none', 'sm', 'md', 'lg', 'xl'].includes(borderRadius)) {
      return NextResponse.json(
        { error: 'Invalid border radius. Must be none, sm, md, lg, or xl' },
        { status: 400 }
      );
    }

    const { appearanceConfig } = await getCollections();

    const existing = await appearanceConfig.findOne({});

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (theme !== undefined) updateData.theme = theme;
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
    if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
    if (logo !== undefined) updateData.logo = logo;
    if (favicon !== undefined) updateData.favicon = favicon;
    if (fontFamily !== undefined) updateData.fontFamily = fontFamily;
    if (borderRadius !== undefined) updateData.borderRadius = borderRadius;

    if (existing) {
      await appearanceConfig.updateOne({}, { $set: updateData });
    } else {
      const newConfig: AppearanceConfig = {
        id: generateId(),
        theme: theme || 'light',
        primaryColor: primaryColor || '#3B82F6',
        secondaryColor: secondaryColor || '#8B5CF6',
        logo: logo,
        favicon: favicon,
        fontFamily: fontFamily,
        borderRadius: borderRadius || 'md',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await appearanceConfig.insertOne(newConfig);
    }

    const updated = await appearanceConfig.findOne({});
    const { _id, ...configData } = updated as any;

    return NextResponse.json({
      config: {
        ...configData,
        id: configData.id || _id.toString(),
      },
      message: 'Appearance configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating appearance config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



