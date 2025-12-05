#!/usr/bin/env tsx
/**
 * Create MongoDB Indexes for Products Collection
 * 
 * Script này tạo các indexes mới để tối ưu query cho tính năng mới:
 * - Index cho collection (để filter theo bộ sưu tập)
 * - Index cho specialOccasions (để lọc quà tặng theo dịp)
 * - Index cho relatedProducts (để query cross-sell)
 * 
 * Run: npx tsx scripts/create-product-indexes.ts
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';

async function createProductIndexes() {
  console.log('🔧 Tạo indexes cho Products Collection...\n');

  try {
    const { products } = await getCollections();

    // ========================================
    // PRODUCTS COLLECTION INDEXES
    // ========================================

    console.log('📊 Products Collection:\n');

    // 1. Collection Index - Để filter theo bộ sưu tập
    console.log('  Creating: collection...');
    try {
      await products.createIndex(
        { collection: 1 },
        {
          name: 'idx_products_collection',
          background: true,
          sparse: true, // Cho phép null/missing values
        }
      );
      console.log('  ✅ Created: idx_products_collection');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_collection');
      } else {
        throw error;
      }
    }

    // 2. Special Occasions Index - Để lọc quà tặng theo dịp
    console.log('  Creating: specialOccasions...');
    try {
      await products.createIndex(
        { specialOccasions: 1 },
        {
          name: 'idx_products_special_occasions',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_products_special_occasions');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_special_occasions');
      } else {
        throw error;
      }
    }

    // 3. Related Products Index - Để query cross-sell
    console.log('  Creating: relatedProducts...');
    try {
      await products.createIndex(
        { relatedProducts: 1 },
        {
          name: 'idx_products_related',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_products_related');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_related');
      } else {
        throw error;
      }
    }

    // 4. Gift Wrapping Index - Để filter sản phẩm có gói quà
    console.log('  Creating: giftWrapping...');
    try {
      await products.createIndex(
        { giftWrapping: 1 },
        {
          name: 'idx_products_gift_wrapping',
          background: true,
        }
      );
      console.log('  ✅ Created: idx_products_gift_wrapping');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_gift_wrapping');
      } else {
        throw error;
      }
    }

    // 5. Compound Index: Collection + isActive - Để filter collection active
    console.log('  Creating: collection + isActive...');
    try {
      await products.createIndex(
        { collection: 1, isActive: 1 },
        {
          name: 'idx_products_collection_active',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_products_collection_active');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_collection_active');
      } else {
        throw error;
      }
    }

    // 6. Compound Index: Special Occasions + isActive - Để filter quà tặng active
    console.log('  Creating: specialOccasions + isActive...');
    try {
      await products.createIndex(
        { specialOccasions: 1, isActive: 1 },
        {
          name: 'idx_products_occasions_active',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_products_occasions_active');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_occasions_active');
      } else {
        throw error;
      }
    }

    // 7. Compound Index: Category + Collection - Để filter theo category và collection
    console.log('  Creating: category + collection...');
    try {
      await products.createIndex(
        { category: 1, collection: 1 },
        {
          name: 'idx_products_category_collection',
          background: true,
          sparse: true,
        }
      );
      console.log('  ✅ Created: idx_products_category_collection');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('  ⏭️  Index đã tồn tại: idx_products_category_collection');
      } else {
        throw error;
      }
    }

    console.log('');

    // ========================================
    // VERIFICATION
    // ========================================

    console.log('📋 Verifying indexes...\n');

    const productIndexes = await products.indexes();

    console.log(`✅ Products Collection: ${productIndexes.length} indexes tổng cộng\n`);

    // Hiển thị các indexes mới tạo
    const newIndexes = [
      'idx_products_collection',
      'idx_products_special_occasions',
      'idx_products_related',
      'idx_products_gift_wrapping',
      'idx_products_collection_active',
      'idx_products_occasions_active',
      'idx_products_category_collection',
    ];

    console.log('📊 Các indexes mới tạo:');
    productIndexes
      .filter((idx) => newIndexes.includes(idx.name || ''))
      .forEach((idx) => {
        console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
      });

    // ========================================
    // PERFORMANCE TEST
    // ========================================

    console.log('\n⚡ Running performance tests...\n');

    // Test 1: Collection lookup
    console.time('Collection lookup');
    await products.findOne({ collection: 'test-collection', isActive: true });
    console.timeEnd('Collection lookup');

    // Test 2: Special occasions filter
    console.time('Special occasions filter');
    await products.find({ specialOccasions: 'Valentine', isActive: true }).limit(10).toArray();
    console.timeEnd('Special occasions filter');

    // Test 3: Related products query
    console.time('Related products query');
    await products.find({ relatedProducts: { $in: ['test-id'] } }).limit(10).toArray();
    console.timeEnd('Related products query');

    console.log('\n🎉 Tất cả indexes đã được tạo thành công!');
    console.log('📈 Dự kiến cải thiện hiệu suất: 5-20x faster queries\n');
  } catch (error) {
    console.error('❌ Lỗi khi tạo indexes:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the script
createProductIndexes().catch(console.error);

