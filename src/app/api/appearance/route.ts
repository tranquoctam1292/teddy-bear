// Public Appearance API Route (No authentication required)
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

function generateId(): string {
  return `appearance_${Date.now()}`;
}

// GET - Get appearance configuration (Public)
export async function GET(request: NextRequest) {
  // Default configuration
  const defaultConfig = {
    id: generateId(),
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    borderRadius: 'md',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const { appearanceConfig } = await getCollections();
    const config = await appearanceConfig.findOne({});

    if (!config) {
      // Return default config
      return NextResponse.json({ config: defaultConfig }, { status: 200 });
    }

    const { _id, ...configData } = config as any;
    return NextResponse.json({
      config: {
        ...configData,
        id: configData.id || _id.toString(),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching appearance config:', error);
    // Return default config on error with 200 status (graceful degradation)
    return NextResponse.json({ config: defaultConfig }, { status: 200 });
  }
}

