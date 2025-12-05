#!/usr/bin/env tsx
/**
 * Verify MongoDB Indexes for Blog Posts Collection
 * Run: npm run verify:blog-indexes
 * 
 * This script verifies that all required indexes for blog posts
 * have been created successfully.
 * 
 * Based on Blog Upgrade Plan Phase 1 - Index Creation
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';

/**
 * Required indexes for Posts Collection
 * Based on create-blog-indexes.ts
 */
const REQUIRED_INDEXES = [
  // Single field indexes
  { name: 'idx_posts_slug_unique', key: { slug: 1 }, unique: true },
  { name: 'idx_posts_template', key: { template: 1 } },
  { name: 'idx_posts_category', key: { category: 1 }, sparse: true },
  { name: 'idx_posts_status', key: { status: 1 } },
  { name: 'idx_posts_tags', key: { tags: 1 } },
  { name: 'idx_posts_created', key: { createdAt: -1 } },
  { name: 'idx_posts_reading_time', key: { readingTime: 1 }, sparse: true },

  // Compound indexes
  { name: 'idx_posts_status_template', key: { status: 1, template: 1 } },
  { name: 'idx_posts_status_category', key: { status: 1, category: 1 }, sparse: true },
  { name: 'idx_posts_status_published', key: { status: 1, publishedAt: -1 } },

  // Text index (special handling)
  { name: 'idx_posts_text_search', key: 'text', isText: true },
];

/**
 * Check if two index keys match
 */
function indexKeysMatch(
  indexKey: Record<string, number | string> | string,
  requiredKey: Record<string, number | string> | string
): boolean {
  if (typeof indexKey === 'string' && typeof requiredKey === 'string') {
    return indexKey === requiredKey;
  }

  if (typeof indexKey === 'string' || typeof requiredKey === 'string') {
    return false;
  }

  const indexKeys = Object.keys(indexKey).sort();
  const requiredKeys = Object.keys(requiredKey).sort();

  if (indexKeys.length !== requiredKeys.length) {
    return false;
  }

  for (const key of indexKeys) {
    if (indexKey[key] !== requiredKey[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Main verification function
 */
async function verifyBlogIndexes() {
  console.log('🔍 Kiểm tra MongoDB Indexes cho Blog Posts Collection...\n');

  try {
    const { posts } = await getCollections();

    // Get all existing indexes
    const existingIndexes = await posts.indexes();

    console.log(`📊 Tìm thấy ${existingIndexes.length} indexes hiện có\n`);
    console.log('='.repeat(80));
    console.log('📋 CHI TIẾT KIỂM TRA INDEXES\n');

    let allGood = true;
    const missingIndexes: Array<{ name: string; key: Record<string, number> | string }> = [];
    const foundIndexes: string[] = [];

    // Check each required index
    for (const requiredIndex of REQUIRED_INDEXES) {
      // Special handling for text index
      if (requiredIndex.isText) {
        const textIndex = existingIndexes.find(
          (idx) =>
            idx.name === requiredIndex.name ||
            (typeof idx.key === 'object' && '_fts' in idx.key && 'text' in idx.key)
        );

        if (textIndex) {
          console.log(`✅ Index "${requiredIndex.name}" tồn tại`);
          console.log(`   Key: ${JSON.stringify(textIndex.key)}`);
          if (textIndex.weights) {
            console.log(`   Weights: ${JSON.stringify(textIndex.weights)}`);
          }
          foundIndexes.push(requiredIndex.name);
        } else {
          console.log(`❌ Index "${requiredIndex.name}" THIẾU`);
          console.log(`   Key mong đợi: text index (title, content, excerpt, keywords)`);
          missingIndexes.push(requiredIndex);
          allGood = false;
        }
      } else {
        // Regular index check
        const foundIndex = existingIndexes.find(
          (idx) =>
            idx.name === requiredIndex.name ||
            indexKeysMatch(idx.key as Record<string, number>, requiredIndex.key as Record<string, number>)
        );

        if (foundIndex) {
          // Verify uniqueness if required
          if (requiredIndex.unique && !foundIndex.unique) {
            console.log(`⚠️  Index "${requiredIndex.name}" tồn tại nhưng THIẾU unique constraint`);
            allGood = false;
          } else {
            console.log(`✅ Index "${requiredIndex.name}" tồn tại`);
            console.log(`   Key: ${JSON.stringify(foundIndex.key)}`);
            if (foundIndex.unique) {
              console.log(`   Unique: true`);
            }
            if (foundIndex.sparse) {
              console.log(`   Sparse: true`);
            }
            foundIndexes.push(requiredIndex.name);
          }
        } else {
          console.log(`❌ Index "${requiredIndex.name}" THIẾU`);
          console.log(`   Key mong đợi: ${JSON.stringify(requiredIndex.key)}`);
          if (requiredIndex.unique) {
            console.log(`   Unique: true`);
          }
          if (requiredIndex.sparse) {
            console.log(`   Sparse: true`);
          }
          missingIndexes.push(requiredIndex);
          allGood = false;
        }
      }
      console.log('');
    }

    // ========================================
    // SUMMARY
    // ========================================

    console.log('='.repeat(80));
    console.log('📊 TÓM TẮT KIỂM TRA\n');

    console.log(`✅ Indexes đã có: ${foundIndexes.length}/${REQUIRED_INDEXES.length}`);
    console.log(`❌ Indexes thiếu: ${missingIndexes.length}/${REQUIRED_INDEXES.length}\n`);

    if (foundIndexes.length > 0) {
      console.log('✅ Indexes đã tạo:');
      foundIndexes.forEach((name) => {
        console.log(`   • ${name}`);
      });
      console.log('');
    }

    if (missingIndexes.length > 0) {
      console.log('❌ Indexes cần tạo:');
      missingIndexes.forEach((idx) => {
        console.log(`   • ${idx.name}`);
        console.log(`     Key: ${JSON.stringify(idx.key)}`);
      });
      console.log('');
    }

    // ========================================
    // ADDITIONAL INDEXES (Optional)
    // ========================================

    const additionalIndexes = existingIndexes.filter(
      (idx) => !foundIndexes.includes(idx.name || '') && idx.name !== '_id_'
    );

    if (additionalIndexes.length > 0) {
      console.log('📌 Indexes bổ sung (không bắt buộc):');
      additionalIndexes.forEach((idx) => {
        console.log(`   • ${idx.name || 'unnamed'}: ${JSON.stringify(idx.key)}`);
      });
      console.log('');
    }

    // ========================================
    // RECOMMENDATIONS
    // ========================================

    if (allGood) {
      console.log('🎉 Tất cả indexes bắt buộc đã được tạo thành công!\n');
      console.log('💡 Tips:');
      console.log('   • Indexes sẽ tự động được sử dụng khi query');
      console.log('   • Performance sẽ được cải thiện đáng kể với indexes này');
      console.log('   • Chạy lại script này sau khi thêm indexes mới\n');
    } else {
      console.log('⚠️  Một số indexes bắt buộc chưa được tạo!\n');
      console.log('💡 Để tạo indexes thiếu, chạy:');
      console.log('   npm run blog:indexes\n');
      console.log('   hoặc:');
      console.log('   tsx scripts/create-blog-indexes.ts\n');
    }

    // ========================================
    // PERFORMANCE CHECK
    // ========================================

    console.log('⚡ Kiểm tra performance...\n');

    // Test query với index
    if (foundIndexes.includes('idx_posts_status')) {
      console.time('  Query với index (status)');
      await posts.find({ status: 'published' }).limit(1).toArray();
      console.timeEnd('  Query với index (status)');
    }

    if (foundIndexes.includes('idx_posts_template')) {
      console.time('  Query với index (template)');
      await posts.find({ template: 'review' }).limit(1).toArray();
      console.timeEnd('  Query với index (template)');
    }

    if (foundIndexes.includes('idx_posts_text_search')) {
      console.time('  Query với text index');
      await posts.find({ $text: { $search: 'gấu bông' } }).limit(1).toArray();
      console.timeEnd('  Query với text index');
    }

    console.log('');

    // Exit with appropriate code
    process.exit(allGood ? 0 : 1);
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra indexes:', error);
    process.exit(1);
  }
}

// Run the script
verifyBlogIndexes().catch(console.error);
