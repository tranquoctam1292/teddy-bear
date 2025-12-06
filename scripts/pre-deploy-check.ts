/**
 * Pre-Deployment Check Script
 * Kiểm tra các chỉ số sức khỏe của dự án trước khi deploy
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface CheckResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const results: CheckResult[] = [];

/**
 * Run a command and capture output
 */
function runCommand(command: string, description: string): CheckResult {
  const startTime = Date.now();
  console.log(`\n${colors.cyan}▶ ${description}...${colors.reset}`);

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '..'),
    });
    const duration = Date.now() - startTime;
    console.log(`${colors.green}✓ ${description} - PASSED${colors.reset} (${duration}ms)`);
    return { name: description, passed: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.log(
      `${colors.red}✗ ${description} - FAILED${colors.reset} (${duration}ms)`
    );
    console.log(`${colors.red}Error: ${errorMessage}${colors.reset}`);
    return { name: description, passed: false, duration, error: errorMessage };
  }
}

/**
 * Check if required files exist
 */
function checkRequiredFiles(): CheckResult {
  const startTime = Date.now();
  console.log(`\n${colors.cyan}▶ Checking required files...${colors.reset}`);

  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.ts',
    '.env.example',
  ];

  const missingFiles: string[] = [];

  for (const file of requiredFiles) {
    if (!existsSync(resolve(__dirname, '..', file))) {
      missingFiles.push(file);
    }
  }

  const duration = Date.now() - startTime;

  if (missingFiles.length > 0) {
    console.log(
      `${colors.red}✗ Required files check - FAILED${colors.reset} (${duration}ms)`
    );
    console.log(`${colors.red}Missing files: ${missingFiles.join(', ')}${colors.reset}`);
    return {
      name: 'Required files check',
      passed: false,
      duration,
      error: `Missing files: ${missingFiles.join(', ')}`,
    };
  }

  console.log(
    `${colors.green}✓ Required files check - PASSED${colors.reset} (${duration}ms)`
  );
  return { name: 'Required files check', passed: true, duration };
}

/**
 * Main execution
 */
function main() {
  console.log(
    `${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}║     Pre-Deployment Check - Teddy Shop                  ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}╚════════════════════════════════════════════════════════╝${colors.reset}`
  );

  // 1. Check required files
  results.push(checkRequiredFiles());

  // 2. Type Check
  results.push(
    runCommand('npm run type-check', 'TypeScript Type Check')
  );

  // 3. Lint Check
  results.push(runCommand('npm run lint', 'ESLint Check'));

  // 4. Test Check
  results.push(runCommand('npm run test:run', 'Unit Tests'));

  // 5. Build Check
  const buildStartTime = Date.now();
  console.log(`\n${colors.cyan}▶ Production Build Check...${colors.reset}`);
  try {
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: resolve(__dirname, '..'),
      env: {
        ...process.env,
        // Set dummy env vars for build check (if not set)
        AUTH_SECRET:
          process.env.AUTH_SECRET ||
          'dGVtcF9idWlsZF9zZWNyZXRfcmVwbGFjZV9hdF9ydW50aW1lXzEyMzQ1Njc4OTA=',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        MONGODB_URI:
          process.env.MONGODB_URI || 'mongodb://localhost:27017/teddy-shop',
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    });
    const buildDuration = Date.now() - buildStartTime;
    console.log(
      `${colors.green}✓ Production Build Check - PASSED${colors.reset} (${buildDuration}ms)`
    );
    results.push({
      name: 'Production Build Check',
      passed: true,
      duration: buildDuration,
    });
  } catch (error) {
    const buildDuration = Date.now() - buildStartTime;
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.log(
      `${colors.red}✗ Production Build Check - FAILED${colors.reset} (${buildDuration}ms)`
    );
    console.log(`${colors.red}Error: ${errorMessage}${colors.reset}`);
    results.push({
      name: 'Production Build Check',
      passed: false,
      duration: buildDuration,
      error: errorMessage,
    });
  }

  // Summary
  console.log(
    `\n${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}║                    Summary Report                        ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}╚════════════════════════════════════════════════════════╝${colors.reset}`
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n${colors.bright}Total Checks: ${results.length}${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  }
  console.log(`Total Duration: ${totalDuration}ms\n`);

  // Detailed results
  console.log(`${colors.bright}Detailed Results:${colors.reset}\n`);
  results.forEach((result) => {
    const status = result.passed
      ? `${colors.green}✓ PASS${colors.reset}`
      : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(
      `  ${status} - ${result.name} (${result.duration}ms)`
    );
    if (result.error) {
      console.log(`    ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });

  // Final verdict
  console.log(`\n${colors.bright}${'='.repeat(60)}${colors.reset}`);
  if (failed === 0) {
    console.log(
      `${colors.bright}${colors.green}✅ READY TO DEPLOY${colors.reset}`
    );
    console.log(
      `${colors.green}All checks passed! Your code is ready for production.${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(
      `${colors.bright}${colors.red}❌ FIX REQUIRED${colors.reset}`
    );
    console.log(
      `${colors.red}Please fix the failed checks before deploying.${colors.reset}\n`
    );
    process.exit(1);
  }
}

// Run main function
main();




