// MongoDB Connection Helper
import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

/**
 * Get or create MongoDB client promise (lazy initialization)
 */
function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI || '';
  
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
 */
export async function getCollections() {
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
