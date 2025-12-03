/**
 * MongoDB Indexes Verification Script
 * 
 * Run this to check if all required indexes are present
 * 
 * Usage:
 *   node scripts/verify-mongodb-indexes.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const REQUIRED_INDEXES = {
  aiUsageLogs: [
    'userId_action_timestamp',
    'ip_timestamp',
    'timestamp_ttl'
  ],
  errorLogs: [
    'type_timestamp',
    'url_timestamp',
    'errorlogs_timestamp_ttl'
  ],
  seoKeywords: [
    'keyword_unique',
    'position_updatedAt'
  ],
  seoAnalysis: [
    'entity_type_id',
    'score_analyzedAt'
  ]
};

async function verifyIndexes() {
  console.log('🔍 Verifying MongoDB indexes...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    let allGood = true;
    
    for (const [collectionName, requiredIndexes] of Object.entries(REQUIRED_INDEXES)) {
      console.log(`📋 Checking ${collectionName}...`);
      
      const collection = db.collection(collectionName);
      const existingIndexes = await collection.indexes();
      const existingIndexNames = existingIndexes.map(idx => idx.name);
      
      for (const requiredIndex of requiredIndexes) {
        if (existingIndexNames.includes(requiredIndex)) {
          console.log(`  ✅ ${requiredIndex}`);
        } else {
          console.log(`  ❌ ${requiredIndex} - MISSING!`);
          allGood = false;
        }
      }
      console.log('');
    }
    
    if (allGood) {
      console.log('🎉 All required indexes are present!\n');
    } else {
      console.log('⚠️  Some indexes are missing!');
      console.log('💡 Run: node scripts/setup-mongodb-indexes.js\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

verifyIndexes();

