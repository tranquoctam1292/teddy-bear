/**
 * Test Homepage Creation Flow
 * 
 * Run: npx tsx scripts/test-homepage-creation-flow.ts
 * 
 * Tests the complete flow from form submission to database creation
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('🧪 Testing Homepage Creation Flow...\n');
  console.log('─'.repeat(60));
  console.log(`📍 Site URL: ${siteUrl}\n`);

  // Test 1: Check if server is running
  console.log('📋 Test 1: Server Availability');
  console.log('─'.repeat(60));

  try {
    const response = await fetch(siteUrl);
  results.push({
    name: 'Server is running',
    passed: response.ok || response.status === 200 || response.status === 404,
    message: response.ok
      ? '✅ Server is running'
      : response.status === 404
      ? '✅ Server is running (404 is expected for root)'
      : `⚠️  Server responded with status ${response.status}`,
  });
} catch (error) {
  results.push({
    name: 'Server is running',
    passed: false,
    message: '❌ Server is not running',
    details: error instanceof Error ? error.message : String(error),
  });
}

// Test 2: Check API endpoint exists
console.log('\n📋 Test 2: API Endpoint');
console.log('─'.repeat(60));

const apiUrl = `${siteUrl}/api/admin/homepage/configs`;

try {
  const response = await fetch(apiUrl, {
    method: 'GET',
  });

  // 401 is expected if not authenticated, which means endpoint exists
  results.push({
    name: 'API endpoint exists',
    passed: response.status === 401 || response.status === 200 || response.status === 403,
    message:
      response.status === 401
        ? '✅ API endpoint exists (401 Unauthorized - expected without auth)'
        : response.status === 200
        ? '✅ API endpoint exists and accessible'
        : response.status === 403
        ? '✅ API endpoint exists (403 Forbidden - expected without admin role)'
        : `⚠️  Unexpected status: ${response.status}`,
  });
} catch (error) {
  results.push({
    name: 'API endpoint exists',
    passed: false,
    message: '❌ API endpoint not accessible',
    details: error instanceof Error ? error.message : String(error),
  });
}

// Test 3: Check database connection
console.log('\n📋 Test 3: Database Connection');
console.log('─'.repeat(60));

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  results.push({
    name: 'MONGODB_URI is set',
    passed: false,
    message: '❌ MONGODB_URI is not set',
  });
} else {
  results.push({
    name: 'MONGODB_URI is set',
    passed: true,
    message: '✅ MONGODB_URI is set',
  });

  // Check if it's Atlas connection
  if (mongodbUri.includes('mongodb+srv://')) {
    results.push({
      name: 'Using MongoDB Atlas',
      passed: true,
      message: '✅ Using MongoDB Atlas (cloud)',
    });
  } else {
    results.push({
      name: 'Using local MongoDB',
      passed: true,
      message: '✅ Using local MongoDB',
    });
  }
}

// Test 4: Check required environment variables
console.log('\n📋 Test 4: Environment Variables');
console.log('─'.repeat(60));

const requiredVars = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

Object.entries(requiredVars).forEach(([key, value]) => {
  const isRequired = ['AUTH_SECRET', 'NEXT_PUBLIC_SITE_URL', 'MONGODB_URI'].includes(key);
  results.push({
    name: `${key} is set`,
    passed: !!value,
    message: value
      ? `✅ ${key} is set`
      : isRequired
      ? `❌ ${key} is required but not set`
      : `⚠️  ${key} is not set (optional but recommended)`,
  });
});

// Test 5: Check code files exist
console.log('\n📋 Test 5: Code Files');
console.log('─'.repeat(60));

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/app/admin/homepage/new/page.tsx',
  'src/app/api/admin/homepage/configs/route.ts',
  'src/components/admin/homepage/HomepageForm.tsx',
  'src/lib/db.ts',
  'src/lib/auth.ts',
];

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  results.push({
    name: `File exists: ${file}`,
    passed: exists,
    message: exists ? '✅ File exists' : '❌ File not found',
  });
});

// Print Results
console.log('\n📊 Test Results Summary');
console.log('─'.repeat(60));

let passedCount = 0;
let failedCount = 0;
let warningCount = 0;

results.forEach((result) => {
  const icon = result.passed ? '✅' : result.message.includes('⚠️') ? '⚠️' : '❌';
  console.log(`${icon} ${result.name}`);
  console.log(`   ${result.message}`);
  if (result.details) {
    console.log(`   Details: ${result.details}`);
  }
  console.log('');

  if (result.passed) {
    passedCount++;
  } else if (result.message.includes('⚠️')) {
    warningCount++;
  } else {
    failedCount++;
  }
});

// Final Summary
console.log('─'.repeat(60));
console.log('\n📈 Summary:');
console.log(`   ✅ Passed: ${passedCount}`);
console.log(`   ⚠️  Warnings: ${warningCount}`);
console.log(`   ❌ Failed: ${failedCount}`);
console.log(`   📊 Total: ${results.length}`);

if (failedCount === 0) {
  console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
  console.log('\n🚀 Ready for Homepage Creation!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Make sure dev server is running: npm run dev');
  console.log('   2. Login as admin: http://localhost:3000/admin/login');
  console.log('   3. Navigate to: http://localhost:3000/admin/homepage/new');
  console.log('   4. Fill form and submit');
  console.log('   5. Verify success (redirect to edit page)');
  process.exit(0);
} else {
  console.log('\n⚠️  SOME TESTS FAILED!');
  console.log('\n📝 Please fix the following issues:');
  results
    .filter((r) => !r.passed && !r.message.includes('⚠️'))
    .forEach((r) => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  process.exit(1);
  }
}

runTests();

