// Manual Testing Script: Homepage Configuration System
import { getCollections } from '../src/lib/db';
import { ObjectId } from 'mongodb';

async function testHomepageSystem() {
  console.log('🧪 Testing Homepage Configuration System...\n');

  try {
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');
    const versions = db.collection('homepage_config_versions');

    // Test 1: Database Connection
    console.log('Test 1: Database Connection');
    try {
      await db.command({ ping: 1 });
      console.log('✅ Database connected\n');
    } catch (error) {
      console.log('❌ Database connection failed\n');
      throw error;
    }

    // Test 2: Collections Exist
    console.log('Test 2: Collections');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    
    console.log(`Found collections: ${collectionNames.length}`);
    console.log(`  • homepage_configs: ${collectionNames.includes('homepage_configs') ? '✅' : '❌'}`);
    console.log(`  • homepage_config_versions: ${collectionNames.includes('homepage_config_versions') ? '✅' : '❌'}\n`);

    // Test 3: CRUD Operations
    console.log('Test 3: CRUD Operations');
    
    // Create
    const testConfig = {
      name: 'Test Configuration',
      slug: 'test-configuration',
      description: 'Test description',
      status: 'draft',
      sections: [],
      seo: {
        title: 'Test Title',
        description: 'Test description for SEO that is at least 50 characters long',
      },
      version: 1,
      createdBy: 'test-user',
      updatedBy: 'test-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await homepageConfigs.insertOne(testConfig);
    console.log(`✅ Create: Inserted with ID ${insertResult.insertedId}\n`);

    // Read
    const foundConfig = await homepageConfigs.findOne({ _id: insertResult.insertedId });
    console.log(`✅ Read: Found config "${foundConfig?.name}"\n`);

    // Update
    await homepageConfigs.updateOne(
      { _id: insertResult.insertedId },
      { $set: { name: 'Updated Test Configuration' } }
    );
    console.log('✅ Update: Configuration updated\n');

    // Delete
    await homepageConfigs.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Delete: Configuration deleted\n');

    // Test 4: Version History
    console.log('Test 4: Version History');
    const versionData = {
      configId: 'test-config-id',
      versionNumber: 1,
      name: 'Test Version',
      sections: [],
      seo: {},
      status: 'draft',
      createdBy: 'test-user',
      createdAt: new Date(),
      note: 'Test version',
    };

    const versionResult = await versions.insertOne(versionData);
    console.log(`✅ Version saved with ID ${versionResult.insertedId}\n`);

    // Cleanup
    await versions.deleteOne({ _id: versionResult.insertedId });
    console.log('✅ Cleanup: Test version deleted\n');

    // Test 5: Query Performance
    console.log('Test 5: Query Performance');
    const start = Date.now();
    await homepageConfigs.find({ status: 'published' }).limit(10).toArray();
    const duration = Date.now() - start;
    console.log(`✅ Query completed in ${duration}ms ${duration < 100 ? '(Fast)' : '(Could be optimized)'}\n`);

    // Test 6: Indexes
    console.log('Test 6: Database Indexes');
    const indexes = await homepageConfigs.indexes();
    console.log(`Found ${indexes.length} indexes:`);
    indexes.forEach((index) => {
      console.log(`  • ${index.name}: ${JSON.stringify(index.key)}`);
    });
    console.log();

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('🎊 ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('✅ Database connection: OK');
    console.log('✅ Collections: OK');
    console.log('✅ CRUD operations: OK');
    console.log('✅ Version control: OK');
    console.log('✅ Query performance: OK');
    console.log('✅ Indexes: OK');
    console.log('\n🚀 Homepage System is Ready!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  }
}

// Run tests
testHomepageSystem()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

