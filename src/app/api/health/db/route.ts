import { NextResponse } from 'next/server';
import { connectDB, getCollections } from '@/lib/db';

/**
 * Test MongoDB Connection
 * GET /api/health/db
 */
export async function GET() {
  try {
    // Test connection
    await connectDB();

    // Test database access
    const { db } = await getCollections();
    const collections = await db.listCollections().toArray();

    // Get database stats
    const stats = await db.stats();

    return NextResponse.json(
      {
        success: true,
        data: {
          connected: true,
          database: db.databaseName,
          collections: collections.length,
          collectionNames: collections.map((c) => c.name),
          stats: {
            collections: stats.collections,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
          },
        },
        message: 'MongoDB connection successful',
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DB_CONNECTION_ERROR',
          message: 'MongoDB connection failed',
          details: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}


