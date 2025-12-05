import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// POST /api/admin/payments/[id]/refund - Refund a transaction
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || !reason) {
      return NextResponse.json(
        { success: false, error: 'Amount and reason are required' },
        { status: 400 }
      );
    }

    const { transactions } = await getCollections();

    // Get transaction
    const transaction = await transactions.findOne({
      _id: new ObjectId(params.id),
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Can only refund completed transactions' },
        { status: 400 }
      );
    }

    if (amount > transaction.amount) {
      return NextResponse.json(
        { success: false, error: 'Refund amount exceeds transaction amount' },
        { status: 400 }
      );
    }

    // Update transaction
    const result = await transactions.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: 'refunded',
          refundAmount: amount,
          refundReason: reason,
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // TODO: Call payment gateway API to process actual refund
    // This would depend on the payment method (VNPay, MoMo, etc.)

    const updatedTransaction = await transactions.findOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      transaction: {
        ...updatedTransaction,
        _id: updatedTransaction?._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error refunding transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}




