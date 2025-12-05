/**
 * Environment Variables Verification Script
 * 
 * Run: npx tsx scripts/verify-env.ts
 * 
 * Checks all required environment variables for Teddy Shop
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

interface EnvCheck {
  name: string;
  required: boolean;
  value?: string;
  isValid: boolean;
  message: string;
}

const checks: EnvCheck[] = [];

// Check AUTH_SECRET
const authSecret = process.env.AUTH_SECRET;
checks.push({
  name: 'AUTH_SECRET',
  required: true,
  value: authSecret,
  isValid: !!authSecret && authSecret.length >= 32,
  message: authSecret
    ? authSecret.length < 32
      ? `AUTH_SECRET quá ngắn (${authSecret.length} chars, cần 32+)`
      : '✅ AUTH_SECRET hợp lệ'
    : '❌ AUTH_SECRET chưa được set',
});

// Check NEXT_PUBLIC_SITE_URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
checks.push({
  name: 'NEXT_PUBLIC_SITE_URL',
  required: true,
  value: siteUrl,
  isValid: !!siteUrl && (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')),
  message: siteUrl
    ? !siteUrl.startsWith('http')
      ? 'NEXT_PUBLIC_SITE_URL phải bắt đầu với http:// hoặc https://'
      : '✅ NEXT_PUBLIC_SITE_URL hợp lệ'
    : '❌ NEXT_PUBLIC_SITE_URL chưa được set',
});

// Check MONGODB_URI
const mongodbUri = process.env.MONGODB_URI;
checks.push({
  name: 'MONGODB_URI',
  required: true,
  value: mongodbUri ? `${mongodbUri.substring(0, 20)}...` : undefined,
  isValid: !!mongodbUri && mongodbUri.startsWith('mongodb'),
  message: mongodbUri
    ? '✅ MONGODB_URI hợp lệ'
    : '❌ MONGODB_URI chưa được set',
});

// Check ADMIN_EMAIL
const adminEmail = process.env.ADMIN_EMAIL;
checks.push({
  name: 'ADMIN_EMAIL',
  required: true,
  value: adminEmail,
  isValid: !!adminEmail && adminEmail.includes('@'),
  message: adminEmail
    ? '✅ ADMIN_EMAIL hợp lệ'
    : '❌ ADMIN_EMAIL chưa được set',
});

// Check ADMIN_PASSWORD
const adminPassword = process.env.ADMIN_PASSWORD;
checks.push({
  name: 'ADMIN_PASSWORD',
  required: true,
  value: adminPassword ? '***' : undefined,
  isValid: !!adminPassword && adminPassword.length >= 6,
  message: adminPassword
    ? adminPassword.length < 6
      ? `ADMIN_PASSWORD quá ngắn (cần 6+ ký tự)`
      : '✅ ADMIN_PASSWORD hợp lệ'
    : '❌ ADMIN_PASSWORD chưa được set',
});

// Check NEXTAUTH_URL (optional but recommended)
const nextAuthUrl = process.env.NEXTAUTH_URL;
checks.push({
  name: 'NEXTAUTH_URL',
  required: false,
  value: nextAuthUrl,
  isValid: !nextAuthUrl || nextAuthUrl.startsWith('http'),
  message: nextAuthUrl
    ? '✅ NEXTAUTH_URL hợp lệ'
    : '⚠️  NEXTAUTH_URL chưa được set (khuyến nghị)',
});

// Run checks
console.log('🔍 Kiểm tra Environment Variables...\n');
console.log('📁 File: .env.local\n');

let hasErrors = false;
let hasWarnings = false;

checks.forEach((check) => {
  const status = check.isValid ? '✅' : check.required ? '❌' : '⚠️';
  const required = check.required ? '(REQUIRED)' : '(OPTIONAL)';
  
  console.log(`${status} ${check.name} ${required}`);
  console.log(`   ${check.message}`);
  
  if (check.value && check.name !== 'ADMIN_PASSWORD') {
    console.log(`   Value: ${check.value}`);
  }
  console.log('');

  if (!check.isValid && check.required) {
    hasErrors = true;
  } else if (!check.isValid && !check.required) {
    hasWarnings = true;
  }
});

// Summary
console.log('─'.repeat(50));
if (hasErrors) {
  console.log('\n❌ CÓ LỖI: Một số biến môi trường bắt buộc chưa được set hoặc không hợp lệ!');
  console.log('\n📝 Hướng dẫn:');
  console.log('1. Tạo file .env.local trong project root');
  console.log('2. Thêm các biến theo mẫu:');
  console.log('');
  console.log('AUTH_SECRET=your-generated-secret-here');
  console.log('NEXT_PUBLIC_SITE_URL=http://localhost:3000');
  console.log('MONGODB_URI=mongodb://localhost:27017/teddy-shop');
  console.log('ADMIN_EMAIL=admin@emotionalhouse.vn');
  console.log('ADMIN_PASSWORD=your-password-here');
  console.log('');
  console.log('3. Generate AUTH_SECRET:');
  console.log('   Windows: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))');
  console.log('   Linux/Mac: openssl rand -base64 32');
  console.log('');
  console.log('4. Restart dev server: npm run dev');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  CẢNH BÁO: Một số biến môi trường tùy chọn chưa được set.');
  console.log('   Có thể tiếp tục, nhưng một số tính năng có thể không hoạt động.');
  process.exit(0);
} else {
  console.log('\n✅ TẤT CẢ BIẾN MÔI TRƯỜNG ĐÃ ĐƯỢC SET ĐÚNG!');
  console.log('\n🚀 Bạn có thể chạy: npm run dev');
  process.exit(0);
}

