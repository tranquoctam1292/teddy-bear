// User Activity Logs API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET - Get user activity logs
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { userActivityLogs } = await getCollections();

    const logs = await userActivityLogs
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();

    const total = await userActivityLogs.countDocuments({ userId: id });

    const formattedLogs = logs.map((log: any) => {
      const { _id, ...logData } = log;
      return {
        ...logData,
        id: logData.id || _id.toString(),
      };
    });

    return NextResponse.json({
      logs: formattedLogs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


