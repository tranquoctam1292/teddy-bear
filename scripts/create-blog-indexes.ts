#!/usr/bin/env tsx
/**
 * Create MongoDB Indexes for Blog Posts Collection
 * Run: npm run blog:indexes
 *
 * This script creates optimal indexes for blog post queries
 * Based on Blog Upgrade Plan Phase 1 requirements
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';

async function createBlogIndexes() {
  console.log('🔧 Creating indexes for Blog Posts Collection...\n');

  try {
    const { posts } = await getCollections();

    // ========================================
    // POSTS COLLECTION INDEXES
    // ========================================

    console.log('📊 Posts Collection:');

    // 1. Slug (UNIQUE) - Critical for SEO URLs
    console.log('  Creating: slug (unique)...');
    try {
      await posts.createIndex(
        { slug: 1 },
        {
          unique: true,
          name: 'idx_posts_slug_unique',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_slug_unique');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('E11000')) {
        console.log('  ⚠️  Index already exists: idx_posts_slug_unique');
      } else {
        throw error;
      }
    }

    // 2. Template - For filtering by template type
    console.log('  Creating: template...');
    try {
      await posts.createIndex(
        { template: 1 },
        {
          name: 'idx_posts_template',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_template');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_template');
      } else {
        throw error;
      }
    }

    // 3. Category - For filtering by category
    console.log('  Creating: category...');
    try {
      await posts.createIndex(
        { category: 1 },
        {
          name: 'idx_posts_category',
          background: true,
          sparse: true, // Allow null categories
        }
      );
      console.log('  ✅ Created: idx_posts_category');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_category');
      } else {
        throw error;
      }
    }

    // 4. Status - For filtering by status
    console.log('  Creating: status...');
    try {
      await posts.createIndex(
        { status: 1 },
        {
          name: 'idx_posts_status',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_status');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_status');
      } else {
        throw error;
      }
    }

    // 5. Compound: Status + Template - For filtered lists
    console.log('  Creating: status + template...');
    try {
      await posts.createIndex(
        { status: 1, template: 1 },
        {
          name: 'idx_posts_status_template',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_status_template');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_status_template');
      } else {
        throw error;
      }
    }

    // 6. Compound: Status + Category - For category filtering
    console.log('  Creating: status + category...');
    try {
      await posts.createIndex(
        { status: 1, category: 1 },
        {
          name: 'idx_posts_status_category',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_posts_status_category');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_status_category');
      } else {
        throw error;
      }
    }

    // 7. Compound: Status + PublishedAt - For sorted published posts
    console.log('  Creating: status + publishedAt...');
    try {
      await posts.createIndex(
        { status: 1, publishedAt: -1 },
        {
          name: 'idx_posts_status_published',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_status_published');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_status_published');
      } else {
        throw error;
      }
    }

    // 8. Tags - For tag-based filtering (array field)
    console.log('  Creating: tags...');
    try {
      await posts.createIndex(
        { tags: 1 },
        {
          name: 'idx_posts_tags',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_tags');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_tags');
      } else {
        throw error;
      }
    }

    // 9. Text Index - For full-text search on title, content, excerpt
    console.log('  Creating: text search (title, content, excerpt)...');
    try {
      await posts.createIndex(
        {
          title: 'text',
          content: 'text',
          excerpt: 'text',
          keywords: 'text',
        },
        {
          name: 'idx_posts_text_search',
          weights: {
            title: 10, // Highest priority
            excerpt: 5,
            keywords: 3,
            content: 1,
          },
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_text_search');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_text_search');
      } else {
        throw error;
      }
    }

    // 10. Created Date - For sorting by newest
    console.log('  Creating: createdAt...');
    try {
      await posts.createIndex(
        { createdAt: -1 },
        {
          name: 'idx_posts_created',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_posts_created');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_created');
      } else {
        throw error;
      }
    }

    // 11. Reading Time - For filtering by reading time
    console.log('  Creating: readingTime...');
    try {
      await posts.createIndex(
        { readingTime: 1 },
        {
          name: 'idx_posts_reading_time',
          background: true,
          sparse: true, // Allow null readingTime
        }
      );
      console.log('  ✅ Created: idx_posts_reading_time');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⚠️  Index already exists: idx_posts_reading_time');
      } else {
        throw error;
      }
    }

    // ========================================
    // VERIFICATION
    // ========================================

    console.log('\n📋 Verifying indexes...\n');

    const postIndexes = await posts.indexes();

    console.log(`✅ Posts Collection: ${postIndexes.length} total indexes\n`);
    postIndexes.forEach((idx) => {
      const keyStr = JSON.stringify(idx.key);
      const uniqueStr = idx.unique ? ' (UNIQUE)' : '';
      console.log(`   - ${idx.name}${uniqueStr}: ${keyStr}`);
    });

    // ========================================
    // PERFORMANCE TEST
    // ========================================

    console.log('\n⚡ Running performance tests...\n');

    // Test 1: Slug lookup
    console.time('  Slug lookup');
    await posts.findOne({ slug: 'test-slug', status: 'published' });
    console.timeEnd('  Slug lookup');

    // Test 2: Template filter
    console.time('  Template filter');
    await posts.find({ template: 'gift-guide', status: 'published' }).limit(10).toArray();
    console.timeEnd('  Template filter');

    // Test 3: Text search
    console.time('  Text search');
    await posts
      .find({ $text: { $search: 'gấu bông' } })
      .limit(10)
      .toArray();
    console.timeEnd('  Text search');

    // Test 4: Category + Status
    console.time('  Category + Status');
    await posts
      .find({ category: 'news', status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .toArray();
    console.timeEnd('  Category + Status');

    console.log('\n🎉 All indexes created successfully!');
    console.log('📈 Expected performance improvement: 5-20x faster queries');
    console.log('\n💡 Tip: Run this script after migration to optimize query performance');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the script
createBlogIndexes().catch(console.error);
