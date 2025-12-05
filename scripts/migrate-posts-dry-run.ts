#!/usr/bin/env tsx
/**
 * Migrate Posts to New Schema - DRY RUN
 * Run: npm run migrate:posts:dry-run
 *
 * This script simulates migration of existing posts to the new schema
 * WITHOUT actually updating the database (DRY RUN mode)
 *
 * Based on Blog Upgrade Plan Phase 1 - Migration Plan (Section 6.1)
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { getCollections } from '../src/lib/db';
import type { Post, PostTemplate } from '../src/lib/schemas/post';

/**
 * Calculate reading time from content (simple word count)
 * @param content HTML content
 * @param wordsPerMinute Reading speed (default: 200 words/min for Vietnamese)
 * @returns Reading time in minutes
 */
function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');
  // Remove extra whitespace
  const cleanText = text.replace(/\s+/g, ' ').trim();
  // Count words (split by spaces)
  const wordCount = cleanText.split(' ').filter((word) => word.length > 0).length;
  // Calculate reading time
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate Table of Contents from HTML content
 * @param content HTML content
 * @returns Array of TOC items
 */
function generateTOC(
  content: string
): Array<{ id: string; text: string; level: number; anchor: string }> {
  const toc: Array<{ id: string; text: string; level: number; anchor: string }> = [];

  // Match headings (H1-H6)
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  let match;
  let index = 0;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // Remove nested HTML

    if (text) {
      // Generate anchor from text
      const anchor = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      toc.push({
        id: `heading-${index}`,
        text,
        level,
        anchor: `#${anchor}`,
      });
      index++;
    }
  }

  return toc;
}

/**
 * Detect template based on category and content
 * @param post Post object
 * @returns Detected template
 */
function detectTemplate(post: Post): PostTemplate {
  // Check category first
  if (post.category) {
    const categoryLower = post.category.toLowerCase();

    if (
      categoryLower.includes('gift') ||
      categoryLower.includes('quà') ||
      categoryLower.includes('tặng')
    ) {
      return 'gift-guide';
    }

    if (categoryLower.includes('review') || categoryLower.includes('đánh giá')) {
      return 'review';
    }

    if (
      categoryLower.includes('care') ||
      categoryLower.includes('chăm sóc') ||
      categoryLower.includes('bảo quản')
    ) {
      return 'care-guide';
    }

    if (
      categoryLower.includes('story') ||
      categoryLower.includes('câu chuyện') ||
      categoryLower.includes('story')
    ) {
      return 'story';
    }
  }

  // Check title and content keywords
  const titleLower = post.title.toLowerCase();
  const contentLower = post.content.toLowerCase();
  const combinedText = `${titleLower} ${contentLower}`;

  // Gift guide keywords
  if (
    combinedText.includes('quà tặng') ||
    combinedText.includes('gift guide') ||
    combinedText.includes('quà sinh nhật') ||
    combinedText.includes('quà valentine') ||
    combinedText.includes('quà giáng sinh')
  ) {
    return 'gift-guide';
  }

  // Review keywords
  if (
    combinedText.includes('đánh giá') ||
    combinedText.includes('review') ||
    combinedText.includes('so sánh') ||
    combinedText.includes('comparison')
  ) {
    return 'review';
  }

  // Care guide keywords
  if (
    combinedText.includes('bảo quản') ||
    combinedText.includes('chăm sóc') ||
    combinedText.includes('vệ sinh') ||
    combinedText.includes('care guide') ||
    combinedText.includes('hướng dẫn')
  ) {
    return 'care-guide';
  }

  // Story keywords
  if (
    combinedText.includes('câu chuyện') ||
    combinedText.includes('story') ||
    combinedText.includes('tâm sự') ||
    combinedText.includes('trải nghiệm')
  ) {
    return 'story';
  }

  // Default
  return 'default';
}

/**
 * Main migration function (DRY RUN)
 */
async function migratePostsDryRun() {
  console.log('🔍 Bắt đầu DRY RUN migration cho Posts Collection...\n');
  console.log('⚠️  CHẾ ĐỘ DRY RUN: Không có thay đổi nào được ghi vào database\n');

  try {
    const { posts } = await getCollections();

    // Get all existing posts
    const allPosts = await posts.find({}).toArray();

    console.log(`📊 Tìm thấy ${allPosts.length} bài viết cần migrate\n`);
    console.log('='.repeat(80));
    console.log('📋 CHI TIẾT MIGRATION (DRY RUN)\n');

    let migrated = 0;
    let errors = 0;
    const migrationLog: Array<{
      postId: string;
      title: string;
      changes: string[];
    }> = [];

    for (const post of allPosts) {
      try {
        const postData = post as unknown as Post;
        const changes: string[] = [];
        const updates: Record<string, unknown> = {};

        // 1. Set default template if missing
        if (!postData.template) {
          const detectedTemplate = detectTemplate(postData);
          updates.template = detectedTemplate;
          changes.push(`Template: null → '${detectedTemplate}' (auto-detect)`);
        } else {
          changes.push(`Template: '${postData.template}' (giữ nguyên)`);
        }

        // 2. Calculate reading time if missing
        if (!postData.readingTime && postData.content) {
          const readingTime = calculateReadingTime(postData.content);
          updates.readingTime = readingTime;
          changes.push(`Reading Time: null → ${readingTime} phút`);
        } else if (postData.readingTime) {
          changes.push(`Reading Time: ${postData.readingTime} phút (giữ nguyên)`);
        }

        // 3. Generate TOC if missing
        if (!postData.tableOfContents && postData.content) {
          const toc = generateTOC(postData.content);
          updates.tableOfContents = toc;
          if (toc.length > 0) {
            changes.push(`Table of Contents: null → ${toc.length} mục`);
          } else {
            changes.push(`Table of Contents: null → [] (không có headings)`);
          }
        } else if (postData.tableOfContents) {
          changes.push(`Table of Contents: ${postData.tableOfContents.length} mục (giữ nguyên)`);
        }

        // 4. Initialize empty arrays if missing
        if (!postData.linkedProducts) {
          updates.linkedProducts = [];
          changes.push(`Linked Products: null → []`);
        } else {
          changes.push(`Linked Products: ${postData.linkedProducts.length} sản phẩm (giữ nguyên)`);
        }

        if (!postData.videos) {
          updates.videos = [];
          changes.push(`Videos: null → []`);
        } else {
          changes.push(`Videos: ${postData.videos.length} video (giữ nguyên)`);
        }

        // 5. Set templateData to empty object if missing
        if (!postData.templateData) {
          updates.templateData = {};
          changes.push(`Template Data: null → {}`);
        } else {
          changes.push(`Template Data: có dữ liệu (giữ nguyên)`);
        }

        // Log changes for this post
        if (Object.keys(updates).length > 0) {
          migrationLog.push({
            postId: postData.id || post._id?.toString() || 'unknown',
            title: postData.title,
            changes,
          });

          console.log(`\n📝 Post: ${postData.title}`);
          console.log(`   ID: ${postData.id || post._id?.toString()}`);
          console.log(`   Slug: ${postData.slug}`);
          console.log(`   Thay đổi dự kiến:`);
          changes.forEach((change) => {
            console.log(`     • ${change}`);
          });
          console.log(`   \n   [DRY RUN] Update query sẽ là:`);
          console.log(
            `   db.posts.updateOne({ _id: ObjectId("${post._id}") }, { $set: ${JSON.stringify(
              updates,
              null,
              2
            )} })`
          );

          migrated++;
        } else {
          console.log(`\n✅ Post: ${postData.title} - Không cần thay đổi (đã có đầy đủ fields)`);
        }
      } catch (error) {
        errors++;
        console.error(`\n❌ Lỗi khi xử lý post ${post._id}:`, error);
      }
    }

    // ========================================
    // SUMMARY
    // ========================================

    console.log('\n' + '='.repeat(80));
    console.log('📊 TÓM TẮT MIGRATION (DRY RUN)\n');
    console.log(`✅ Sẽ migrate: ${migrated} bài viết`);
    console.log(`⚠️  Không cần thay đổi: ${allPosts.length - migrated - errors} bài viết`);
    console.log(`❌ Lỗi: ${errors} bài viết`);
    console.log(`📝 Tổng số: ${allPosts.length} bài viết\n`);

    // Template distribution
    const templateCounts: Record<string, number> = {};
    migrationLog.forEach((log) => {
      const templateChange = log.changes.find((c) => c.startsWith('Template:'));
      if (templateChange) {
        const match = templateChange.match(/→ '(\w+)'/);
        if (match) {
          const template = match[1];
          templateCounts[template] = (templateCounts[template] || 0) + 1;
        }
      }
    });

    if (Object.keys(templateCounts).length > 0) {
      console.log('📊 Phân bố Template (dự kiến):');
      Object.entries(templateCounts)
        .sort(([, a], [, b]) => b - a)
        .forEach(([template, count]) => {
          console.log(`   • ${template}: ${count} bài viết`);
        });
      console.log('');
    }

    // Reading time statistics
    const readingTimes: number[] = [];
    migrationLog.forEach((log) => {
      const rtChange = log.changes.find((c) => c.startsWith('Reading Time:'));
      if (rtChange) {
        const match = rtChange.match(/→ (\d+) phút/);
        if (match) {
          readingTimes.push(parseInt(match[1], 10));
        }
      }
    });

    if (readingTimes.length > 0) {
      const avgReadingTime = Math.round(
        readingTimes.reduce((a, b) => a + b, 0) / readingTimes.length
      );
      const minReadingTime = Math.min(...readingTimes);
      const maxReadingTime = Math.max(...readingTimes);
      console.log('⏱️  Thống kê Reading Time (dự kiến):');
      console.log(`   • Trung bình: ${avgReadingTime} phút`);
      console.log(`   • Tối thiểu: ${minReadingTime} phút`);
      console.log(`   • Tối đa: ${maxReadingTime} phút\n`);
    }

    // TOC statistics
    const tocCounts = migrationLog
      .map((log) => {
        const tocChange = log.changes.find((c) => c.startsWith('Table of Contents:'));
        if (tocChange) {
          const match = tocChange.match(/→ (\d+) mục/);
          return match ? parseInt(match[1], 10) : 0;
        }
        return 0;
      })
      .filter((count) => count > 0);

    if (tocCounts.length > 0) {
      const avgTOC = Math.round(tocCounts.reduce((a, b) => a + b, 0) / tocCounts.length);
      console.log('📑 Thống kê Table of Contents (dự kiến):');
      console.log(`   • Số bài có TOC: ${tocCounts.length}`);
      console.log(`   • Trung bình số mục: ${avgTOC}\n`);
    }

    console.log('='.repeat(80));
    console.log('\n💡 LƯU Ý:');
    console.log('   • Đây là DRY RUN - không có thay đổi nào được ghi vào database');
    console.log('   • Để thực hiện migration thật, tạo script migrate-posts.ts');
    console.log('   • Nhớ backup database trước khi chạy migration thật');
    console.log('   • Chạy script create-blog-indexes.ts sau khi migration\n');

    console.log('✅ DRY RUN hoàn tất!\n');
  } catch (error) {
    console.error('❌ Lỗi khi chạy DRY RUN:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the script
migratePostsDryRun().catch(console.error);
