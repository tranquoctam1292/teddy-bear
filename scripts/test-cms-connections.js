#!/usr/bin/env node
/**
 * Test CMS to Frontend Connections
 * Verifies all API endpoints are properly connected
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('🔗 Testing CMS to Frontend Connections...');
console.log(`📍 Base URL: ${BASE_URL}\n`);

const tests = [
  {
    name: 'Products API (Public)',
    url: `${BASE_URL}/api/products`,
    expected: 'products',
  },
  {
    name: 'Posts API (Public)',
    url: `${BASE_URL}/api/posts?status=published`,
    expected: 'posts',
  },
  {
    name: 'Navigation API (Public)',
    url: `${BASE_URL}/api/navigation?location=main_header`,
    expected: 'menu',
  },
  {
    name: 'Appearance API (Public)',
    url: `${BASE_URL}/api/appearance`,
    expected: 'config',
  },
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const client = test.url.startsWith('https') ? https : http;

    client
      .get(test.url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const hasExpected = test.expected in json || (json.data && test.expected in json.data);

            if (res.statusCode === 200 && (hasExpected || json.success)) {
              console.log(`✅ ${test.name}`);
              console.log(`   Status: ${res.statusCode}`);
              console.log(`   Response: OK`);
              resolve(true);
            } else {
              console.log(`❌ ${test.name}`);
              console.log(`   Status: ${res.statusCode}`);
              console.log(`   Response: ${JSON.stringify(json).substring(0, 100)}...`);
              resolve(false);
            }
          } catch (error) {
            console.log(`❌ ${test.name}`);
            console.log(`   Error: Invalid JSON response`);
            resolve(false);
          }
          console.log('');
        });
      })
      .on('error', (error) => {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
        resolve(false);
      });
  });
}

async function runTests() {
  console.log('📊 Running connection tests...\n');

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test);
    results.push(result);
  }

  const passed = results.filter((r) => r).length;
  const failed = results.filter((r) => !r).length;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📈 RESULTS:`);
  console.log(`   ✅ Passed: ${passed}/${tests.length}`);
  console.log(`   ❌ Failed: ${failed}/${tests.length}`);
  console.log(`   📊 Success Rate: ${Math.round((passed / tests.length) * 100)}%\n`);

  if (passed === tests.length) {
    console.log('🎉 ALL CONNECTIONS WORKING!');
    console.log('✅ CMS to Frontend integration is perfect!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some connections failed.');
    console.log('🔧 Check the failed endpoints above.\n');
    console.log('💡 Tips:');
    console.log('   1. Make sure dev server is running: npm run dev');
    console.log('   2. Check MongoDB connection in .env.local');
    console.log('   3. Verify API routes exist');
    console.log('   4. Check database has data\n');
    process.exit(1);
  }
}

// Check if server is reachable first
console.log('🔍 Checking if server is reachable...');
const client = BASE_URL.startsWith('https') ? https : http;
client
  .get(BASE_URL, (res) => {
    console.log(`✅ Server is reachable (${res.statusCode})\n`);
    runTests();
  })
  .on('error', (error) => {
    console.log(`❌ Cannot reach server: ${error.message}`);
    console.log('\n💡 Start dev server first: npm run dev\n');
    process.exit(1);
  });





