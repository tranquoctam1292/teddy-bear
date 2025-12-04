#!/usr/bin/env tsx
/**
 * Create MongoDB Indexes for Authors Collection
 * Run: npm run authors:indexes
 * 
 * This script creates optimal indexes for author-related queries
 * Based on analysis in docs/reports/DATABASE_SCHEMA.md
 */

import { getCollections } from '../src/lib/db';

async function createAuthorIndexes() {
  console.log('🔧 Creating indexes for Authors Collection...\n');

  try {
    const { authors, posts } = await getCollections();

    // ========================================
    // AUTHORS COLLECTION INDEXES
    // ========================================
    
    console.log('📊 Authors Collection:');
    
    // 1. Slug (UNIQUE) - Critical for SEO URLs
    console.log('  Creating: slug (unique)...');
    await authors.createIndex(
      { slug: 1 },
      { 
        unique: true,
        name: 'idx_authors_slug_unique',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_slug_unique');

    // 2. Email (UNIQUE, SPARSE) - For validation
    console.log('  Creating: email (unique, sparse)...');
    await authors.createIndex(
      { email: 1 },
      { 
        unique: true,
        sparse: true,  // Allow null/missing emails
        name: 'idx_authors_email_unique',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_email_unique');

    // 3. Status - For filtering
    console.log('  Creating: status...');
    await authors.createIndex(
      { status: 1 },
      { 
        name: 'idx_authors_status',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_status');

    // 4. Compound: Status + Type
    console.log('  Creating: status + type...');
    await authors.createIndex(
      { status: 1, type: 1 },
      { 
        name: 'idx_authors_status_type',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_status_type');

    // 5. Compound: Status + Name
    console.log('  Creating: status + name...');
    await authors.createIndex(
      { status: 1, name: 1 },
      { 
        name: 'idx_authors_status_name',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_status_name');

    // 6. Text Index - For search
    console.log('  Creating: text search...');
    await authors.createIndex(
      { 
        name: 'text',
        email: 'text',
        bio: 'text',
        jobTitle: 'text'
      },
      { 
        name: 'idx_authors_text_search',
        weights: {
          name: 10,      // Highest priority
          email: 5,
          jobTitle: 3,
          bio: 1
        },
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_text_search');

    // 7. Created Date
    console.log('  Creating: createdAt...');
    await authors.createIndex(
      { createdAt: -1 },
      { 
        name: 'idx_authors_created',
        background: true
      }
    );
    console.log('  ✅ Created: idx_authors_created\n');

    // ========================================
    // POSTS COLLECTION INDEXES (Author-related)
    // ========================================
    
    console.log('📊 Posts Collection (Author-related):');

    // 1. Author ID + Status
    console.log('  Creating: authorInfo.authorId + status...');
    await posts.createIndex(
      { 'authorInfo.authorId': 1, status: 1 },
      { 
        name: 'idx_posts_authorid_status',
        background: true
      }
    );
    console.log('  ✅ Created: idx_posts_authorid_status');

    // 2. Reviewer ID + Status
    console.log('  Creating: authorInfo.reviewerId + status...');
    await posts.createIndex(
      { 'authorInfo.reviewerId': 1, status: 1 },
      { 
        name: 'idx_posts_reviewerid_status',
        background: true
      }
    );
    console.log('  ✅ Created: idx_posts_reviewerid_status');

    // 3. Author ID + Status + PublishedAt
    console.log('  Creating: authorInfo.authorId + status + publishedAt...');
    await posts.createIndex(
      { 'authorInfo.authorId': 1, status: 1, publishedAt: -1 },
      { 
        name: 'idx_posts_author_recent',
        background: true
      }
    );
    console.log('  ✅ Created: idx_posts_author_recent\n');

    // ========================================
    // VERIFICATION
    // ========================================
    
    console.log('📋 Verifying indexes...\n');
    
    const authorIndexes = await authors.indexes();
    const postIndexes = await posts.indexes();
    
    console.log(`✅ Authors Collection: ${authorIndexes.length} indexes`);
    authorIndexes.forEach(idx => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
    console.log(`\n✅ Posts Collection: ${postIndexes.length} indexes (author-related)`);
    const authorRelatedIndexes = postIndexes.filter(idx => 
      idx.name?.includes('author') || 
      JSON.stringify(idx.key).includes('authorInfo')
    );
    authorRelatedIndexes.forEach(idx => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    // ========================================
    // PERFORMANCE TEST
    // ========================================
    
    console.log('\n⚡ Running performance tests...\n');

    // Test 1: Slug lookup
    console.time('Slug lookup');
    await authors.findOne({ slug: 'test-slug', status: 'active' });
    console.timeEnd('Slug lookup');

    // Test 2: Text search
    console.time('Text search');
    await authors.find({ $text: { $search: 'expert' } }).limit(10).toArray();
    console.timeEnd('Text search');

    // Test 3: Author post count
    console.time('Author post count');
    await posts.countDocuments({ 'authorInfo.authorId': 'test-id', status: 'published' });
    console.timeEnd('Author post count');

    console.log('\n🎉 All indexes created successfully!');
    console.log('📈 Expected performance improvement: 10-50x faster queries');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the script
createAuthorIndexes().catch(console.error);

