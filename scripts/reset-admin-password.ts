/**
 * Reset Admin Password Script
 * 
 * Run: npx tsx scripts/reset-admin-password.ts
 * 
 * This script will:
 * 1. Check if admin user exists in database
 * 2. Update or create admin user with password from .env.local
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { getCollections } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    // ✅ SECURITY: No fallback credentials - MUST be set in .env.local
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('');
      console.error('❌ ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
      console.error('');
      console.error('🔧 Fix:');
      console.error('   1. Create .env.local file (copy from .env.example)');
      console.error('   2. Set ADMIN_EMAIL and ADMIN_PASSWORD');
      console.error('   3. Run this script again');
      console.error('');
      process.exit(1);
    }
    
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword.substring(0, 3)}***`);
    console.log('');

    const { users } = await getCollections();
    
    // Check if admin user exists
    const existingAdmin = await users.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Found existing admin user');
      console.log(`   Current password hash: ${existingAdmin.password?.substring(0, 20)}...`);
    } else {
      console.log('⚠️  Admin user not found, will create new one');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log(`🔐 Generated password hash: ${hashedPassword.substring(0, 20)}...`);
    console.log('');

    // Update or create admin user
    const result = await users.updateOne(
      { email: adminEmail },
      {
        $set: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          role: 'admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ Admin user created successfully!');
    } else if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('ℹ️  Admin user already exists with same password');
    }

    console.log('');
    console.log('📋 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('✅ Done! You can now login with these credentials.');

    process.exit(0);
  } catch (error: any) {
    console.error('');
    console.error('❌ Error resetting admin password:');
    console.error(error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in .env.local');
    console.error('   3. Run: npm run test:db');
    process.exit(1);
  }
}

resetAdminPassword();


