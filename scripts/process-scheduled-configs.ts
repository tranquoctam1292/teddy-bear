// Cron Job: Process Scheduled Homepage Configurations
import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

/**
 * Process scheduled configurations
 * Run this script every minute via cron job or Vercel Cron
 */
async function processScheduledConfigs() {
  console.log('🕐 Processing scheduled configurations...');
  const now = new Date();

  try {
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // 1. Find configs that should be published
    const configsToPublish = await homepageConfigs
      .find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
      })
      .toArray();

    console.log(`Found ${configsToPublish.length} configs to publish`);

    for (const config of configsToPublish) {
      try {
        console.log(`Publishing config: ${config.name}`);

        // Unpublish all other configs
        await homepageConfigs.updateMany(
          { status: 'published' },
          {
            $set: {
              status: 'archived',
              archivedAt: now,
            },
          }
        );

        // Publish this config
        await homepageConfigs.updateOne(
          { _id: config._id },
          {
            $set: {
              status: 'published',
              publishedAt: now,
              updatedAt: now,
            },
            $inc: { version: 1 },
          }
        );

        // Revalidate homepage
        // Note: In production, trigger webhook or use Vercel's revalidate API
        console.log(`✓ Published: ${config.name}`);
      } catch (error) {
        console.error(`Error publishing config ${config.name}:`, error);
      }
    }

    // 2. Find configs that should expire
    const configsToExpire = await homepageConfigs
      .find({
        status: 'published',
        expiresAt: { $lte: now },
      })
      .toArray();

    console.log(`Found ${configsToExpire.length} configs to expire`);

    for (const config of configsToExpire) {
      try {
        console.log(`Expiring config: ${config.name}`);

        // Archive expired config
        await homepageConfigs.updateOne(
          { _id: config._id },
          {
            $set: {
              status: 'archived',
              archivedAt: now,
              updatedAt: now,
            },
          }
        );

        // Publish previous config (if exists)
        // Or revert to default
        console.log(`✓ Expired: ${config.name}`);
      } catch (error) {
        console.error(`Error expiring config ${config.name}:`, error);
      }
    }

    console.log('✅ Scheduled processing complete');
    return {
      published: configsToPublish.length,
      expired: configsToExpire.length,
    };
  } catch (error) {
    console.error('Error processing scheduled configs:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  processScheduledConfigs()
    .then((result) => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { processScheduledConfigs };

