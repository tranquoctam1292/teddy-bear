/**
 * Migration Script: Import mock data into MongoDB
 * 
 * Run this script once to populate database with initial data:
 * npx tsx scripts/migrate-mock-data.ts
 * 
 * Or use: npm run migrate (add to package.json scripts)
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { getCollections } from '../src/lib/db';
import { mockProducts } from '../src/lib/data/products';
import { mockOrders } from '../src/lib/data/orders';
import { mockContacts } from '../src/lib/data/contacts';
import { mockPosts } from '../src/lib/data/posts';
import { mockMenus } from '../src/lib/data/navigation';

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');

    const { products, orders, contacts, posts, navigation } = await getCollections();

    // Migrate Products
    console.log('📦 Migrating products...');
    const existingProducts = await products.countDocuments();
    if (existingProducts === 0) {
      // Map basePrice to minPrice for compatibility
      const productsToInsert = mockProducts.map((p) => ({
        ...p,
        minPrice: p.basePrice,
        id: p.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      }));
      await products.insertMany(productsToInsert);
      console.log(`✅ Inserted ${productsToInsert.length} products`);
    } else {
      console.log(`⏭️  Products already exist (${existingProducts} items). Skipping...`);
    }

    // Migrate Orders
    console.log('📋 Migrating orders...');
    const existingOrders = await orders.countDocuments();
    if (existingOrders === 0) {
      await orders.insertMany(mockOrders);
      console.log(`✅ Inserted ${mockOrders.length} orders`);
    } else {
      console.log(`⏭️  Orders already exist (${existingOrders} items). Skipping...`);
    }

    // Migrate Contacts
    console.log('📧 Migrating contacts...');
    const existingContacts = await contacts.countDocuments();
    if (existingContacts === 0) {
      await contacts.insertMany(mockContacts);
      console.log(`✅ Inserted ${mockContacts.length} contacts`);
    } else {
      console.log(`⏭️  Contacts already exist (${existingContacts} items). Skipping...`);
    }

    // Migrate Posts
    console.log('📝 Migrating posts...');
    const existingPosts = await posts.countDocuments();
    if (existingPosts === 0) {
      await posts.insertMany(mockPosts);
      console.log(`✅ Inserted ${mockPosts.length} posts`);
    } else {
      console.log(`⏭️  Posts already exist (${existingPosts} items). Skipping...`);
    }

    // Migrate Navigation
    console.log('🧭 Migrating navigation...');
    const existingMenus = await navigation.countDocuments();
    if (existingMenus === 0) {
      await navigation.insertMany(mockMenus);
      console.log(`✅ Inserted ${mockMenus.length} navigation menus`);
    } else {
      console.log(`⏭️  Navigation already exists (${existingMenus} items). Skipping...`);
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();

