# 🔍 Debug Internal Server Error - Homepage Creation

**Date:** December 4, 2025  
**Issue:** "Internal server error" (500) when creating homepage  
**Status:** 🔍 **DEBUGGING IN PROGRESS**

---

## 🚨 Vấn Đề

**Console Log:**
```
[HomepageForm] API Response: {success: false, error: {code: 'SERVER_ERROR', message: 'Internal server error'}}
```

**Form Data:**
- name: 'đá'
- description: 'đã'
- seoTitle: 'dãd'
- seoDescription: 'adasd'

---

## 🔍 Debug Steps

### Step 1: Check Server Logs (CRITICAL)

**Mở terminal đang chạy `npm run dev` và tìm:**

```
[POST /configs] Server error: ...
[POST /configs] Database insert error: ...
[POST /configs] Creating config: { ... }
[POST /configs] Session user ID is missing: ...
```

**Copy toàn bộ error message và stack trace.**

---

### Step 2: Check Browser Network Tab

1. **Open DevTools** (F12)
2. **Network tab**
3. **Submit form again**
4. **Find request:** `/api/admin/homepage/configs` (POST)
5. **Click on request**
6. **Check Response tab:**
   - Look for `details` field in error response
   - Copy full error details

---

### Step 3: Common Causes

#### Cause 1: Session User ID Missing

**Symptom:**
- `[POST /configs] Session user ID is missing`
- Error code: `AUTH_ERROR`

**Solution:**
- Check `/admin/debug-session` page
- Verify session has `user.id`
- Logout and login again

---

#### Cause 2: Database Insert Error

**Symptom:**
- `[POST /configs] Database insert error: ...`
- Error code: `DATABASE_ERROR`

**Possible Issues:**
- MongoDB connection issue
- Collection permissions
- Data validation error
- Duplicate key error

**Solution:**
```bash
npm run test:mongodb
```

---

#### Cause 3: Invalid Data Format

**Symptom:**
- MongoDB validation error
- Field type mismatch

**Solution:**
- Check data types in `newConfig` object
- Verify all required fields are present

---

#### Cause 4: Vietnamese Characters Encoding

**Symptom:**
- Form data contains Vietnamese characters: `đá`, `đã`, `dãd`
- Possible encoding issue

**Solution:**
- MongoDB should handle UTF-8 correctly
- Check if slug generation handles Vietnamese characters properly

---

## 🛠️ Code Improvements Applied

### 1. Session User ID Validation

```typescript
// Validate session.user.id exists
if (!session.user.id) {
  console.error('[POST /configs] Session user ID is missing:', session.user);
  return NextResponse.json({
    success: false,
    error: {
      code: 'AUTH_ERROR',
      message: 'User ID not found in session',
    },
  }, { status: 401 });
}
```

### 2. Database Insert Error Handling

```typescript
// Insert into database
let result;
try {
  result = await homepageConfigs.insertOne(newConfig);
} catch (insertError) {
  console.error('[POST /configs] Database insert error:', insertError);
  return NextResponse.json({
    success: false,
    error: {
      code: 'DATABASE_ERROR',
      message: 'Failed to save configuration to database',
      details: process.env.NODE_ENV === 'development' 
        ? insertError instanceof Error ? insertError.message : String(insertError)
        : undefined,
    },
  }, { status: 500 });
}
```

### 3. Enhanced Debug Logging

```typescript
// DEBUG: Log config object before insert (development only)
if (process.env.NODE_ENV === 'development') {
  console.log('[POST /configs] Creating config:', {
    name: newConfig.name,
    slug: newConfig.slug,
    createdBy: newConfig.createdBy,
    hasSeo: !!newConfig.seo,
  });
}
```

---

## 📋 Diagnostic Checklist

- [ ] Server logs show specific error message?
- [ ] Network tab shows error details in response?
- [ ] Session user ID exists? (Check `/admin/debug-session`)
- [ ] MongoDB connection working? (`npm run test:mongodb`)
- [ ] Database insert operation succeeds?
- [ ] All required fields present in request?

---

## 🎯 Next Steps

1. **Check Server Logs:**
   - Open terminal running `npm run dev`
   - Submit form again
   - Copy error message from logs

2. **Check Network Response:**
   - DevTools → Network tab
   - Check response `details` field

3. **Verify Session:**
   - Navigate to `/admin/debug-session`
   - Check if `user.id` exists

4. **Test Database:**
   ```bash
   npm run test:mongodb
   ```

5. **Share Error Details:**
   - Server log error message
   - Network response details
   - Debug session page output

---

## 📝 Error Reporting

Khi báo lỗi, vui lòng cung cấp:

1. **Server Log Error:**
   ```
   [POST /configs] Server error: ...
   ```

2. **Network Response:**
   - Response body (JSON)
   - Status code
   - Error details field

3. **Session Info:**
   - Output from `/admin/debug-session`
   - User ID exists?

4. **Form Data:**
   - Name, description, seoTitle, seoDescription values

---

**Status:** 🔍 **AWAITING SERVER LOGS**

Vui lòng:
1. Submit form lại
2. Copy server log error message
3. Check Network tab response details
4. Share với tôi để tiếp tục debug

