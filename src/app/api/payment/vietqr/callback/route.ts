/**
 * VietQR Payment Callback Handler
 * 
 * This endpoint receives payment notifications from VietQR
 * Note: VietQR typically uses webhook or manual verification
 */
import { NextRequest, NextResponse } from 'next/server';
import { confirmReservation, releaseReservation } from '@/lib/stock/reservation';
import { getCollections } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { orderId, status, transactionId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const { orders } = await getCollections();
    const order = await orders.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // status: 'success' | 'failed' | 'pending'
    if (status === 'success') {
      // Payment successful
      await orders.updateOne(
        { orderId },
        {
          $set: {
            'paymentDetails.status': 'completed',
            'paymentDetails.paidAt': new Date(),
            'paymentDetails.transactionId': transactionId,
            orderStatus: 'confirmed',
            updatedAt: new Date(),
          },
        }
      );

      // Confirm stock reservation (subtract stock)
      await confirmReservation(orderId);
    } else if (status === 'failed') {
      // Payment failed
      await orders.updateOne(
        { orderId },
        {
          $set: {
            'paymentDetails.status': 'failed',
            orderStatus: 'cancelled',
            updatedAt: new Date(),
          },
        }
      );

      // Release stock reservation
      await releaseReservation(orderId);
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed',
    });
  } catch (error) {
    console.error('VietQR callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




