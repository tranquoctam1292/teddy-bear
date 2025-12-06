// System Notifications API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { SystemNotification } from '@/lib/schemas/notification-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `sys_notif_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

const SYSTEM_EVENTS = [
  'new_order',
  'low_stock',
  'new_contact',
  'payment_received',
  'order_cancelled',
  'user_registered',
];

// GET - Get all system notification configurations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { systemNotifications } = await getCollections();
    
    // Get existing notifications
    const existingNotifications = await systemNotifications.find({}).toArray();
    const notificationsMap = new Map(
      existingNotifications.map((n: any) => [n.event, n])
    );

    // Ensure all events have a configuration
    const allNotifications = SYSTEM_EVENTS.map((event) => {
      const existing = notificationsMap.get(event);
      if (existing) {
        const { _id, ...notifData } = existing;
        return {
          ...notifData,
          id: notifData.id || _id.toString(),
        };
      }
      // Default configuration
      return {
        id: generateId(),
        event,
        enabled: event === 'new_order' || event === 'low_stock',
        channels: {
          email: true,
          inApp: true,
          push: false,
        },
        recipients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error('Error fetching system notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update notification configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, event, enabled, channels, recipients, templateId } = body;

    if (!event || !SYSTEM_EVENTS.includes(event)) {
      return NextResponse.json(
        { error: 'Invalid system event' },
        { status: 400 }
      );
    }

    const { systemNotifications } = await getCollections();

    // Check if notification exists
    const existing = await systemNotifications.findOne({
      $or: id ? [{ id }, { _id: new ObjectId(id) }] : [{ event }],
    });

    const updateData: any = {
      event,
      enabled: enabled !== undefined ? enabled : true,
      channels: channels || {
        email: true,
        inApp: true,
        push: false,
      },
      recipients: recipients || [],
      templateId: templateId || undefined,
      updatedAt: new Date(),
    };

    if (existing) {
      // Update existing
      await systemNotifications.updateOne(
        { $or: [{ id: existing.id }, { _id: existing._id }] },
        { $set: updateData }
      );
    } else {
      // Create new
      const newNotification: SystemNotification = {
        id: id || generateId(),
        ...updateData,
        createdAt: new Date(),
      };
      await systemNotifications.insertOne(newNotification);
    }

    // Get updated notification
    const updated = await systemNotifications.findOne({ event });
    const { _id, ...notifData } = updated as any;

    return NextResponse.json({
      notification: {
        ...notifData,
        id: notifData.id || _id.toString(),
      },
      message: 'System notification configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating system notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








