// Order Notifications API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { OrderNotification } from '@/lib/schemas/order-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

const NOTIFICATION_EVENTS: OrderNotification['event'][] = [
  'order_created',
  'order_confirmed',
  'order_shipped',
  'order_delivered',
  'order_cancelled',
];

// GET - Get all notification configurations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderNotifications } = await getCollections();
    
    // Get existing notifications
    const existingNotifications = await orderNotifications.find({}).toArray();
    const notificationsMap = new Map(
      existingNotifications.map((n: any) => [n.event, n])
    );

    // Ensure all events have a configuration
    const allNotifications = NOTIFICATION_EVENTS.map((event) => {
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
        enabled: event === 'order_created' || event === 'order_confirmed',
        sendToCustomer: true,
        sendToAdmin: event === 'order_created',
        adminEmails: [],
        emailTemplateId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error('Error fetching order notifications:', error);
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
    const { id, event, enabled, sendToCustomer, sendToAdmin, adminEmails, emailTemplateId } = body;

    if (!event || !NOTIFICATION_EVENTS.includes(event)) {
      return NextResponse.json(
        { error: 'Invalid notification event' },
        { status: 400 }
      );
    }

    const { orderNotifications } = await getCollections();

    // Check if notification exists
    const existing = await orderNotifications.findOne({
      $or: id ? [{ id }, { _id: new ObjectId(id) }] : [{ event }],
    });

    const updateData: any = {
      event,
      enabled: enabled !== undefined ? enabled : true,
      sendToCustomer: sendToCustomer !== undefined ? sendToCustomer : true,
      sendToAdmin: sendToAdmin !== undefined ? sendToAdmin : false,
      adminEmails: adminEmails || [],
      emailTemplateId: emailTemplateId || undefined,
      updatedAt: new Date(),
    };

    if (existing) {
      // Update existing
      await orderNotifications.updateOne(
        { $or: [{ id: existing.id }, { _id: existing._id }] },
        { $set: updateData }
      );
    } else {
      // Create new
      const newNotification: OrderNotification = {
        id: id || generateId(),
        ...updateData,
        createdAt: new Date(),
      };
      await orderNotifications.insertOne(newNotification);
    }

    // Get updated notification
    const updated = await orderNotifications.findOne({ event });
    const { _id, ...notifData } = updated as any;

    return NextResponse.json({
      notification: {
        ...notifData,
        id: notifData.id || _id.toString(),
      },
      message: 'Notification configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating order notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





