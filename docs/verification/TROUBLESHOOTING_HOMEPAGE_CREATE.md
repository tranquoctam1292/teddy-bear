# 🔍 Troubleshooting Homepage Creation Errors

**Date:** December 4, 2025  
**Issue:** Homepage creation still failing despite all tests passing

---

## 🔍 Debug Steps

### Step 1: Check Browser Console

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for errors:**
   - `[HomepageForm]` logs
   - `[createConfig]` logs
   - Network errors
   - API response errors

4. **Go to Network tab:**
   - Filter: `XHR` or `Fetch`
   - Find request to `/api/admin/homepage/configs`
   - Click on request
   - Check **Response** tab for error details

---

### Step 2: Check Server Logs

**In terminal running `npm run dev`, look for:**

```
[createConfig] Session check: { ... }
[createConfig] Forwarding cookies to API: { ... }
[POST /configs] Auth error: ...
[POST /configs] Database connection error: ...
[POST /configs] Server error: ...
```

**Copy full error message and stack trace.**

---

### Step 3: Check Error Type

#### Error Type A: Authentication Error

**Symptom:**
- Toast: "Authentication required. Please log in to continue."
- Console: `[createConfig] No session found`

**Solution:**
- Verify you're logged in
- Check debug page: `/admin/debug-session`
- Verify `authjs.session-token` cookie exists
- Logout and login again

---

#### Error Type B: Database Error

**Symptom:**
- Toast: "Database connection failed"
- Console: `[POST /configs] Database connection error: ...`

**Solution:**
```bash
npm run test:mongodb
```

If fails:
- Check MongoDB Atlas cluster is running
- Verify connection string in `.env.local`
- Check Network Access settings

---

#### Error Type C: Validation Error

**Symptom:**
- Toast: "Name is required and must be at least 2 characters"
- Console: `[POST /configs] Validation error`

**Solution:**
- Fill all required fields:
  - Configuration Name (min 2 chars)
  - Page Title (SEO)
  - Meta Description (SEO)

---

#### Error Type D: Conflict Error

**Symptom:**
- Toast: "A configuration with this slug already exists"
- Console: `[POST /configs] Conflict: slug exists`

**Solution:**
- Use different configuration name
- Or delete existing config with same slug

---

#### Error Type E: Network Error

**Symptom:**
- Toast: "An unexpected error occurred"
- Console: `[createConfig] Network error`

**Solution:**
- Check `NEXT_PUBLIC_SITE_URL` in `.env.local`
- Verify dev server is running
- Check network connectivity

---

## 📋 Common Issues & Solutions

### Issue 1: Session Cookie Not Forwarded

**Check:**
- Server logs show: `[createConfig] Forwarding cookies to API`
- Cookie count > 0
- Has auth cookie

**If missing:**
- Code should handle this automatically
- Check Server Action cookie forwarding code

---

### Issue 2: Database Collection Not Found

**Error:** `Collection "homepage_configs" does not exist`

**Solution:**
- Collection will be created automatically on first insert
- If error persists, check MongoDB permissions

---

### Issue 3: Invalid Data Format

**Error:** `Invalid JSON in request body`

**Solution:**
- Check form data format
- Verify Server Action sends correct JSON

---

### Issue 4: Missing Required Fields

**Error:** `Name is required and must be at least 2 characters`

**Solution:**
- Fill all required form fields
- Check form validation on client side

---

## 🛠️ Diagnostic Commands

### Test Database Connection
```bash
npm run test:mongodb
```

### Test Homepage Flow
```bash
npm run test:homepage-flow
```

### Check URI Format
```bash
npm run fix:mongodb-uri
```

### Verify Environment
```bash
npm run verify:env
```

---

## 📝 Error Reporting Template

Khi báo lỗi, vui lòng cung cấp:

1. **Error Message:**
   - Toast message
   - Console error
   - Server log error

2. **Steps to Reproduce:**
   - What you did
   - What happened
   - What you expected

3. **Environment:**
   - Browser and version
   - Dev server status
   - MongoDB connection status

4. **Screenshots:**
   - Browser console
   - Network tab
   - Server logs

---

**Status:** 🔍 **DEBUGGING IN PROGRESS**

Vui lòng cung cấp:
1. Error message cụ thể (toast, console, server logs)
2. Screenshot của browser console
3. Server logs output

