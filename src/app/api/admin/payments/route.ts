import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { TransactionFilter, TransactionStats } from '@/lib/types/payment';
import { ObjectId } from 'mongodb';

// GET /api/admin/payments - List all transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filter: TransactionFilter = {
      status: (searchParams.get('status') as any) || 'all',
      paymentMethod: searchParams.get('paymentMethod') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      search: searchParams.get('search') || '',
      limit: parseInt(searchParams.get('limit') || '50'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const { transactions, orders } = await getCollections();

    // Build query
    const query: any = {};

    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter.paymentMethod) {
      query.paymentMethod = filter.paymentMethod;
    }

    // Date range filter
    if (filter.dateFrom || filter.dateTo) {
      query.createdAt = {};
      if (filter.dateFrom) {
        query.createdAt.$gte = new Date(filter.dateFrom);
      }
      if (filter.dateTo) {
        query.createdAt.$lte = new Date(filter.dateTo);
      }
    }

    // Get total count
    const total = await transactions.countDocuments(query);

    // Get transactions
    const transactionsList = await transactions
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filter.skip || 0)
      .limit(filter.limit || 50)
      .toArray();

    // Enrich with order info
    const enrichedTransactions = await Promise.all(
      transactionsList.map(async (txn: any) => {
        const enriched: any = {
          ...txn,
          _id: txn._id?.toString(),
        };

        // Get order info
        if (txn.orderId) {
          const order = await orders.findOne({ _id: new ObjectId(txn.orderId) });
          if (order) {
            enriched.order = {
              _id: order._id?.toString(),
              orderNumber: order.orderNumber,
              customerName: order.customerInfo?.name,
              customerEmail: order.customerInfo?.email,
              total: order.total,
            };
          }
        }

        return enriched;
      })
    );

    // Calculate stats
    const allTransactions = await transactions.find({}).toArray();
    const stats: TransactionStats = {
      all: allTransactions.length,
      pending: allTransactions.filter((t: any) => t.status === 'pending').length,
      completed: allTransactions.filter((t: any) => t.status === 'completed')
        .length,
      failed: allTransactions.filter((t: any) => t.status === 'failed').length,
      refunded: allTransactions.filter((t: any) => t.status === 'refunded').length,
      totalRevenue: allTransactions
        .filter((t: any) => t.status === 'completed')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
      totalRefunded: allTransactions
        .filter((t: any) => t.status === 'refunded')
        .reduce((sum: number, t: any) => sum + (t.refundAmount || 0), 0),
    };

    return NextResponse.json({
      success: true,
      transactions: enrichedTransactions,
      total,
      page: Math.floor((filter.skip || 0) / (filter.limit || 50)) + 1,
      totalPages: Math.ceil(total / (filter.limit || 50)),
      stats,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}



