/**
 * Migration Script: SEO Management Center Collections
 * 
 * This script initializes the SEO Management Center collections
 * and creates default settings if they don't exist.
 * 
 * Usage: npx tsx scripts/migrate-seo-collections.ts
 */

import 'dotenv/config';
import { getDatabase } from '../src/lib/db';
import { DEFAULT_SEO_SETTINGS } from '../src/lib/schemas/seo-settings';
import { ObjectId } from 'mongodb';

async function migrateSEOCollections() {
  try {
    console.log('🚀 Starting SEO Management Center migration...\n');

    const db = await getDatabase();
    
    // 1. Create indexes for seoAnalysis collection
    console.log('📊 Creating indexes for seoAnalysis...');
    const seoAnalysis = db.collection('seoAnalysis');
    await seoAnalysis.createIndex({ entityType: 1, entityId: 1 }, { unique: true });
    await seoAnalysis.createIndex({ entitySlug: 1 });
    await seoAnalysis.createIndex({ analyzedAt: -1 });
    await seoAnalysis.createIndex({ overallScore: -1 });
    console.log('✅ seoAnalysis indexes created');

    // 2. Create indexes for keywordTracking collection
    console.log('🔑 Creating indexes for keywordTracking...');
    const keywordTracking = db.collection('keywordTracking');
    await keywordTracking.createIndex({ keyword: 1, entityType: 1, entityId: 1 }, { unique: true });
    await keywordTracking.createIndex({ status: 1 });
    await keywordTracking.createIndex({ trackedAt: -1 });
    await keywordTracking.createIndex({ currentRank: 1 });
    console.log('✅ keywordTracking indexes created');

    // 3. Create indexes for redirectRules collection
    console.log('🔄 Creating indexes for redirectRules...');
    const redirectRules = db.collection('redirectRules');
    await redirectRules.createIndex({ source: 1 }, { unique: true });
    await redirectRules.createIndex({ status: 1 });
    await redirectRules.createIndex({ priority: -1 });
    await redirectRules.createIndex({ createdAt: -1 });
    console.log('✅ redirectRules indexes created');

    // 4. Create indexes for error404Log collection
    console.log('❌ Creating indexes for error404Log...');
    const error404Log = db.collection('error404Log');
    await error404Log.createIndex({ normalizedUrl: 1 }, { unique: true });
    await error404Log.createIndex({ status: 1 });
    await error404Log.createIndex({ count: -1 });
    await error404Log.createIndex({ lastSeen: -1 });
    await error404Log.createIndex({ resolved: 1 });
    console.log('✅ error404Log indexes created');

    // 5. Initialize default SEO Settings
    console.log('\n⚙️  Initializing default SEO Settings...');
    const seoSettings = db.collection('seoSettings');
    const existingSettings = await seoSettings.findOne({ id: 'global' });
    
    if (!existingSettings) {
      const defaultSettings = {
        id: 'global',
        siteName: 'The Emotional House',
        siteDescription: 'Cửa hàng gấu bông với tình yêu và cảm xúc. Sản phẩm chất lượng cao, nhiều kích thước và dịch vụ gói quà.',
        siteKeywords: ['gấu bông', 'teddy bear', 'quà tặng', 'gấu bông cao cấp'],
        ...DEFAULT_SEO_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await seoSettings.insertOne(defaultSettings);
      console.log('✅ Default SEO Settings created');
    } else {
      console.log('ℹ️  SEO Settings already exists, skipping...');
    }

    // 6. Create default robots.txt entry in settings if not exists
    if (!existingSettings || !existingSettings.robotsTxtContent) {
      const defaultRobotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn'}/sitemap.xml`;

      await seoSettings.updateOne(
        { id: 'global' },
        {
          $set: {
            robotsTxtContent: defaultRobotsTxt,
            robotsTxtSitemapUrl: '/sitemap.xml',
            updatedAt: new Date(),
          },
        }
      );
      console.log('✅ Default robots.txt content added');
    }

    console.log('\n✨ SEO Management Center migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - seoAnalysis collection: ✅');
    console.log('  - keywordTracking collection: ✅');
    console.log('  - seoSettings collection: ✅');
    console.log('  - redirectRules collection: ✅');
    console.log('  - error404Log collection: ✅');
    console.log('  - Default settings initialized: ✅');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateSEOCollections();





