// MongoDB Connection Helper
// NOTE: This file should only be imported in Server Components or API routes
// It uses MongoDB native driver which is server-only
import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

/**
 * Check if we're in build phase (Next.js static generation)
 */
function isBuildPhase(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.VERCEL === '1' ||
    process.env.CI === 'true' ||
    process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI
  );
}

/**
 * Get or create MongoDB client promise (lazy initialization)
 */
function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI || '';
  
  // During build phase, return a rejected promise with a clear error
  // This allows pages to handle the error gracefully during static generation
  if (isBuildPhase() && !uri) {
    return Promise.reject(
      new Error(
        'MongoDB connection skipped during build phase. This is expected for static generation.'
      )
    );
  }
  
  if (!uri) {
    throw new Error('MongoDB URI is not configured. Please add MONGODB_URI to your environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

/**
 * Get MongoDB database instance
 */
export async function getDatabase(dbName: string = 'teddy-shop'): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

/**
 * Get MongoDB collections
 * Returns empty collections structure if DB connection fails during build
 */
export async function getCollections() {
  try {
    const db = await getDatabase();
    return {
    db, // Add db instance to the return object
    products: db.collection('products'),
    orders: db.collection('orders'),
    carts: db.collection('carts'),
    users: db.collection('users'),
    contacts: db.collection('contacts'),
    posts: db.collection('posts'),
    navigation: db.collection('navigation'),
    stockReservations: db.collection('stockReservations'),
    // Product Settings collections
    productCategories: db.collection('productCategories'),
    productTags: db.collection('productTags'),
    productAttributes: db.collection('productAttributes'),
    // Order Settings collections
    orderStatuses: db.collection('orderStatuses'),
    orderNotifications: db.collection('orderNotifications'),
    paymentMethods: db.collection('paymentMethods'),
    // Notification Settings collections
    emailTemplates: db.collection('emailTemplates'),
    smtpConfig: db.collection('smtpConfig'),
    systemNotifications: db.collection('systemNotifications'),
    // Security Settings collections
    adminUsers: db.collection('adminUsers'),
    securityConfig: db.collection('securityConfig'),
    userActivityLogs: db.collection('userActivityLogs'),
    apiKeys: db.collection('apiKeys'),
    // Appearance Settings collections
    appearanceConfig: db.collection('appearanceConfig'),
    // SEO Management Center collections
    seoAnalysis: db.collection('seoAnalysis'),
    keywordTracking: db.collection('keywordTracking'),
    seoKeywords: db.collection('seoKeywords'),
    seoSettings: db.collection('seoSettings'),
    redirectRules: db.collection('redirectRules'),
    error404Log: db.collection('error404Log'),
    errorLogs: db.collection('errorLogs'),
    scheduledReports: db.collection('scheduledReports'),
    // Competitor Analysis collections
    competitors: db.collection('competitors'),
    competitorKeywords: db.collection('competitorKeywords'),
    competitorContent: db.collection('competitorContent'),
    // Backlink Monitoring collections
    backlinks: db.collection('backlinks'),
    // A/B Testing collections
    abTests: db.collection('abTests'),
    // Media Management collections
    media: db.collection('media'),
    // Pages Management collections
    pages: db.collection('pages'),
    // Comments System collections
    comments: db.collection('comments'),
    // Payments & Transactions collections
    transactions: db.collection('transactions'),
    paymentGateways: db.collection('paymentGateways'),
    // Marketing collections
    coupons: db.collection('coupons'),
    couponUsage: db.collection('couponUsage'),
    emailCampaigns: db.collection('emailCampaigns'),
    campaigns: db.collection('campaigns'),
    promotions: db.collection('promotions'),
    // Author Management collections (E-E-A-T SEO)
    authors: db.collection('authors'),
    // Homepage Configuration collections
    homepage_configs: db.collection('homepage_configs'),
    // AI Usage Tracking collections
    aiUsageLogs: db.collection('aiUsageLogs'),
    };
  } catch (error) {
    // During build phase, MongoDB may not be available
    // Return a mock structure that allows components to handle gracefully
    if (isBuildPhase()) {
      console.warn('MongoDB not available during build phase. Returning empty collections structure.');
      // Return empty collections structure to prevent build failures
      // Components should handle empty results gracefully
      return {
        db: null as any,
        products: null as any,
        orders: null as any,
        carts: null as any,
        users: null as any,
        contacts: null as any,
        posts: null as any,
        navigation: null as any,
        stockReservations: null as any,
        productCategories: null as any,
        productTags: null as any,
        productAttributes: null as any,
        orderStatuses: null as any,
        orderNotifications: null as any,
        paymentMethods: null as any,
        emailTemplates: null as any,
        smtpConfig: null as any,
        systemNotifications: null as any,
        adminUsers: null as any,
        securityConfig: null as any,
        userActivityLogs: null as any,
        apiKeys: null as any,
        appearanceConfig: null as any,
        seoAnalysis: null as any,
        keywordTracking: null as any,
        seoKeywords: null as any,
        seoSettings: null as any,
        redirectRules: null as any,
        error404Log: null as any,
        errorLogs: null as any,
        scheduledReports: null as any,
        competitors: null as any,
        competitorKeywords: null as any,
        competitorContent: null as any,
        backlinks: null as any,
        abTests: null as any,
        media: null as any,
        pages: null as any,
        comments: null as any,
        transactions: null as any,
        paymentGateways: null as any,
        coupons: null as any,
        couponUsage: null as any,
        emailCampaigns: null as any,
        campaigns: null as any,
        promotions: null as any,
        authors: null as any,
        homepage_configs: null as any,
        aiUsageLogs: null as any,
      };
    }
    // In runtime, re-throw the error
    throw error;
  }
}

/**
 * Connect to MongoDB (for initialization)
 */
export async function connectDB(): Promise<void> {
  try {
    await getClientPromise();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Export the client promise getter for use in API routes
export default getClientPromise;
