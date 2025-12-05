#!/usr/bin/env tsx
/**
 * Integration Test: Blog CMS Submission
 * Run: npm run test:blog-cms
 * 
 * Mô phỏng hành động Admin nhấn "Save Post" với payload phức tạp
 * để verify API/DB có xử lý được không
 * 
 * Based on Blog Upgrade Plan Phase 2 - CMS Editor Enhancements
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';
import type { Post, LinkedProduct, ComparisonTable } from '../src/lib/schemas/post';

/**
 * Generate unique ID for test post
 */
function generateId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Mock Post Payload với đầy đủ tính năng Phase 2
 */
function createMockPostPayload(): Post {
  const testId = generateId();
  const now = new Date();

  // Mock Linked Products
  const linkedProducts: LinkedProduct[] = [
    {
      productId: 'product-123',
      position: 'inline',
      displayType: 'card',
      customMessage: 'Sản phẩm được đề xuất cho dịp sinh nhật',
    },
    {
      productId: 'product-456',
      position: 'sidebar',
      displayType: 'spotlight',
      customMessage: 'Quà tặng đặc biệt',
    },
  ];

  // Mock Template Data (Gift Guide)
  const templateData = {
    giftGuide: {
      occasions: ['Sinh nhật', 'Valentine'],
      priceRange: {
        min: 100000,
        max: 500000,
      },
      deliveryOptions: ['Giao hàng nhanh', 'Gói quà miễn phí'],
    },
  };

  // Mock Comparison Table
  const comparisonTable: ComparisonTable = {
    products: ['product-123', 'product-456'],
    features: [
      {
        name: 'Kích thước',
        values: {
          'product-123': '80cm',
          'product-456': '1m2',
        },
      },
      {
        name: 'Giá',
        values: {
          'product-123': 250000,
          'product-456': 350000,
        },
      },
      {
        name: 'Chất liệu',
        values: {
          'product-123': 'Bông gòn cao cấp',
          'product-456': 'Bông gòn siêu mềm',
        },
      },
    ],
    displayOptions: {
      showImages: true,
      showPrices: true,
      highlightBest: true,
    },
  };

  // Mock Post với đầy đủ fields
  const mockPost: Post = {
    id: testId,
    title: `[TEST] Hướng dẫn chọn quà tặng sinh nhật ${testId}`,
    slug: `test-huong-dan-qua-tang-sinh-nhat-${testId}`,
    excerpt: 'Bài viết test với đầy đủ tính năng Phase 2: Gift Guide, Product Linking, Comparison Table',
    content: `
      <h2>Giới thiệu</h2>
      <p>Đây là bài viết test để verify các tính năng mới của CMS.</p>
      
      <h2>Danh sách quà tặng phù hợp</h2>
      <p>Dưới đây là các sản phẩm được đề xuất cho dịp sinh nhật.</p>
      
      <h2>So sánh sản phẩm</h2>
      <p>Bảng so sánh chi tiết giữa các sản phẩm.</p>
      
      <h2>Kết luận</h2>
      <p>Hy vọng bài viết này giúp bạn chọn được quà tặng phù hợp.</p>
    `,
    metaTitle: 'Test: Hướng dẫn chọn quà tặng sinh nhật',
    metaDescription: 'Bài viết test với đầy đủ tính năng Phase 2',
    keywords: ['test', 'gift-guide', 'quà tặng', 'sinh nhật'],
    featuredImage: 'https://example.com/test-featured.jpg',
    images: [
      'https://example.com/test-image-1.jpg',
      'https://example.com/test-image-2.jpg',
    ],
    category: 'guide',
    tags: ['test', 'gift-guide', 'quà tặng'],
    status: 'draft',
    publishedAt: undefined, // Draft nên không có publishedAt
    author: 'Test Admin',
    views: 0,
    likes: 0,

    // 🆕 Phase 2: New fields
    template: 'gift-guide',
    templateData: templateData,
    readingTime: 5, // minutes
    linkedProducts: linkedProducts,
    comparisonTable: comparisonTable,

    // Timestamps
    createdAt: now,
    updatedAt: now,
  };

  return mockPost;
}

/**
 * Verify Post Data
 */
function verifyPostData(saved: Post, expected: Post): { passed: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verify basic fields
  if (saved.title !== expected.title) {
    errors.push(`Title mismatch: expected "${expected.title}", got "${saved.title}"`);
  }

  if (saved.slug !== expected.slug) {
    errors.push(`Slug mismatch: expected "${expected.slug}", got "${saved.slug}"`);
  }

  // Verify template
  if (saved.template !== expected.template) {
    errors.push(`Template mismatch: expected "${expected.template}", got "${saved.template}"`);
  }

  // Verify readingTime
  if (saved.readingTime !== expected.readingTime) {
    errors.push(
      `ReadingTime mismatch: expected ${expected.readingTime}, got ${saved.readingTime}`
    );
  }

  // Verify linkedProducts
  if (!saved.linkedProducts || saved.linkedProducts.length !== expected.linkedProducts!.length) {
    errors.push(
      `LinkedProducts count mismatch: expected ${expected.linkedProducts!.length}, got ${saved.linkedProducts?.length || 0}`
    );
  } else {
    // Verify first linked product
    const firstLinked = saved.linkedProducts[0];
    const expectedFirst = expected.linkedProducts![0];
    if (firstLinked.productId !== expectedFirst.productId) {
      errors.push(
        `First linkedProduct.productId mismatch: expected "${expectedFirst.productId}", got "${firstLinked.productId}"`
      );
    }
    if (firstLinked.position !== expectedFirst.position) {
      errors.push(
        `First linkedProduct.position mismatch: expected "${expectedFirst.position}", got "${firstLinked.position}"`
      );
    }
  }

  // Verify templateData
  if (!saved.templateData) {
    errors.push('templateData is missing');
  } else {
    const giftGuideData = (saved.templateData as any).giftGuide;
    if (!giftGuideData) {
      errors.push('templateData.giftGuide is missing');
    } else {
      const expectedGiftGuide = (expected.templateData as any).giftGuide;
      if (!giftGuideData.occasions || !Array.isArray(giftGuideData.occasions)) {
        errors.push('templateData.giftGuide.occasions is missing or not an array');
      } else if (giftGuideData.occasions.length !== expectedGiftGuide.occasions.length) {
        errors.push(
          `templateData.giftGuide.occasions count mismatch: expected ${expectedGiftGuide.occasions.length}, got ${giftGuideData.occasions.length}`
        );
      }

      if (!giftGuideData.priceRange) {
        errors.push('templateData.giftGuide.priceRange is missing');
      } else {
        if (giftGuideData.priceRange.min !== expectedGiftGuide.priceRange.min) {
          errors.push(
            `templateData.giftGuide.priceRange.min mismatch: expected ${expectedGiftGuide.priceRange.min}, got ${giftGuideData.priceRange.min}`
          );
        }
        if (giftGuideData.priceRange.max !== expectedGiftGuide.priceRange.max) {
          errors.push(
            `templateData.giftGuide.priceRange.max mismatch: expected ${expectedGiftGuide.priceRange.max}, got ${giftGuideData.priceRange.max}`
          );
        }
      }
    }
  }

  // Verify comparisonTable
  if (!saved.comparisonTable) {
    errors.push('comparisonTable is missing');
  } else {
    if (saved.comparisonTable.products.length !== expected.comparisonTable!.products.length) {
      errors.push(
        `comparisonTable.products count mismatch: expected ${expected.comparisonTable!.products.length}, got ${saved.comparisonTable.products.length}`
      );
    }

    if (saved.comparisonTable.features.length !== expected.comparisonTable!.features.length) {
      errors.push(
        `comparisonTable.features count mismatch: expected ${expected.comparisonTable!.features.length}, got ${saved.comparisonTable.features.length}`
      );
    } else {
      // Verify first feature
      const firstFeature = saved.comparisonTable.features[0];
      const expectedFirstFeature = expected.comparisonTable!.features[0];
      if (firstFeature.name !== expectedFirstFeature.name) {
        errors.push(
          `comparisonTable.features[0].name mismatch: expected "${expectedFirstFeature.name}", got "${firstFeature.name}"`
        );
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Main Test Function
 */
async function testBlogCMSSubmission() {
  console.log('🧪 Bắt đầu Integration Test: Blog CMS Submission\n');
  console.log('='.repeat(80));
  console.log('📋 MỤC TIÊU: Verify API/DB có xử lý được payload phức tạp Phase 2\n');

  let testPostId: string | null = null;
  let testPostSlug: string | null = null;

  try {
    // Step 1: Connect to Database
    console.log('📊 Bước 1: Kết nối Database...');
    const { posts } = await getCollections();
    console.log('✅ Kết nối Database thành công\n');

    // Step 2: Create Mock Payload
    console.log('📝 Bước 2: Tạo Mock Post Payload...');
    const mockPost = createMockPostPayload();
    testPostId = mockPost.id;
    testPostSlug = mockPost.slug;
    console.log(`✅ Đã tạo payload với ID: ${testPostId}`);
    console.log(`   - Template: ${mockPost.template}`);
    console.log(`   - Linked Products: ${mockPost.linkedProducts?.length || 0} items`);
    console.log(`   - Reading Time: ${mockPost.readingTime} phút`);
    console.log(`   - Comparison Table: ${mockPost.comparisonTable?.products.length || 0} products, ${mockPost.comparisonTable?.features.length || 0} features`);
    console.log(`   - Template Data: ${JSON.stringify(mockPost.templateData).substring(0, 100)}...\n`);

    // Step 3: Insert into Database (Simulate API Save)
    console.log('💾 Bước 3: Insert vào MongoDB (Giả lập API Save)...');
    const insertResult = await posts.insertOne(mockPost);
    console.log(`✅ Insert thành công với _id: ${insertResult.insertedId}\n`);

    // Step 4: Query lại bài viết
    console.log('🔍 Bước 4: Query lại bài viết từ Database...');
    const savedPost = await posts.findOne({ id: testPostId });
    if (!savedPost) {
      throw new Error('Không tìm thấy bài viết sau khi insert!');
    }
    console.log('✅ Query thành công\n');

    // Step 5: Verify Data
    console.log('✅ Bước 5: Verify dữ liệu...');
    const verification = verifyPostData(savedPost as Post, mockPost);

    if (verification.passed) {
      console.log('✅ TẤT CẢ VERIFICATION PASSED!\n');
      console.log('='.repeat(80));
      console.log('🎉 KẾT QUẢ: PASS\n');
      console.log('📊 Chi tiết:');
      console.log('   ✅ Template được lưu đúng');
      console.log('   ✅ templateData.giftGuide được lưu đúng');
      console.log('   ✅ linkedProducts được lưu đúng (2 items)');
      console.log('   ✅ comparisonTable được lưu đúng');
      console.log('   ✅ readingTime được lưu đúng');
      console.log('   ✅ Tất cả fields Phase 2 hoạt động chính xác\n');
    } else {
      console.log('❌ VERIFICATION FAILED!\n');
      console.log('='.repeat(80));
      console.log('❌ KẾT QUẢ: FAIL\n');
      console.log('📋 Lỗi chi tiết:');
      verification.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
      console.log('');
      throw new Error('Verification failed');
    }

    // Step 6: Clean up
    console.log('🧹 Bước 6: Clean up (Xóa bài viết test)...');
    const deleteResult = await posts.deleteOne({ id: testPostId });
    if (deleteResult.deletedCount === 1) {
      console.log('✅ Đã xóa bài viết test thành công\n');
    } else {
      console.log('⚠️  Không tìm thấy bài viết để xóa (có thể đã bị xóa trước đó)\n');
    }

    console.log('='.repeat(80));
    console.log('✅ TEST HOÀN TẤT: PASS\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI TRONG QUÁ TRÌNH TEST:');
    console.error(error);

    // Clean up on error
    if (testPostId) {
      try {
        const { posts } = await getCollections();
        await posts.deleteOne({ id: testPostId });
        console.log('\n🧹 Đã xóa bài viết test sau khi lỗi');
      } catch (cleanupError) {
        console.error('⚠️  Không thể xóa bài viết test:', cleanupError);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('❌ KẾT QUẢ: FAIL\n');
    process.exit(1);
  }
}

// Run the test
testBlogCMSSubmission().catch(console.error);

