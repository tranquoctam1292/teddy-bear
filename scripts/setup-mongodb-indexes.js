/**
 * MongoDB Indexes Setup Script
 * 
 * IMPORTANT: Run this script ONCE after deploying to production
 * to create necessary indexes for optimal performance.
 * 
 * Usage:
 *   node scripts/setup-mongodb-indexes.js
 * 
 * Or in MongoDB Compass/Shell, copy-paste the commands from this file.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function setupIndexes() {
  console.log('🔧 Setting up MongoDB indexes...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    
    // ========================================
    // 1. AI Usage Logs Collection
    // ========================================
    console.log('📋 Setting up aiUsageLogs indexes...');
    const aiUsageLogs = db.collection('aiUsageLogs');
    
    // Index for querying by user and action (rate limiting)
    await aiUsageLogs.createIndex(
      { userId: 1, action: 1, timestamp: -1 },
      { name: 'userId_action_timestamp', background: true }
    );
    console.log('  ✓ Created index: userId_action_timestamp');
    
    // Index for IP-based rate limiting
    await aiUsageLogs.createIndex(
      { ip: 1, timestamp: -1 },
      { name: 'ip_timestamp', background: true }
    );
    console.log('  ✓ Created index: ip_timestamp');
    
    // TTL index - auto-delete documents after 90 days
    await aiUsageLogs.createIndex(
      { timestamp: 1 },
      { 
        name: 'timestamp_ttl',
        expireAfterSeconds: 7776000, // 90 days
        background: true 
      }
    );
    console.log('  ✓ Created TTL index: timestamp_ttl (90 days)\n');
    
    // ========================================
    // 2. Error Logs Collection
    // ========================================
    console.log('📋 Setting up errorLogs indexes...');
    const errorLogs = db.collection('errorLogs');
    
    // Index for querying by type and timestamp
    await errorLogs.createIndex(
      { type: 1, timestamp: -1 },
      { name: 'type_timestamp', background: true }
    );
    console.log('  ✓ Created index: type_timestamp');
    
    // Index for URL lookups (404 errors)
    await errorLogs.createIndex(
      { url: 1, timestamp: -1 },
      { name: 'url_timestamp', background: true }
    );
    console.log('  ✓ Created index: url_timestamp');
    
    // TTL index for automatic cleanup
    await errorLogs.createIndex(
      { timestamp: 1 },
      { 
        name: 'errorlogs_timestamp_ttl',
        expireAfterSeconds: 7776000, // 90 days
        background: true 
      }
    );
    console.log('  ✓ Created TTL index: errorlogs_timestamp_ttl (90 days)\n');
    
    // ========================================
    // 3. SEO Keywords Collection
    // ========================================
    console.log('📋 Setting up seoKeywords indexes...');
    const seoKeywords = db.collection('seoKeywords');
    
    // Index for keyword lookups
    await seoKeywords.createIndex(
      { keyword: 1 },
      { name: 'keyword_unique', unique: true, background: true }
    );
    console.log('  ✓ Created index: keyword_unique');
    
    // Index for queries by position
    await seoKeywords.createIndex(
      { position: 1, updatedAt: -1 },
      { name: 'position_updatedAt', background: true }
    );
    console.log('  ✓ Created index: position_updatedAt\n');
    
    // ========================================
    // 4. SEO Analysis Collection
    // ========================================
    console.log('📋 Setting up seoAnalysis indexes...');
    const seoAnalysis = db.collection('seoAnalysis');
    
    // Compound index for entity lookups
    await seoAnalysis.createIndex(
      { entityType: 1, entityId: 1 },
      { name: 'entity_type_id', unique: true, background: true }
    );
    console.log('  ✓ Created index: entity_type_id');
    
    // Index for score-based queries
    await seoAnalysis.createIndex(
      { overallScore: 1, analyzedAt: -1 },
      { name: 'score_analyzedAt', background: true }
    );
    console.log('  ✓ Created index: score_analyzedAt\n');
    
    // ========================================
    // Verification
    // ========================================
    console.log('🔍 Verifying indexes...\n');
    
    const collections = [
      { name: 'aiUsageLogs', collection: aiUsageLogs },
      { name: 'errorLogs', collection: errorLogs },
      { name: 'seoKeywords', collection: seoKeywords },
      { name: 'seoAnalysis', collection: seoAnalysis },
    ];
    
    for (const { name, collection } of collections) {
      const indexes = await collection.indexes();
      console.log(`📊 ${name}:`);
      indexes.forEach(idx => {
        const ttl = idx.expireAfterSeconds ? ` (TTL: ${idx.expireAfterSeconds}s)` : '';
        console.log(`  - ${idx.name}${ttl}`);
      });
      console.log('');
    }
    
    console.log('✅ All indexes created successfully!\n');
    console.log('💡 Tip: Indexes are created with background: true, so they won\'t block your database.');
    console.log('💡 TTL indexes will automatically delete old documents to save space.\n');
    
  } catch (error) {
    console.error('❌ Error setting up indexes:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
setupIndexes()
  .then(() => {
    console.log('\n🎉 Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error);
    process.exit(1);
  });

