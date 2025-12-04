/**
 * Seed Settings Data Script
 * 
 * Run: npx tsx scripts/seed-settings-data.ts
 * 
 * This script will seed initial data for:
 * - Product Categories
 * - Product Tags
 * - Order Statuses
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { getCollections } from '../src/lib/db';
import type { ProductCategory, ProductTag } from '../src/lib/schemas/product-settings';
import type { OrderStatus } from '../src/lib/schemas/order-settings';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedSettingsData() {
  try {
    console.log('🔄 Seeding settings data...');
    console.log('');

    const {
      productCategories,
      productTags,
      orderStatuses,
    } = await getCollections();

    // Seed Product Categories
    console.log('📦 Seeding product categories...');
    const existingCategories = await productCategories.countDocuments();
    if (existingCategories === 0) {
      const categories: ProductCategory[] = [
        {
          id: generateId('cat'),
          name: 'Gấu Teddy',
          slug: 'teddy',
          description: 'Gấu bông Teddy cổ điển và hiện đại',
          order: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('cat'),
          name: 'Capybara',
          slug: 'capybara',
          description: 'Gấu bông Capybara đáng yêu',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('cat'),
          name: 'Lotso',
          slug: 'lotso',
          description: 'Gấu bông Lotso từ Toy Story',
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('cat'),
          name: 'Kuromi',
          slug: 'kuromi',
          description: 'Gấu bông Kuromi dễ thương',
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('cat'),
          name: 'Cartoon',
          slug: 'cartoon',
          description: 'Gấu bông nhân vật hoạt hình',
          order: 4,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await productCategories.insertMany(categories);
      console.log(`✅ Inserted ${categories.length} product categories`);
    } else {
      console.log(`⏭️  Product categories already exist (${existingCategories} items). Skipping...`);
    }

    // Seed Product Tags
    console.log('🏷️  Seeding product tags...');
    const existingTags = await productTags.countDocuments();
    if (existingTags === 0) {
      const tags: ProductTag[] = [
        {
          id: generateId('tag'),
          name: 'Best Seller',
          slug: 'best-seller',
          color: '#ef4444',
          description: 'Sản phẩm bán chạy nhất',
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('tag'),
          name: 'Birthday',
          slug: 'birthday',
          color: '#f59e0b',
          description: 'Quà tặng sinh nhật',
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('tag'),
          name: 'Valentine',
          slug: 'valentine',
          color: '#ec4899',
          description: 'Quà tặng Valentine',
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('tag'),
          name: 'New',
          slug: 'new',
          color: '#10b981',
          description: 'Sản phẩm mới',
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await productTags.insertMany(tags);
      console.log(`✅ Inserted ${tags.length} product tags`);
    } else {
      console.log(`⏭️  Product tags already exist (${existingTags} items). Skipping...`);
    }

    // Seed Order Statuses
    console.log('📋 Seeding order statuses...');
    const existingStatuses = await orderStatuses.countDocuments();
    if (existingStatuses === 0) {
      const statuses: OrderStatus[] = [
        {
          id: generateId('status'),
          name: 'Chờ xử lý',
          slug: 'pending',
          color: '#f59e0b',
          order: 0,
          isDefault: true,
          canTransitionTo: ['confirmed', 'cancelled'],
          sendNotification: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('status'),
          name: 'Đã xác nhận',
          slug: 'confirmed',
          color: '#3b82f6',
          order: 1,
          isDefault: false,
          canTransitionTo: ['shipping', 'cancelled'],
          sendNotification: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('status'),
          name: 'Đang giao hàng',
          slug: 'shipping',
          color: '#8b5cf6',
          order: 2,
          isDefault: false,
          canTransitionTo: ['delivered', 'cancelled'],
          sendNotification: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('status'),
          name: 'Đã giao hàng',
          slug: 'delivered',
          color: '#10b981',
          order: 3,
          isDefault: false,
          canTransitionTo: [],
          sendNotification: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: generateId('status'),
          name: 'Đã hủy',
          slug: 'cancelled',
          color: '#ef4444',
          order: 4,
          isDefault: false,
          canTransitionTo: [],
          sendNotification: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await orderStatuses.insertMany(statuses);
      console.log(`✅ Inserted ${statuses.length} order statuses`);
    } else {
      console.log(`⏭️  Order statuses already exist (${existingStatuses} items). Skipping...`);
    }

    console.log('');
    console.log('✅ Settings data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Settings data seeding failed:');
    console.error(error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in .env.local');
    console.error('   3. Run: npm run test:db');
    process.exit(1);
  }
}

seedSettingsData();



