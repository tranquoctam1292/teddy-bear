/**
 * MoMo Payment Callback Handler
 * 
 * This endpoint receives payment callbacks from MoMo
 */
import { NextRequest, NextResponse } from 'next/server';
import { getMoMoService } from '@/lib/payment/momo';
import { confirmReservation, releaseReservation } from '@/lib/stock/reservation';
import { getCollections } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify callback signature
    const momo = getMoMoService();
    const isValid = await momo.verifyCallback(body);

    if (!isValid) {
      console.error('Invalid MoMo callback signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { orderId, resultCode, amount } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const { orders } = await getCollections();
    const order = await orders.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // resultCode: 0 = success, others = failed
    if (resultCode === 0) {
      // Payment successful
      await orders.updateOne(
        { orderId },
        {
          $set: {
            'paymentDetails.status': 'completed',
            'paymentDetails.paidAt': new Date(),
            'paymentDetails.transactionId': body.transactionId || body.requestId,
            orderStatus: 'confirmed',
            updatedAt: new Date(),
          },
        }
      );

      // Confirm stock reservation (subtract stock)
      await confirmReservation(orderId);
    } else {
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

    // Return success to MoMo
    return NextResponse.json({
      resultCode: 0,
      message: 'Success',
    });
  } catch (error) {
    console.error('MoMo callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



