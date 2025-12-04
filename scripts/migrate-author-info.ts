#!/usr/bin/env tsx
/**
 * Migration Script: Add authorInfo field to existing posts
 * 
 * This script migrates existing posts to include the new authorInfo structure
 * for E-E-A-T SEO compliance.
 * 
 * Run: npx tsx scripts/migrate-author-info.ts
 */

import 'dotenv/config';
import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';

interface OldPost {
  _id: ObjectId;
  author?: string; // Old author field (just a name)
  userId?: string; // Old user reference
}

async function migrateAuthorInfo() {
  console.log('🔄 Starting author info migration...\n');

  try {
    const { posts, authors, users } = await getCollections();

    // Count total posts
    const totalPosts = await posts.countDocuments();
    console.log(`📊 Found ${totalPosts} posts to migrate\n`);

    // Check if we have any authors
    const authorCount = await authors.countDocuments();
    
    if (authorCount === 0) {
      console.log('⚠️  No authors found in database.');
      console.log('💡 Creating a default author first...\n');
      
      // Create default author
      const defaultAuthor = {
        name: 'Admin',
        slug: 'admin',
        bio: 'Website administrator and content creator',
        type: 'staff',
        status: 'active',
        postCount: 0,
        reviewedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await authors.insertOne(defaultAuthor);
      console.log(`✅ Created default author with ID: ${result.insertedId}\n`);
    }

    // Get first active author as default
    const defaultAuthor = await authors.findOne({ status: 'active' });
    
    if (!defaultAuthor) {
      console.error('❌ No active author found. Please create an author first.');
      process.exit(1);
    }

    console.log(`📝 Using default author: ${defaultAuthor.name} (${defaultAuthor._id})\n`);

    // Migrate posts
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    const cursor = posts.find({});

    for await (const post of cursor) {
      try {
        // Skip if already has authorInfo
        if ((post as any).authorInfo) {
          console.log(`⏭️  Skipping post "${post.title}" - already has authorInfo`);
          skippedCount++;
          continue;
        }

        // Prepare authorInfo
        const authorInfo: any = {
          authorId: defaultAuthor._id.toString(),
          authorName: defaultAuthor.name,
        };

        // Try to match old author or userId to existing author
        const oldPost = post as any as OldPost;
        
        if (oldPost.author) {
          // Try to find author by name
          const matchedAuthor = await authors.findOne({
            name: { $regex: new RegExp(`^${oldPost.author}$`, 'i') },
          });

          if (matchedAuthor) {
            authorInfo.authorId = matchedAuthor._id.toString();
            authorInfo.authorName = matchedAuthor.name;
            console.log(`✓ Matched "${oldPost.author}" to author: ${matchedAuthor.name}`);
          }
        }

        if (oldPost.userId) {
          // Try to find author linked to this user
          const userAuthor = await authors.findOne({ userId: oldPost.userId });
          
          if (userAuthor) {
            authorInfo.authorId = userAuthor._id.toString();
            authorInfo.authorName = userAuthor.name;
            console.log(`✓ Matched userId to author: ${userAuthor.name}`);
          }
        }

        // Update post
        await posts.updateOne(
          { _id: post._id },
          {
            $set: {
              authorInfo,
            },
            $unset: {
              author: '', // Remove old author field
            },
          }
        );

        console.log(`✅ Migrated post: "${post.title}"`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrating post "${post.title}":`, error);
        errorCount++;
      }
    }

    // Update post counts for all authors
    console.log('\n🔄 Updating post counts for authors...');
    
    const allAuthors = await authors.find({}).toArray();
    
    for (const author of allAuthors) {
      const postCount = await posts.countDocuments({
        'authorInfo.authorId': author._id.toString(),
        status: 'published',
      });

      const reviewedCount = await posts.countDocuments({
        'authorInfo.reviewerId': author._id.toString(),
        status: 'published',
      });

      await authors.updateOne(
        { _id: author._id },
        {
          $set: {
            postCount,
            reviewedCount,
          },
        }
      );

      console.log(`✅ Updated ${author.name}: ${postCount} posts, ${reviewedCount} reviewed`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`Total posts: ${totalPosts}`);
    console.log(`✅ Migrated: ${migratedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(50));

    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the logs.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateAuthorInfo()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

