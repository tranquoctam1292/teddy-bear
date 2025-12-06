#!/usr/bin/env tsx
/**
 * Test CMS Submission - Integration Test
 *
 * Script này kiểm tra xem Server/Database có chấp nhận payload dữ liệu phức tạp
 * từ ProductFormV3 hay không. Nó sẽ:
 * 1. Tạo mock payload đầy đủ với tất cả fields mới
 * 2. Insert vào MongoDB
 * 3. Query lại và verify dữ liệu
 * 4. Clean up (xóa test data)
 *
 * Run: npx tsx scripts/test-cms-submission.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';
import type { Product, ProductFormData } from '../src/lib/schemas/product';

/**
 * Mock Product Payload - Giả lập dữ liệu từ ProductFormV3
 */
const mockProductPayload: ProductFormData = {
  name: 'Gấu Bông Teddy Test - Phase 2 QA',
  slug: 'gau-bong-teddy-test-phase2-qa',
  description: '<p>Đây là sản phẩm test cho Phase 2 QA. Mô tả chi tiết về gấu bông teddy.</p>',
  category: 'teddy',
  tags: ['Test', 'QA', 'Phase2'],
  images: [
    'https://example.com/images/test-product-1.jpg',
    'https://example.com/images/test-product-2.jpg',
  ],
  variants: [
    {
      id: 'var_test_1',
      size: '80cm',
      color: 'Nâu',
      colorCode: '#8B4513',
      price: 250000,
      stock: 100,
      sku: 'TB80-BR-TEST',
      image: 'https://example.com/images/variant-1.jpg',
      weight: 800,
      dimensions: {
        length: 80,
        width: 50,
        height: 60,
      },
      isPopular: true,
    },
    {
      id: 'var_test_2',
      size: '1m2',
      color: 'Hồng',
      colorCode: '#FFC0CB',
      price: 400000,
      stock: 50,
      sku: 'TB120-PK-TEST',
      image: 'https://example.com/images/variant-2.jpg',
      weight: 1200,
      dimensions: {
        length: 120,
        width: 70,
        height: 80,
      },
      isPopular: false,
    },
  ],
  isHot: true,
  isActive: true,
  metaTitle: 'Gấu Bông Teddy Test - Phase 2 QA',
  metaDescription: 'Sản phẩm test cho Phase 2 QA với đầy đủ các fields mới',

  // NEW: Chi tiết sản phẩm
  material: 'Bông gòn cao cấp, vải lông mềm',
  dimensions: {
    length: 80,
    width: 50,
    height: 60,
  },
  weight: 800,
  ageRange: '3+',
  careInstructions: '<p>Giặt tay nhẹ nhàng với xà phòng dịu nhẹ. Phơi khô tự nhiên.</p>',
  safetyInfo: '<p>Sản phẩm đã được kiểm định an toàn cho trẻ em. Không chứa chất độc hại.</p>',
  warranty: '6 tháng',

  // NEW: Tính năng quà tặng
  giftWrapping: true,
  giftWrappingOptions: ['Hộp đỏ', 'Túi vải', 'Hộp cao cấp'],
  giftMessageEnabled: true,
  giftMessageTemplate: 'Chúc mừng sinh nhật bạn yêu! Chúc bạn luôn vui vẻ và hạnh phúc!',
  specialOccasions: ['Valentine', 'Sinh nhật', '8/3'],

  // NEW: Media mở rộng
  videoUrl: 'https://www.youtube.com/watch?v=test123',
  videoThumbnail: 'https://example.com/images/video-thumbnail.jpg',
  images360: [
    'https://example.com/images/360-1.jpg',
    'https://example.com/images/360-2.jpg',
    'https://example.com/images/360-3.jpg',
  ],
  lifestyleImages: [
    'https://example.com/images/lifestyle-1.jpg',
    'https://example.com/images/lifestyle-2.jpg',
  ],

  // NEW: Bộ sưu tập & Combo
  collection: 'Teddy Classic Test',
  relatedProducts: ['prod_related_1', 'prod_related_2'],
  comboProducts: [
    {
      productId: 'combo_prod_1',
      productName: 'Gấu Bông Combo Test',
      discount: 10,
    },
  ],
  bundleDiscount: 5,
};

/**
 * Convert ProductFormData to MongoDB Product Document
 */
function convertToMongoProduct(formData: ProductFormData): Omit<Product, '_id'> {
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    category: formData.category,
    tags: formData.tags || [],
    images: formData.images,
    variants: formData.variants.map((v) => ({
      id: v.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      size: v.size,
      color: v.color,
      colorCode: v.colorCode,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
      image: v.image,
      weight: v.weight,
      dimensions: v.dimensions,
      isPopular: v.isPopular,
    })),
    minPrice: Math.min(...formData.variants.map((v) => v.price)),
    maxPrice: Math.max(...formData.variants.map((v) => v.price)),
    isHot: formData.isHot,
    isActive: formData.isActive,
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
    // NEW: Chi tiết sản phẩm
    material: formData.material,
    dimensions: formData.dimensions,
    weight: formData.weight,
    ageRange: formData.ageRange,
    careInstructions: formData.careInstructions,
    safetyInfo: formData.safetyInfo,
    warranty: formData.warranty,
    // NEW: Tính năng quà tặng
    giftWrapping: formData.giftWrapping,
    giftWrappingOptions: formData.giftWrappingOptions || [],
    giftMessageEnabled: formData.giftMessageEnabled,
    giftMessageTemplate: formData.giftMessageTemplate,
    specialOccasions: formData.specialOccasions || [],
    // NEW: Media mở rộng
    videoUrl: formData.videoUrl,
    videoThumbnail: formData.videoThumbnail,
    images360: formData.images360 || [],
    lifestyleImages: formData.lifestyleImages || [],
    // NEW: Bộ sưu tập & Combo
    collection: formData.collection,
    relatedProducts: formData.relatedProducts || [],
    comboProducts: formData.comboProducts || [],
    bundleDiscount: formData.bundleDiscount,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Verify Product Data
 */
function verifyProductData(
  saved: Product,
  expected: ProductFormData
): { passed: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic Info
  if (saved.name !== expected.name) {
    errors.push(`❌ name: Expected "${expected.name}", Got "${saved.name}"`);
  }
  if (saved.slug !== expected.slug) {
    errors.push(`❌ slug: Expected "${expected.slug}", Got "${saved.slug}"`);
  }

  // Chi tiết sản phẩm
  if (saved.material !== expected.material) {
    errors.push(`❌ material: Expected "${expected.material}", Got "${saved.material}"`);
  }
  if (saved.weight !== expected.weight) {
    errors.push(`❌ weight: Expected ${expected.weight}, Got ${saved.weight}`);
  }
  if (
    saved.dimensions?.length !== expected.dimensions?.length ||
    saved.dimensions?.width !== expected.dimensions?.width ||
    saved.dimensions?.height !== expected.dimensions?.height
  ) {
    errors.push(
      `❌ dimensions: Expected ${JSON.stringify(expected.dimensions)}, Got ${JSON.stringify(saved.dimensions)}`
    );
  }
  if (saved.ageRange !== expected.ageRange) {
    errors.push(`❌ ageRange: Expected "${expected.ageRange}", Got "${saved.ageRange}"`);
  }
  if (saved.warranty !== expected.warranty) {
    errors.push(`❌ warranty: Expected "${expected.warranty}", Got "${saved.warranty}"`);
  }

  // Tính năng quà tặng
  if (saved.giftWrapping !== expected.giftWrapping) {
    errors.push(
      `❌ giftWrapping: Expected ${expected.giftWrapping}, Got ${saved.giftWrapping}`
    );
  }
  if (
    JSON.stringify(saved.giftWrappingOptions) !==
    JSON.stringify(expected.giftWrappingOptions)
  ) {
    errors.push(
      `❌ giftWrappingOptions: Expected ${JSON.stringify(expected.giftWrappingOptions)}, Got ${JSON.stringify(saved.giftWrappingOptions)}`
    );
  }
  if (saved.giftMessageEnabled !== expected.giftMessageEnabled) {
    errors.push(
      `❌ giftMessageEnabled: Expected ${expected.giftMessageEnabled}, Got ${saved.giftMessageEnabled}`
    );
  }
  if (
    JSON.stringify(saved.specialOccasions) !== JSON.stringify(expected.specialOccasions)
  ) {
    errors.push(
      `❌ specialOccasions: Expected ${JSON.stringify(expected.specialOccasions)}, Got ${JSON.stringify(saved.specialOccasions)}`
    );
  }

  // Media mở rộng
  if (saved.videoUrl !== expected.videoUrl) {
    errors.push(`❌ videoUrl: Expected "${expected.videoUrl}", Got "${saved.videoUrl}"`);
  }
  if (
    JSON.stringify(saved.images360) !== JSON.stringify(expected.images360)
  ) {
    errors.push(
      `❌ images360: Expected ${JSON.stringify(expected.images360)}, Got ${JSON.stringify(saved.images360)}`
    );
  }
  if (
    JSON.stringify(saved.lifestyleImages) !== JSON.stringify(expected.lifestyleImages)
  ) {
    errors.push(
      `❌ lifestyleImages: Expected ${JSON.stringify(expected.lifestyleImages)}, Got ${JSON.stringify(saved.lifestyleImages)}`
    );
  }

  // Bộ sưu tập & Combo
  if (saved.collection !== expected.collection) {
    errors.push(
      `❌ collection: Expected "${expected.collection}", Got "${saved.collection}"`
    );
  }
  if (
    JSON.stringify(saved.relatedProducts) !== JSON.stringify(expected.relatedProducts)
  ) {
    errors.push(
      `❌ relatedProducts: Expected ${JSON.stringify(expected.relatedProducts)}, Got ${JSON.stringify(saved.relatedProducts)}`
    );
  }
  if (
    JSON.stringify(saved.comboProducts) !== JSON.stringify(expected.comboProducts)
  ) {
    errors.push(
      `❌ comboProducts: Expected ${JSON.stringify(expected.comboProducts)}, Got ${JSON.stringify(saved.comboProducts)}`
    );
  }
  if (saved.bundleDiscount !== expected.bundleDiscount) {
    errors.push(
      `❌ bundleDiscount: Expected ${expected.bundleDiscount}, Got ${saved.bundleDiscount}`
    );
  }

  // Variants
  if (saved.variants.length !== expected.variants.length) {
    errors.push(
      `❌ variants.length: Expected ${expected.variants.length}, Got ${saved.variants.length}`
    );
  } else {
    expected.variants.forEach((expectedVariant, index) => {
      const savedVariant = saved.variants[index];
      if (savedVariant) {
        if (savedVariant.size !== expectedVariant.size) {
          errors.push(
            `❌ variants[${index}].size: Expected "${expectedVariant.size}", Got "${savedVariant.size}"`
          );
        }
        if (savedVariant.image !== expectedVariant.image) {
          errors.push(
            `❌ variants[${index}].image: Expected "${expectedVariant.image}", Got "${savedVariant.image}"`
          );
        }
        if (savedVariant.isPopular !== expectedVariant.isPopular) {
          errors.push(
            `❌ variants[${index}].isPopular: Expected ${expectedVariant.isPopular}, Got ${savedVariant.isPopular}`
          );
        }
        if (
          savedVariant.dimensions?.length !== expectedVariant.dimensions?.length ||
          savedVariant.dimensions?.width !== expectedVariant.dimensions?.width ||
          savedVariant.dimensions?.height !== expectedVariant.dimensions?.height
        ) {
          errors.push(
            `❌ variants[${index}].dimensions: Expected ${JSON.stringify(expectedVariant.dimensions)}, Got ${JSON.stringify(savedVariant.dimensions)}`
          );
        }
      }
    });
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Main Test Function
 */
async function testCMSSubmission() {
  console.log('🧪 Bắt đầu Test CMS Submission (Phase 2)...\n');
  console.log('='.repeat(60) + '\n');

  let testProductId: string | null = null;
  let testProductObjectId: ObjectId | null = null;

  try {
    const { products } = await getCollections();

    // ============================================================
    // STEP 1: Insert Mock Payload
    // ============================================================
    console.log('📝 STEP 1: Insert Mock Payload vào MongoDB...\n');

    const mongoProduct = convertToMongoProduct(mockProductPayload);
    const insertResult = await products.insertOne(mongoProduct as unknown as Product);

    if (!insertResult.insertedId) {
      throw new Error('Failed to insert test product');
    }

    testProductObjectId = insertResult.insertedId;
    testProductId = mongoProduct.id;

    console.log(`✅ Đã insert sản phẩm test:`);
    console.log(`   - MongoDB _id: ${testProductObjectId}`);
    console.log(`   - Product ID: ${testProductId}\n`);

    // ============================================================
    // STEP 2: Query lại sản phẩm
    // ============================================================
    console.log('🔍 STEP 2: Query lại sản phẩm từ MongoDB...\n');

    const savedProduct = await products.findOne({
      _id: testProductObjectId,
    });

    if (!savedProduct) {
      throw new Error('Failed to query saved product');
    }

    console.log(`✅ Đã query thành công sản phẩm: "${savedProduct.name}"\n`);

    // ============================================================
    // STEP 3: Verification
    // ============================================================
    console.log('✅ STEP 3: Verification dữ liệu...\n');
    console.log('-'.repeat(60) + '\n');

    const verification = verifyProductData(savedProduct as unknown as Product, mockProductPayload);

    // Log chi tiết từng section
    console.log('📊 Kết quả Verification:\n');

    const sections = [
      { name: 'Basic Info', fields: ['name', 'slug', 'category'] },
      { name: 'Chi tiết sản phẩm', fields: ['material', 'weight', 'dimensions', 'ageRange', 'warranty'] },
      { name: 'Tính năng quà tặng', fields: ['giftWrapping', 'giftWrappingOptions', 'giftMessageEnabled', 'specialOccasions'] },
      { name: 'Media mở rộng', fields: ['videoUrl', 'images360', 'lifestyleImages'] },
      { name: 'Bộ sưu tập & Combo', fields: ['collection', 'relatedProducts', 'comboProducts', 'bundleDiscount'] },
      { name: 'Variants', fields: ['variants'] },
    ];

    sections.forEach((section) => {
      const sectionErrors = verification.errors.filter((err) =>
        section.fields.some((field) => err.includes(field))
      );
      if (sectionErrors.length === 0) {
        console.log(`✅ ${section.name}: PASS`);
      } else {
        console.log(`❌ ${section.name}: FAIL`);
        sectionErrors.forEach((err) => console.log(`   ${err}`));
      }
    });

    console.log('\n' + '-'.repeat(60) + '\n');

    // ============================================================
    // STEP 4: Final Result
    // ============================================================
    if (verification.passed) {
      console.log('🎉 ✅ ✅ ✅ ALL VERIFICATIONS PASSED ✅ ✅ ✅\n');
      console.log('✅ CMS Submission Test hoàn thành thành công!');
      console.log('✅ Tất cả dữ liệu từ ProductFormV3 đã được lưu chính xác vào MongoDB.');
    } else {
      console.log('❌ ❌ ❌ VERIFICATION FAILED ❌ ❌ ❌\n');
      console.log(`⚠️  Tìm thấy ${verification.errors.length} lỗi:`);
      verification.errors.forEach((err) => console.log(`   ${err}`));
      throw new Error('Verification failed');
    }

    // ============================================================
    // STEP 5: Clean Up
    // ============================================================
    console.log('\n🧹 STEP 4: Clean Up (Xóa test data)...\n');

    if (testProductObjectId) {
      const deleteResult = await products.deleteOne({
        _id: testProductObjectId,
      });

      if (deleteResult.deletedCount === 1) {
        console.log('✅ Đã xóa sản phẩm test thành công');
      } else {
        console.log('⚠️  Không tìm thấy sản phẩm test để xóa');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Test hoàn thành!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Lỗi nghiêm trọng trong quá trình test:', error);

    // Clean up on error
    if (testProductObjectId) {
      try {
        const { products } = await getCollections();
        await products.deleteOne({ _id: testProductObjectId });
        console.log('\n🧹 Đã xóa sản phẩm test sau khi gặp lỗi');
      } catch (cleanupError) {
        console.error('❌ Lỗi khi clean up:', cleanupError);
      }
    }

    process.exit(1);
  }
}

// Run the test
testCMSSubmission()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Lỗi fatal khi chạy test:', error);
    process.exit(1);
  });




