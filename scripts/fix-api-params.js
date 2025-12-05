// Fix Next.js 16 async params in all API routes
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/admin/marketing/coupons/[id]/route.ts',
  'src/app/api/admin/payments/[id]/refund/route.ts',
  'src/app/api/admin/payments/[id]/route.ts',
  'src/app/api/admin/comments/[id]/route.ts',
  'src/app/api/admin/pages/[id]/route.ts',
  'src/app/api/admin/media/[id]/route.ts',
  'src/app/api/admin/seo/404/[id]/route.ts',
  'src/app/api/admin/seo/redirects/[id]/route.ts',
  'src/app/api/admin/products/[id]/route.ts',
  'src/app/api/admin/posts/[id]/route.ts',
  'src/app/api/admin/seo/keywords/[id]/route.ts',
  'src/app/api/admin/seo/analysis/[id]/route.ts',
  'src/app/api/admin/settings/email-templates/[id]/route.ts',
  'src/app/api/admin/settings/users/[id]/route.ts',
  'src/app/api/admin/settings/users/[id]/activity/route.ts',
  'src/app/api/admin/settings/payment-methods/[id]/route.ts',
  'src/app/api/admin/settings/categories/[id]/route.ts',
  'src/app/api/admin/settings/tags/[id]/route.ts',
  'src/app/api/admin/settings/attributes/[id]/route.ts',
  'src/app/api/admin/settings/order-statuses/[id]/route.ts',
  'src/app/api/admin/contacts/[id]/route.ts',
  'src/app/api/admin/orders/[id]/route.ts',
];

console.log('🔧 Fixing API params for Next.js 16...\n');

files.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⏭️  Skipping (not found): ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Pattern 1: { params }: { params: { id: string } }
    const pattern1 = /\{ params \}: \{ params: \{ id: string \} \}/g;
    if (pattern1.test(content)) {
      content = content.replace(
        pattern1,
        'context: { params: Promise<{ id: string }> }'
      );
      
      // Add await params after function signature
      content = content.replace(
        /(export async function \w+\([^)]+\) \{)/g,
        '$1\n  const params = await context.params;'
      );
      
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`✓  Already OK: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\n✨ Done! Run npm run build to verify.');




