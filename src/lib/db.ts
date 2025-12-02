// MongoDB Connection Helper
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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

/**
 * Get MongoDB database instance
 */
export async function getDatabase(dbName: string = 'teddy-shop'): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Get MongoDB collections
 */
export async function getCollections() {
  const db = await getDatabase();
  return {
    products: db.collection('products'),
    orders: db.collection('orders'),
    carts: db.collection('carts'),
    users: db.collection('users'),
  };
}

/**
 * Connect to MongoDB (for initialization)
 */
export async function connectDB(): Promise<void> {
  try {
    await clientPromise;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Export the client promise for use in API routes
export default clientPromise;
