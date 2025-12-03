import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// GET /api/admin/analytics - Get analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const { orders, products } = await getCollections();

    // Build date filter
    const dateFilter: any = {};
    if (dateFrom) dateFilter.$gte = new Date(dateFrom);
    if (dateTo) dateFilter.$lte = new Date(dateTo);

    const query: any = dateFilter.$gte || dateFilter.$lte ? { createdAt: dateFilter } : {};

    // Get all orders in range
    const allOrders = await orders.find(query).toArray();

    // Calculate sales stats
    const completedOrders = allOrders.filter((o: any) => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = completedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Previous period comparison (simple version)
    const previousRevenue = totalRevenue * 0.85; // Mock: assume 15% growth
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const salesStats = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate: 3.2, // Mock: would need visitor tracking
      revenueChange,
      ordersChange: 12.5, // Mock
    };

    // Revenue data by day (last 30 days)
    const revenueData = generateRevenueData(completedOrders);

    // Top products
    const topProducts = await getTopProducts(completedOrders, products);

    // Traffic sources (mock data - would need analytics integration)
    const trafficSources = [
      { source: 'Direct', visitors: 1250, percentage: 35 },
      { source: 'Google', visitors: 980, percentage: 28 },
      { source: 'Facebook', visitors: 720, percentage: 20 },
      { source: 'Instagram', visitors: 450, percentage: 13 },
      { source: 'Others', visitors: 142, percentage: 4 },
    ];

    // Customer metrics
    const uniqueCustomers = new Set(completedOrders.map((o: any) => o.customerInfo?.email)).size;
    const customerMetrics = {
      newCustomers: Math.floor(uniqueCustomers * 0.6), // Mock: 60% new
      returningCustomers: Math.floor(uniqueCustomers * 0.4), // Mock: 40% returning
      averageLifetimeValue: totalRevenue / (uniqueCustomers || 1),
      retentionRate: 42.5, // Mock
    };

    return NextResponse.json({
      success: true,
      data: {
        salesStats,
        revenueData,
        topProducts,
        trafficSources,
        customerMetrics,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper: Generate revenue data by day
function generateRevenueData(orders: any[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return last30Days.map((date) => {
    const dayOrders = orders.filter((o: any) => {
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });

    return {
      date,
      revenue: dayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
      orders: dayOrders.length,
    };
  });
}

// Helper: Get top selling products
async function getTopProducts(orders: any[], productsCollection: any) {
  const productSales = new Map<string, { count: number; revenue: number }>();

  orders.forEach((order: any) => {
    order.items?.forEach((item: any) => {
      const current = productSales.get(item.productId) || { count: 0, revenue: 0 };
      productSales.set(item.productId, {
        count: current.count + item.quantity,
        revenue: current.revenue + item.price * item.quantity,
      });
    });
  });

  // Get product details
  const topProducts = [];
  for (const [productId, stats] of productSales.entries()) {
    try {
      const { ObjectId } = await import('mongodb');
      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
      if (product) {
        topProducts.push({
          _id: product._id.toString(),
          name: product.name,
          image: product.images?.[0] || '',
          salesCount: stats.count,
          revenue: stats.revenue,
        });
      }
    } catch (error) {
      // Skip invalid product IDs
    }
  }

  // Sort and return top 10
  return topProducts
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

