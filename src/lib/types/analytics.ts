// Analytics Types
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface TopProduct {
  _id: string;
  name: string;
  image: string;
  salesCount: number;
  revenue: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface CustomerMetric {
  newCustomers: number;
  returningCustomers: number;
  averageLifetimeValue: number;
  retentionRate: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsDashboard {
  salesStats: SalesStats;
  revenueData: RevenueData[];
  topProducts: TopProduct[];
  trafficSources: TrafficSource[];
  customerMetrics: CustomerMetric;
}

export interface SalesReport {
  productId: string;
  productName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  margin: number;
}



