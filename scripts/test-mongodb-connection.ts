/**
 * Test MongoDB Connection Directly
 * 
 * Run: npx tsx scripts/test-mongodb-connection.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { MongoClient } from 'mongodb';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log('─'.repeat(60));

  // Check MONGODB_URI
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    console.log('\n💡 Solution:');
    console.log('   1. Open .env.local file');
    console.log('   2. Add: MONGODB_URI=mongodb://localhost:27017/teddy-shop');
    console.log('   3. Or use MongoDB Atlas: MONGODB_URI=mongodb+srv://...');
    process.exit(1);
  }

  console.log('✅ MONGODB_URI found');
  console.log(`   URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials
  console.log('');

  // Test connection
  let client: MongoClient | null = null;
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    client = new MongoClient(uri);
    
    // Set timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });

    await Promise.race([
      client.connect(),
      timeoutPromise,
    ]);

    console.log('✅ Successfully connected to MongoDB!');
    console.log('');

    // Test database access
    const db = client.db('teddy-shop');
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database Info:');
    console.log(`   Database: teddy-shop`);
    console.log(`   Collections: ${collections.length}`);
    console.log('');

    // Test homepage_configs collection
    const homepageConfigs = db.collection('homepage_configs');
    const count = await homepageConfigs.countDocuments();
    
    console.log('✅ Collection "homepage_configs" accessible');
    console.log(`   Documents: ${count}`);
    console.log('');

    console.log('🎉 MongoDB connection test PASSED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection FAILED!');
    console.error('');
    
    if (error instanceof Error) {
      console.error('Error details:');
      console.error(`   Message: ${error.message}`);
      console.error('');
      
      // Provide specific solutions based on error
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 Solution: MongoDB service is not running');
        console.log('   Windows:');
        console.log('     1. Open Services (services.msc)');
        console.log('     2. Find "MongoDB" service');
        console.log('     3. Right-click → Start');
        console.log('');
        console.log('   Or start MongoDB manually:');
        console.log('     mongod --dbpath "C:\\data\\db"');
        console.log('');
        console.log('   Or use MongoDB Atlas (cloud):');
        console.log('     1. Create account at https://www.mongodb.com/cloud/atlas');
        console.log('     2. Create cluster');
        console.log('     3. Get connection string');
        console.log('     4. Update MONGODB_URI in .env.local');
      } else if (error.message.includes('authentication failed')) {
        console.log('💡 Solution: MongoDB authentication failed');
        console.log('   1. Check username/password in MONGODB_URI');
        console.log('   2. Verify user has access to database');
      } else if (error.message.includes('timeout')) {
        console.log('💡 Solution: Connection timeout');
        console.log('   1. Check MongoDB is running');
        console.log('   2. Check firewall settings');
        console.log('   3. Verify MONGODB_URI is correct');
      } else {
        console.log('💡 General troubleshooting:');
        console.log('   1. Verify MongoDB service is running');
        console.log('   2. Check MONGODB_URI format is correct');
        console.log('   3. Try connecting with MongoDB Compass');
        console.log('   4. Check network/firewall settings');
      }
    } else {
      console.error('   Unknown error:', error);
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testMongoDBConnection();

