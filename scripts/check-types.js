#!/usr/bin/env node
/**
 * TypeScript Error Checker
 * Runs tsc --noEmit and provides helpful error summary
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running TypeScript type check...\n');

try {
  execSync('npx tsc --noEmit --pretty', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log('\n✅ No TypeScript errors found!');
  console.log('🎉 All types are valid!\n');
  process.exit(0);
} catch (error) {
  console.log('\n❌ TypeScript errors detected!');
  console.log('\n🔧 Next steps:');
  console.log('   1. Review errors above');
  console.log('   2. Fix type issues');
  console.log('   3. Run: npm run type-check');
  console.log('   4. Commit when clean');
  console.log('\n📚 See: TYPESCRIPT_PREVENTION_GUIDE.md\n');
  process.exit(1);
}
