import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/admin/payments/[id] - Get transaction details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { transactions, orders } = await getCollections();
    const transaction = await transactions.findOne({
      _id: new ObjectId(params.id),
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Enrich with order info
    const enriched: any = {
      ...transaction,
      _id: transaction._id?.toString(),
    };

    if (transaction.orderId) {
      const order = await orders.findOne({
        _id: new ObjectId(transaction.orderId),
      });
      if (order) {
        enriched.order = {
          ...order,
          _id: order._id?.toString(),
        };
      }
    }

    return NextResponse.json({
      success: true,
      transaction: enriched,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}



