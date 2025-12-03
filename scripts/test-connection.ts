/**
 * Test MongoDB Connection
 * 
 * Run: npx tsx scripts/test-connection.ts
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

// Now import MongoDB after env is loaded
import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = process.env.MONGODB_URI || '';
  
  console.log('🔄 Testing MongoDB connection...');
  console.log(`📝 Connection URI: ${uri || 'Not set'}`);
  console.log('');

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables!');
    console.error('   Make sure .env.local exists and contains MONGODB_URI');
    process.exit(1);
  }

  let client: MongoClient | null = null;

  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    // Test database access
    const db = client.db('teddy-shop');
    const collections = await db.listCollections().toArray();
    
    console.log('');
    console.log('✅ MongoDB connection successful!');
    console.log('');
    console.log(`📊 Database: teddy-shop`);
    console.log(`📁 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log(`   - ${collections.map(c => c.name).join(', ')}`);
    }
    console.log('');
    console.log('📊 Next steps:');
    console.log('   1. Open MongoDB Compass and connect to: mongodb://localhost:27017/teddy-shop');
    console.log('   2. Run migration: npx tsx scripts/migrate-mock-data.ts');
    console.log('   3. Start dev server: npm run dev');
    
    await client.close();
    process.exit(0);
  } catch (error: any) {
    console.error('');
    console.error('❌ MongoDB connection failed!');
    console.error('');
    console.error('Error details:');
    console.error(error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check if MongoDB service is running');
    console.error('   2. Verify MONGODB_URI in .env.local');
    console.error('   3. Check MongoDB is listening on port 27017');
    console.error('   4. Try: Get-Service -Name MongoDB (to check service status)');
    
    if (client) {
      await client.close().catch(() => {});
    }
    process.exit(1);
  }
}

testConnection();

