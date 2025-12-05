# ✅ Environment Configuration Checklist

**Date:** December 2025  
**Issue:** "Authentication required" error persists despite code fixes  
**Root Cause:** Missing or incorrect environment variables

---

## 🚨 CRITICAL: Environment Variables Verification

### ✅ **Bước 1: Kiểm tra `.env.local` File**

**Location:** Root directory của project (cùng cấp với `package.json`)

**Required Variables (2 biến bắt buộc):**

#### 1. `AUTH_SECRET` (CRITICAL - NextAuth v5)

```env
AUTH_SECRET=your-generated-secret-here
```

**⚠️ QUAN TRỌNG:**
- Project sử dụng `AUTH_SECRET` (không phải `NEXTAUTH_SECRET`)
- Phải là chuỗi ngẫu nhiên dài (32+ ký tự)
- Nếu thiếu hoặc sai → NextAuth không thể sign/unsign session cookie → `await auth()` luôn trả về `null`

**Generate Secret:**

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Verify:**
```bash
# Check if AUTH_SECRET exists
cat .env.local | grep AUTH_SECRET

# Should output:
# AUTH_SECRET=some-long-random-string-here
```

---

#### 2. `NEXT_PUBLIC_SITE_URL` (CRITICAL - Server Action fetch)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ QUAN TRỌNG:**
- Server Action sử dụng biến này để gọi API route
- Phải match với URL mà bạn đang chạy dev server
- Nếu sai → fetch request sẽ fail hoặc gọi sai endpoint

**Verify:**
```bash
# Check if NEXT_PUBLIC_SITE_URL exists
cat .env.local | grep NEXT_PUBLIC_SITE_URL

# Should output:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### ✅ **Bước 2: Verify Code Implementation**

#### Check 1: Cookie Forwarding (Server Action)

**File:** `src/app/admin/homepage/new/page.tsx`

**Verify dòng 60-77:**
```typescript
// Get cookies from incoming request to forward to API
const cookieStore = await cookies();
const cookieHeader = cookieStore
  .getAll()
  .map((cookie) => `${cookie.name}=${cookie.value}`)
  .join('; ');

const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    Cookie: cookieHeader, // ✅ MUST BE PRESENT
  },
});
```

**Status:** ✅ **VERIFIED** - Cookie header được forward đúng cách

---

#### Check 2: Frontend Error Handling

**File:** `src/components/admin/homepage/HomepageForm.tsx`

**Verify dòng 86-96:**
```typescript
if (result && typeof result === 'object' && 'success' in result && !result.success) {
  const errorMessage = result.error?.message || 'Không thể lưu cấu hình. Vui lòng thử lại.';
  
  toast({
    variant: 'destructive',
    title: 'Lỗi',
    description: errorMessage,
  });
  return; // Exit early
}
```

**Status:** ✅ **VERIFIED** - Tất cả errors hiển thị qua Toast (không có alert/modal)

---

### ✅ **Bước 3: Verify CI/CD Configuration**

**File:** `.github/workflows/ci.yml`

**Verify dòng 88:**
```yaml
env:
  AUTH_SECRET: ${{ secrets.AUTH_SECRET || 'dummy-secret-for-ci-build-only-not-real' }}
```

**Status:** ✅ **VERIFIED** - CI có AUTH_SECRET với fallback

**⚠️ Lưu ý:** 
- CI sử dụng fallback dummy secret (chỉ để build, không dùng cho auth)
- Production deployment phải set `AUTH_SECRET` trong environment variables

---

## 🔍 Diagnostic Steps

### Step 1: Check Environment File Exists

```bash
# Verify .env.local exists
ls -la .env.local

# Should show file exists
```

---

### Step 2: Verify AUTH_SECRET Format

```bash
# Check AUTH_SECRET value
cat .env.local | grep AUTH_SECRET

# Should output something like:
# AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==

# ❌ WRONG: Empty or short
# AUTH_SECRET=
# AUTH_SECRET=secret

# ✅ CORRECT: Long random string
# AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==
```

---

### Step 3: Verify NEXT_PUBLIC_SITE_URL

```bash
# Check NEXT_PUBLIC_SITE_URL value
cat .env.local | grep NEXT_PUBLIC_SITE_URL

# Should output:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ❌ WRONG: Missing or incorrect
# NEXT_PUBLIC_SITE_URL=
# NEXT_PUBLIC_SITE_URL=https://wrong-url.com

# ✅ CORRECT: Matches your dev server
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### Step 4: Restart Dev Server

**⚠️ CRITICAL:** Environment variables chỉ được load khi server khởi động.

```bash
# Stop dev server (Ctrl+C)
# Then restart:
npm run dev
```

**Lý do:** Next.js chỉ load `.env.local` khi server start. Nếu bạn thêm/sửa env vars sau khi server đã chạy, phải restart.

---

### Step 5: Clear Browser Cookies

**Nếu đã thay đổi AUTH_SECRET:**

```bash
# Clear browser cookies for localhost:3000
# Hoặc sử dụng Incognito/Private window để test
```

**Lý do:** Session cookie cũ được sign với AUTH_SECRET cũ → không thể verify với AUTH_SECRET mới.

---

## 🧪 Test After Fix

### Test 1: Login Flow
1. Navigate to `/admin/login`
2. Login với admin credentials
3. Verify redirect to `/admin/dashboard` (không bị redirect về login)

**Expected:** ✅ Login thành công, session được tạo

---

### Test 2: Homepage Creation
1. Navigate to `/admin/homepage/new`
2. Fill form và submit
3. Verify không có "Authentication required" error

**Expected:** ✅ Config được tạo thành công, redirect to edit page

---

### Test 3: Check Console Logs

**Server Console:**
```bash
# Should NOT see:
# ❌ [createConfig] Auth error: ...
# ❌ Error: AUTH_SECRET is required

# Should see (if successful):
# ✅ [POST /configs] Processing request...
```

**Browser Console:**
```bash
# Should NOT see:
# ❌ Error: Authentication required

# Should see (if successful):
# ✅ [HomepageForm] Redirecting to edit page: /admin/homepage/...
```

---

## 📋 Final Checklist

- [ ] `.env.local` file exists in project root
- [ ] `AUTH_SECRET` is set and is a long random string (32+ chars)
- [ ] `NEXT_PUBLIC_SITE_URL` is set and matches dev server URL
- [ ] Dev server has been restarted after env changes
- [ ] Browser cookies cleared (if AUTH_SECRET was changed)
- [ ] Login works successfully
- [ ] Homepage creation works without auth errors
- [ ] No console errors related to authentication

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Wrong Variable Name
```env
# ❌ WRONG
NEXTAUTH_SECRET=...

# ✅ CORRECT
AUTH_SECRET=...
```

**Reason:** NextAuth v5 uses `AUTH_SECRET`, not `NEXTAUTH_SECRET`

---

### ❌ Mistake 2: Short or Predictable Secret
```env
# ❌ WRONG
AUTH_SECRET=secret
AUTH_SECRET=123456

# ✅ CORRECT
AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==
```

**Reason:** Security risk + NextAuth may reject weak secrets

---

### ❌ Mistake 3: Not Restarting Server
```bash
# ❌ WRONG: Edit .env.local but don't restart
# Server still using old values

# ✅ CORRECT: Restart after changes
npm run dev
```

---

### ❌ Mistake 4: Wrong Site URL
```env
# ❌ WRONG
NEXT_PUBLIC_SITE_URL=https://production.com  # When running locally

# ✅ CORRECT
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # For local dev
```

---

## 📞 Support

Nếu vẫn gặp lỗi sau khi verify tất cả:

1. **Check build logs:**
   ```bash
   npm run build
   # Look for AUTH_SECRET errors
   ```

2. **Check runtime logs:**
   ```bash
   npm run dev
   # Look for auth-related errors in console
   ```

3. **Verify NextAuth config:**
   - Check `src/lib/auth.ts` line 201: `secret: process.env.AUTH_SECRET`
   - Verify no typos in variable name

---

**Created By:** AI Assistant  
**Date:** December 2025  
**Version:** 1.0

