#!/usr/bin/env tsx
/**
 * Migration Script: Product Schema Upgrade
 * 
 * Script này migrate existing products để thêm các fields mới:
 * - Chi tiết sản phẩm (material, dimensions, weight, ageRange, careInstructions, safetyInfo, warranty)
 * - Tính năng quà tặng (giftWrapping, giftWrappingOptions, giftMessageEnabled, giftMessageTemplate, specialOccasions)
 * - Media mở rộng (videoUrl, videoThumbnail, images360, lifestyleImages)
 * - Bộ sưu tập & Combo (collection, relatedProducts, comboProducts, bundleDiscount)
 * - Variant mở rộng (image, weight, dimensions, isPopular)
 * 
 * Usage: npx tsx scripts/migrate-product-schema.ts
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';

interface ProductDocument {
  _id: ObjectId;
  [key: string]: unknown;
}

async function migrateProductSchema() {
  console.log('🔄 Bắt đầu migration Product Schema...\n');

  try {
    const { products } = await getCollections();

    // Đếm tổng số sản phẩm
    const totalProducts = await products.countDocuments();
    console.log(`📊 Tìm thấy ${totalProducts} sản phẩm cần migrate\n`);

    if (totalProducts === 0) {
      console.log('⚠️  Không có sản phẩm nào trong database.');
      console.log('💡 Migration sẽ không thực hiện gì cả.\n');
      process.exit(0);
    }

    // Tìm các sản phẩm chưa có fields mới
    // Sử dụng $or để tìm products thiếu bất kỳ field mới nào
    const productsToMigrate = await products
      .find({
        $or: [
          { giftWrapping: { $exists: false } },
          { giftMessageEnabled: { $exists: false } },
          { images360: { $exists: false } },
          { lifestyleImages: { $exists: false } },
          { relatedProducts: { $exists: false } },
          { giftWrappingOptions: { $exists: false } },
          { specialOccasions: { $exists: false } },
          { comboProducts: { $exists: false } },
        ],
      })
      .toArray();

    const productsToUpdate = productsToMigrate.length;
    console.log(`📝 Số sản phẩm cần update: ${productsToUpdate}\n`);

    if (productsToUpdate === 0) {
      console.log('✅ Tất cả sản phẩm đã được migrate. Không cần update.\n');
      process.exit(0);
    }

    // Migration logic
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of productsToMigrate) {
      try {
        const productDoc = product as ProductDocument;
        const updateFields: Record<string, unknown> = {};

        // Chỉ thêm fields nếu chưa tồn tại
        if (productDoc.giftWrapping === undefined) {
          updateFields.giftWrapping = false;
        }
        if (productDoc.giftMessageEnabled === undefined) {
          updateFields.giftMessageEnabled = false;
        }
        if (productDoc.images360 === undefined) {
          updateFields.images360 = [];
        }
        if (productDoc.lifestyleImages === undefined) {
          updateFields.lifestyleImages = [];
        }
        if (productDoc.relatedProducts === undefined) {
          updateFields.relatedProducts = [];
        }
        if (productDoc.giftWrappingOptions === undefined) {
          updateFields.giftWrappingOptions = [];
        }
        if (productDoc.specialOccasions === undefined) {
          updateFields.specialOccasions = [];
        }
        if (productDoc.comboProducts === undefined) {
          updateFields.comboProducts = [];
        }

        // Update product nếu có fields cần thêm
        if (Object.keys(updateFields).length > 0) {
          await products.updateOne(
            { _id: productDoc._id },
            {
              $set: {
                ...updateFields,
                updatedAt: new Date(), // Update timestamp
              },
            }
          );

          console.log(`✅ Migrated product: "${productDoc.name || productDoc.id || 'Unknown'}"`);
          migratedCount++;
        } else {
          console.log(`⏭️  Skipped product: "${productDoc.name || productDoc.id || 'Unknown'}" - đã có đầy đủ fields`);
          skippedCount++;
        }
      } catch (error) {
        const productDoc = product as ProductDocument;
        console.error(
          `❌ Lỗi khi migrate product "${productDoc.name || productDoc.id || 'Unknown'}":`,
          error instanceof Error ? error.message : error
        );
        errorCount++;
      }
    }

    // Migrate variants nếu cần
    console.log('\n🔄 Migrating variants...');
    let variantMigratedCount = 0;

    const allProducts = await products.find({}).toArray();
    for (const product of allProducts) {
      const productDoc = product as ProductDocument;
      if (!productDoc.variants || !Array.isArray(productDoc.variants)) {
        continue;
      }

      let variantUpdated = false;
      const updatedVariants = productDoc.variants.map((variant: unknown) => {
        const v = variant as Record<string, unknown>;
        const updatedVariant = { ...v };

        // Thêm isPopular nếu chưa có
        if (updatedVariant.isPopular === undefined) {
          updatedVariant.isPopular = false;
          variantUpdated = true;
        }

        return updatedVariant;
      });

      if (variantUpdated) {
        await products.updateOne(
          { _id: productDoc._id },
          {
            $set: {
              variants: updatedVariants,
              updatedAt: new Date(),
            },
          }
        );
        variantMigratedCount++;
      }
    }

    console.log(`✅ Migrated variants cho ${variantMigratedCount} sản phẩm\n`);

    // Summary
    console.log('='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Tổng số sản phẩm: ${totalProducts}`);
    console.log(`Sản phẩm cần update: ${productsToUpdate}`);
    console.log(`✅ Đã migrate: ${migratedCount}`);
    console.log(`⏭️  Đã skip: ${skippedCount}`);
    console.log(`❌ Lỗi: ${errorCount}`);
    console.log(`🔄 Variants đã migrate: ${variantMigratedCount}`);
    console.log('='.repeat(60));

    if (errorCount === 0) {
      console.log('\n🎉 Migration hoàn thành thành công!');
    } else {
      console.log('\n⚠️  Migration hoàn thành nhưng có lỗi. Vui lòng kiểm tra logs.');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateProductSchema()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

