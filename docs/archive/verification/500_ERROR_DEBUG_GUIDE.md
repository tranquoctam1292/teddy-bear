# 🔍 500 Error Debug Guide - Homepage Creation

**Date:** December 4, 2025  
**Issue:** 500 Internal Server Error khi tạo homepage

---

## 🚨 Vấn Đề

Console hiển thị:
```
❌ Failed to load resource: the server responded with a status of 500 (Internal Server Error)
URL: :3000/api/admin/homepage/configs?page=1&limit=20
```

---

## 🔧 Debug Steps

### Bước 1: Kiểm tra Server Logs (CRITICAL)

**Mở terminal đang chạy `npm run dev` và tìm:**

#### Nếu là GET request (load danh sách):
```
[GET /configs] Database connection error: ...
Error fetching homepage configs: ...
```

#### Nếu là POST request (tạo mới):
```
[POST /configs] Auth error: ...
[POST /configs] Database connection error: ...
[POST /configs] Server error: ...
```

**Copy toàn bộ error message và stack trace.**

---

### Bước 2: Kiểm tra Common Causes

#### Cause 1: Database Connection Error

**Symptom:**
- `[POST /configs] Database connection error: ...`
- Error message có chứa "MongoDB URI" hoặc "connection"

**Solution:**
1. Verify MongoDB đang chạy:
   ```bash
   # Check MongoDB service
   # Windows: Services → MongoDB
   # Or check MongoDB Compass connection
   ```

2. Verify `.env.local` có `MONGODB_URI`:
   ```bash
   npm run verify:env
   ```

3. Test MongoDB connection:
   ```bash
   npm run test:db
   ```

---

#### Cause 2: Auth Secret Error (Sau khi fix)

**Symptom:**
- `[POST /configs] Auth error: ...`
- Error message có chứa "AUTH_SECRET is required"

**Solution:**
1. Verify `.env.local` có `AUTH_SECRET`:
   ```env
   AUTH_SECRET=your-secret-here-min-32-chars
   ```

2. **RESTART DEV SERVER** (CRITICAL!):
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **LOGOUT và LOGIN lại** (để clear old session cookies)

---

#### Cause 3: MongoDB Operation Error

**Symptom:**
- `[POST /configs] Server error: ...`
- Error message có chứa "MongoServerError" hoặc MongoDB-specific errors

**Possible Issues:**
- Collection không tồn tại
- Index conflict
- Validation error
- Network timeout

**Solution:**
1. Check MongoDB logs
2. Verify collection `homepage_configs` exists
3. Check MongoDB connection stability

---

#### Cause 4: Unhandled Exception

**Symptom:**
- Error không có prefix `[POST /configs]` hoặc `[GET /configs]`
- Generic "Internal Server Error" không có details

**Solution:**
- Code đã được fix để catch tất cả errors
- Nếu vẫn xảy ra → Check server logs cho unhandled exceptions

---

## 📋 Diagnostic Checklist

- [ ] Server logs show specific error message?
- [ ] MongoDB connection working? (`npm run test:db`)
- [ ] `AUTH_SECRET` set và valid? (`npm run verify:env`)
- [ ] Dev server restarted sau khi fix?
- [ ] Logged out và logged in lại?
- [ ] MongoDB service đang chạy?
- [ ] `.env.local` có `MONGODB_URI`?

---

## 🛠️ Code Fixes Applied

### Fix 1: Database Connection Error Handling

**File:** `src/app/api/admin/homepage/configs/route.ts`

**Changes:**
- Added try-catch cho `getCollections()` trong cả GET và POST
- Return standardized error response với `DATABASE_ERROR` code
- Log error details trong development mode

**Code:**
```typescript
// Get database connection
let db;
try {
  const collections = await getCollections();
  db = collections.db;
} catch (dbError) {
  console.error('[POST /configs] Database connection error:', dbError);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' 
          ? dbError instanceof Error ? dbError.message : String(dbError)
          : undefined,
      },
    },
    { status: 500 }
  );
}
```

---

## 🎯 Next Steps

1. **Check Server Logs:**
   - Copy error message từ terminal
   - Identify error type (Database, Auth, MongoDB operation)

2. **Verify Environment:**
   ```bash
   npm run verify:env
   ```

3. **Test MongoDB:**
   ```bash
   npm run test:db
   ```

4. **Restart & Re-login:**
   - Stop server (Ctrl+C)
   - Start server (`npm run dev`)
   - Logout và login lại

5. **Retry:**
   - Navigate to `/admin/homepage/new`
   - Fill form và submit
   - Check server logs cho new error

---

## 📝 Error Response Format

Tất cả errors bây giờ return standardized format:

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR" | "AUTH_ERROR" | "SERVER_ERROR" | ...,
    "message": "Human-readable message",
    "details": "Detailed error (development only)"
  }
}
```

**Check browser console Network tab:**
- Click vào failed request
- Check Response tab
- Copy error details

---

**Status:** 🔍 **DEBUGGING IN PROGRESS**

Vui lòng:
1. Check server logs và copy error message
2. Run `npm run verify:env` và `npm run test:db`
3. Share kết quả để tiếp tục debug

