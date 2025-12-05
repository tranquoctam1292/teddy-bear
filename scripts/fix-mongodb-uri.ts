/**
 * Fix MongoDB URI Format
 * 
 * Run: npx tsx scripts/fix-mongodb-uri.ts
 * 
 * This script helps identify and fix common MongoDB URI format issues
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI || '';

console.log('🔍 Analyzing MongoDB URI Format...\n');
console.log('─'.repeat(60));

if (!uri) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

console.log('Current URI (masked):');
console.log(`   ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
console.log('');

// Detect common issues
const issues: string[] = [];
const fixes: string[] = [];

// Issue 1: Duplicate mongodb+srv:// prefix
if (uri.includes('mongodb+srv://mongodb+srv://')) {
  issues.push('❌ Duplicate "mongodb+srv://" prefix detected');
  const fixed = uri.replace('mongodb+srv://mongodb+srv://', 'mongodb+srv://');
  fixes.push(`✅ Fixed: ${fixed.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
}

// Issue 2: Contains <db_password> placeholder
if (uri.includes('<db_password>')) {
  issues.push('❌ Contains placeholder "<db_password>" - must replace with actual password');
  fixes.push('✅ Replace <db_password> with your actual database password');
}

// Issue 2.5: Double @@ (password contains @ without encoding)
if (uri.includes('@@')) {
  issues.push('❌ Double "@@" detected - password may contain "@" character that needs URL encoding');
  fixes.push('✅ URL-encode password: "@" → "%40"');
  fixes.push('   Example: password@123 → password%40123');
}

// Issue 3: Contains port number (mongodb+srv should not have port)
if (uri.includes('mongodb+srv://') && uri.match(/:\d+\//)) {
  issues.push('❌ mongodb+srv:// URI cannot have port number');
  const fixed = uri.replace(/:\d+\//, '/');
  fixes.push(`✅ Fixed: ${fixed.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
}

// Issue 4: Missing database name
if (uri.includes('mongodb+srv://') && !uri.match(/\.mongodb\.net\/[^?]/)) {
  issues.push('❌ Missing database name (should be: ...mongodb.net/teddy-shop)');
  fixes.push('✅ Add database name: ...mongodb.net/teddy-shop?retryWrites=true&w=majority');
}

// Issue 5: Wrong format (mongodb:// instead of mongodb+srv://)
if (uri.startsWith('mongodb://') && uri.includes('mongodb.net')) {
  issues.push('❌ Using mongodb:// instead of mongodb+srv:// for Atlas');
  const fixed = uri.replace('mongodb://', 'mongodb+srv://');
  fixes.push(`✅ Fixed: ${fixed.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
}

// Issue 6: Missing query parameters
if (uri.includes('mongodb+srv://') && !uri.includes('retryWrites')) {
  issues.push('⚠️  Missing query parameters (recommended: ?retryWrites=true&w=majority)');
  fixes.push('✅ Add query parameters: ...mongodb.net/teddy-shop?retryWrites=true&w=majority');
}

// Issue 7: Typo in write concern (majorit instead of majority)
if (uri.includes('w=majorit') && !uri.includes('w=majority')) {
  issues.push('❌ Typo in write concern: "majorit" should be "majority"');
  const fixed = uri.replace('w=majorit', 'w=majority');
  fixes.push(`✅ Fixed: ${fixed.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
}

// Display results
if (issues.length === 0) {
  console.log('✅ No format issues detected!');
  console.log('');
  console.log('If connection still fails, check:');
  console.log('   1. Username and password are correct');
  console.log('   2. Network Access is configured (IP whitelist)');
  console.log('   3. Cluster is running (not paused)');
} else {
  console.log('❌ Issues Found:\n');
  issues.forEach((issue, idx) => {
    console.log(`   ${idx + 1}. ${issue}`);
  });
  console.log('');
  console.log('🔧 Suggested Fixes:\n');
  fixes.forEach((fix, idx) => {
    console.log(`   ${fix}`);
  });
  console.log('');
  console.log('─'.repeat(60));
  console.log('');
  console.log('📝 Correct Format Example:');
  console.log('');
  console.log('   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/teddy-shop?retryWrites=true&w=majority');
  console.log('');
  console.log('⚠️  Replace:');
  console.log('   - admin → your database username');
  console.log('   - YOUR_PASSWORD → your database password');
  console.log('   - cluster0.xxxxx → your actual cluster URL');
  console.log('   - teddy-shop → database name (keep this)');
}

console.log('');
console.log('💡 Next Steps:');
console.log('   1. Fix the URI in .env.local file');
console.log('   2. Run: npm run test:mongodb');
console.log('   3. Verify connection succeeds');

