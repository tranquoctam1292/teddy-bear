#!/usr/bin/env node
/**
 * Count TypeScript Errors
 * Track progress on fixing type errors
 */

const { execSync } = require('child_process');

console.log('📊 Counting TypeScript errors...\n');

try {
  execSync('npx tsc --noEmit', {
    stdio: 'pipe',
    cwd: process.cwd(),
  });

  console.log('✅ Zero TypeScript errors!');
  console.log('🎉 Perfect type safety achieved!\n');
} catch (error) {
  const output = error.stdout?.toString() || '';
  const lines = output.split('\n');

  // Count error lines
  const errors = lines.filter((line) => line.includes('error TS'));
  const errorCount = errors.length;

  // Group by file
  const fileErrors = {};
  errors.forEach((line) => {
    const match = line.match(/^(.+?)\(\d+,\d+\): error/);
    if (match) {
      const file = match[1];
      fileErrors[file] = (fileErrors[file] || 0) + 1;
    }
  });

  console.log(`❌ Found ${errorCount} TypeScript errors\n`);

  console.log('📁 Errors by file:');
  Object.entries(fileErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([file, count]) => {
      console.log(`   ${count.toString().padStart(3)} errors - ${file}`);
    });

  if (Object.keys(fileErrors).length > 10) {
    console.log(`   ... and ${Object.keys(fileErrors).length - 10} more files`);
  }

  console.log('\n💡 Tip: Fix highest-count files first for maximum impact!');
  console.log('📚 See: TYPESCRIPT_PREVENTION_GUIDE.md\n');
}
