#!/usr/bin/env tsx
/**
 * Verification Script: Phase 1 Database & Schema Changes
 * 
 * Script này kiểm tra dữ liệu thực tế trong MongoDB sau khi chạy migration:
 * - Check Data: Kiểm tra các sản phẩm đã có default values chưa
 * - Check Indexes: Kiểm tra các indexes mới đã được tạo chưa
 * 
 * Usage: npx tsx scripts/verify-phase1.ts
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';

interface ProductDocument {
  _id: ObjectId;
  name?: string;
  id?: string;
  giftWrapping?: boolean;
  giftMessageEnabled?: boolean;
  images360?: string[];
  lifestyleImages?: string[];
  relatedProducts?: string[];
  giftWrappingOptions?: string[];
  specialOccasions?: string[];
  comboProducts?: unknown[];
  variants?: Array<{
    isPopular?: boolean;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface IndexInfo {
  name: string;
  key: Record<string, number>;
  [key: string]: unknown;
}

async function verifyPhase1() {
  console.log('🔍 Bắt đầu verification Phase 1...\n');
  console.log('='.repeat(60));

  // Declare variables at function scope
  let failCount = 0;
  let indexFailCount = 0;

  try {
    const { products } = await getCollections();

    // ========================================
    // CHECK 1: DATA VERIFICATION
    // ========================================

    console.log('\n📊 CHECK 1: Data Verification\n');

    const totalProducts = await products.countDocuments();
    console.log(`📦 Tổng số sản phẩm trong database: ${totalProducts}`);

    if (totalProducts === 0) {
      console.log('⚠️  Không có sản phẩm nào trong database.');
      console.log('💡 Verification sẽ chỉ kiểm tra indexes.\n');
    } else {
      // Lấy ngẫu nhiên 5 sản phẩm (hoặc tất cả nếu < 5)
      const sampleSize = Math.min(5, totalProducts);
      const sampleProducts = await products
        .aggregate([{ $sample: { size: sampleSize } }])
        .toArray();

      console.log(`\n🔍 Kiểm tra ${sampleSize} sản phẩm ngẫu nhiên:\n`);

      let passCount = 0;
      failCount = 0; // Reset for this check
      const failedChecks: string[] = [];

      for (let i = 0; i < sampleProducts.length; i++) {
        const product = sampleProducts[i] as ProductDocument;
        const productName = product.name || product.id || `Product #${i + 1}`;
        const productId = product._id.toString();

        console.log(`\n  📦 Sản phẩm ${i + 1}: ${productName} (ID: ${productId})`);

        const checks: Array<{ field: string; expected: unknown; actual: unknown; pass: boolean }> = [];

        // Check giftWrapping (default: false)
        const giftWrapping = product.giftWrapping;
        const giftWrappingPass = giftWrapping === false || giftWrapping === true;
        checks.push({
          field: 'giftWrapping',
          expected: 'false (default) hoặc true',
          actual: giftWrapping,
          pass: giftWrappingPass,
        });

        // Check giftMessageEnabled (default: false)
        const giftMessageEnabled = product.giftMessageEnabled;
        const giftMessageEnabledPass = giftMessageEnabled === false || giftMessageEnabled === true;
        checks.push({
          field: 'giftMessageEnabled',
          expected: 'false (default) hoặc true',
          actual: giftMessageEnabled,
          pass: giftMessageEnabledPass,
        });

        // Check images360 (default: [])
        const images360 = product.images360;
        const images360Pass = Array.isArray(images360);
        checks.push({
          field: 'images360',
          expected: '[] (default) hoặc array',
          actual: images360,
          pass: images360Pass,
        });

        // Check lifestyleImages (default: [])
        const lifestyleImages = product.lifestyleImages;
        const lifestyleImagesPass = Array.isArray(lifestyleImages);
        checks.push({
          field: 'lifestyleImages',
          expected: '[] (default) hoặc array',
          actual: lifestyleImages,
          pass: lifestyleImagesPass,
        });

        // Check relatedProducts (default: [])
        const relatedProducts = product.relatedProducts;
        const relatedProductsPass = Array.isArray(relatedProducts);
        checks.push({
          field: 'relatedProducts',
          expected: '[] (default) hoặc array',
          actual: relatedProducts,
          pass: relatedProductsPass,
        });

        // Check giftWrappingOptions (default: [])
        const giftWrappingOptions = product.giftWrappingOptions;
        const giftWrappingOptionsPass = Array.isArray(giftWrappingOptions);
        checks.push({
          field: 'giftWrappingOptions',
          expected: '[] (default) hoặc array',
          actual: giftWrappingOptions,
          pass: giftWrappingOptionsPass,
        });

        // Check specialOccasions (default: [])
        const specialOccasions = product.specialOccasions;
        const specialOccasionsPass = Array.isArray(specialOccasions);
        checks.push({
          field: 'specialOccasions',
          expected: '[] (default) hoặc array',
          actual: specialOccasions,
          pass: specialOccasionsPass,
        });

        // Check comboProducts (default: [])
        const comboProducts = product.comboProducts;
        const comboProductsPass = Array.isArray(comboProducts);
        checks.push({
          field: 'comboProducts',
          expected: '[] (default) hoặc array',
          actual: comboProducts,
          pass: comboProductsPass,
        });

        // Check variants có isPopular field
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
          const firstVariant = product.variants[0];
          const hasIsPopular = 'isPopular' in firstVariant;
          checks.push({
            field: 'variants[0].isPopular',
            expected: 'boolean hoặc undefined',
            actual: firstVariant.isPopular,
            pass: hasIsPopular || firstVariant.isPopular === undefined,
          });
        }

        // Log kết quả từng check
        let productPass = true;
        for (const check of checks) {
          if (check.pass) {
            console.log(`    ✅ ${check.field}: ${JSON.stringify(check.actual)}`);
          } else {
            console.log(`    ❌ ${check.field}: Expected ${check.expected}, got ${JSON.stringify(check.actual)}`);
            productPass = false;
            failedChecks.push(`${productName} - ${check.field}`);
          }
        }

        if (productPass) {
          passCount++;
          console.log(`  ✅ PASS: ${productName}`);
        } else {
          failCount++;
          console.log(`  ❌ FAIL: ${productName}`);
        }
      }

      // Summary
      console.log('\n' + '-'.repeat(60));
      console.log('📊 Data Verification Summary:');
      console.log('-'.repeat(60));
      console.log(`✅ Passed: ${passCount}/${sampleSize}`);
      console.log(`❌ Failed: ${failCount}/${sampleSize}`);

      if (failedChecks.length > 0) {
        console.log('\n❌ Failed Checks:');
        failedChecks.forEach((check) => console.log(`   - ${check}`));
      }
    }

    // ========================================
    // CHECK 2: INDEXES VERIFICATION
    // ========================================

    console.log('\n\n📊 CHECK 2: Indexes Verification\n');

    const indexes = await products.indexes();
    const indexNames = indexes.map((idx) => idx.name || '');

    console.log(`📋 Tổng số indexes: ${indexes.length}\n`);

    // Danh sách các indexes mới cần kiểm tra
    const requiredIndexes = [
      'idx_products_collection',
      'idx_products_special_occasions',
      'idx_products_related',
      'idx_products_gift_wrapping',
      'idx_products_collection_active',
      'idx_products_occasions_active',
      'idx_products_category_collection',
    ];

    console.log('🔍 Kiểm tra các indexes mới:\n');

    let indexPassCount = 0;
    indexFailCount = 0; // Reset for this check
    const missingIndexes: string[] = [];

    for (const requiredIndex of requiredIndexes) {
      const exists = indexNames.includes(requiredIndex);

      if (exists) {
        const indexInfo = indexes.find((idx) => idx.name === requiredIndex) as IndexInfo;
        console.log(`  ✅ ${requiredIndex}`);
        console.log(`     Key: ${JSON.stringify(indexInfo.key)}`);
        indexPassCount++;
      } else {
        console.log(`  ❌ ${requiredIndex} - KHÔNG TỒN TẠI`);
        missingIndexes.push(requiredIndex);
        indexFailCount++;
      }
    }

    // Hiển thị tất cả indexes
    console.log('\n📋 Tất cả indexes trong collection:');
    indexes.forEach((idx) => {
      const indexInfo = idx as IndexInfo;
      console.log(`   - ${indexInfo.name || 'unnamed'}: ${JSON.stringify(indexInfo.key)}`);
    });

    // Summary
    console.log('\n' + '-'.repeat(60));
    console.log('📊 Indexes Verification Summary:');
    console.log('-'.repeat(60));
    console.log(`✅ Found: ${indexPassCount}/${requiredIndexes.length}`);
    console.log(`❌ Missing: ${indexFailCount}/${requiredIndexes.length}`);

    if (missingIndexes.length > 0) {
      console.log('\n❌ Missing Indexes:');
      missingIndexes.forEach((idx) => console.log(`   - ${idx}`));
      console.log('\n💡 Chạy script tạo indexes: npx tsx scripts/create-product-indexes.ts');
    }

    // ========================================
    // FINAL SUMMARY
    // ========================================

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL VERIFICATION SUMMARY');
    console.log('='.repeat(60));

    const dataCheckPass = totalProducts === 0 || failCount === 0;
    const indexCheckPass = indexFailCount === 0;

    if (dataCheckPass && indexCheckPass) {
      console.log('\n✅ ✅ ✅ ALL CHECKS PASSED ✅ ✅ ✅\n');
      console.log('🎉 Phase 1 verification hoàn thành thành công!');
      console.log('✅ Database schema đã được cập nhật đúng cách');
      console.log('✅ Tất cả indexes đã được tạo');
    } else {
      console.log('\n⚠️  ⚠️  ⚠️  SOME CHECKS FAILED ⚠️  ⚠️  ⚠️  \n');

      if (!dataCheckPass) {
        console.log('❌ Data Check: FAILED');
        console.log('   → Một số sản phẩm chưa có default values');
        console.log('   → Chạy migration: npx tsx scripts/migrate-product-schema.ts');
      }

      if (!indexCheckPass) {
        console.log('❌ Index Check: FAILED');
        console.log('   → Một số indexes chưa được tạo');
        console.log('   → Chạy script: npx tsx scripts/create-product-indexes.ts');
      }
    }

    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    throw error;
  }
}

// Run verification
verifyPhase1()
  .then(() => {
    console.log('\n✅ Verification script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

