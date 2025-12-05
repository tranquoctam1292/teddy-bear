# 🔍 Debug Session Guide - Homepage Creation Error

**Date:** December 4, 2025  
**Issue:** "Authentication required" error khi tạo homepage

---

## 🚨 Vấn Đề

Toast error hiển thị: **"Authentication required. Please log in to continue."**

Điều này có nghĩa là `await auth()` trong Server Action trả về `null` hoặc không có `session.user`.

---

## 🔧 Debug Steps

### Bước 1: Kiểm tra Debug Page

1. **Navigate đến:** `http://localhost:3000/admin/debug-session`
2. **Nếu chưa đăng nhập:** Sẽ redirect đến login page
3. **Nếu đã đăng nhập:** Sẽ hiển thị:
   - Session info (user email, role, etc.)
   - Cookies info (tất cả cookies, bao gồm auth cookie)
   - Environment check (AUTH_SECRET, NEXT_PUBLIC_SITE_URL)

**Kiểm tra:**
- ✅ Session có `user` object không?
- ✅ Có cookie nào có tên chứa "auth", "session", hoặc "next-auth" không?
- ✅ AUTH_SECRET có được set không?

---

### Bước 2: Kiểm tra Server Logs

Khi submit form tạo homepage, check terminal logs cho:

```
[createConfig] Session check: { hasSession: true/false, hasUser: true/false, ... }
[createConfig] No session found. Available cookies: { cookieCount: X, cookieNames: [...], ... }
[createConfig] Forwarding cookies to API: { cookieCount: X, ... }
```

**Nếu thấy:**
- `hasSession: false` → Session không được tạo
- `cookieCount: 0` → Không có cookies nào được gửi
- `hasAuthCookie: false` → Không có auth cookie

---

### Bước 3: Kiểm tra Environment Variables

```bash
npm run verify:env
```

**Verify:**
- ✅ `AUTH_SECRET` exists và length >= 32
- ✅ `NEXT_PUBLIC_SITE_URL` exists và đúng format

---

### Bước 4: Kiểm tra Login Flow

1. **Log out** (nếu đang đăng nhập)
2. **Log in lại** tại `/admin/login`
3. **Verify:**
   - Login thành công?
   - Redirect đến dashboard?
   - Cookie được set trong browser?

**Check Browser DevTools:**
- Open DevTools → Application → Cookies → `http://localhost:3000`
- Tìm cookie có tên chứa "auth", "session", hoặc "next-auth"
- Verify cookie có `value` không rỗng

---

## 🐛 Common Issues & Solutions

### Issue 1: AUTH_SECRET Missing or Invalid

**Symptom:**
- `[createConfig] Auth error: ...`
- Error message có chứa "AUTH_SECRET" hoặc "secret"

**Solution:**
1. Generate new AUTH_SECRET:
   ```powershell
   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```
2. Add to `.env.local`:
   ```env
   AUTH_SECRET=your-generated-secret-here
   ```
3. **Restart dev server** (CRITICAL!)

---

### Issue 2: No Session Cookie

**Symptom:**
- `cookieCount: 0` hoặc `hasAuthCookie: false`
- Session check shows `hasSession: false`

**Possible Causes:**
1. **Cookie không được set sau login:**
   - Check browser DevTools → Application → Cookies
   - Nếu không có cookie → Login flow có vấn đề

2. **Cookie bị block bởi browser:**
   - Check browser settings (third-party cookies, privacy mode)
   - Try different browser hoặc incognito mode

3. **Cookie domain/path không đúng:**
   - NextAuth v5 tự động set cookie với domain/path đúng
   - Nếu có vấn đề → Check `NEXTAUTH_URL` (nếu có)

**Solution:**
1. Clear all cookies cho `localhost:3000`
2. Log out và log in lại
3. Check DevTools → Application → Cookies
4. Verify cookie được set

---

### Issue 3: Session Expired

**Symptom:**
- Session check shows `hasSession: true` nhưng `hasUser: false`
- Hoặc session có nhưng không có `user` object

**Solution:**
1. Log out và log in lại
2. Check JWT token expiration (NextAuth v5 default: 30 days)
3. Verify `AUTH_SECRET` không thay đổi (nếu thay đổi → tất cả sessions invalid)

---

### Issue 4: Cookie Not Forwarded

**Symptom:**
- Server Action có cookies
- Nhưng API route không nhận được cookies

**Check:**
1. Verify code có `Cookie: cookieHeader` trong fetch headers
2. Check server logs cho `[createConfig] Forwarding cookies to API`
3. Verify `cookieHeader` không rỗng

**Solution:**
- Code đã được fix (cookie forwarding implemented)
- Nếu vẫn fail → Check `NEXT_PUBLIC_SITE_URL` có đúng không

---

## 📋 Diagnostic Checklist

- [ ] Debug page (`/admin/debug-session`) shows session?
- [ ] Browser DevTools shows auth cookie?
- [ ] `AUTH_SECRET` exists và valid?
- [ ] `NEXT_PUBLIC_SITE_URL` exists và đúng?
- [ ] Dev server restarted sau khi thay đổi `.env.local`?
- [ ] Logged in với admin account?
- [ ] Server logs show session check info?
- [ ] Cookies được forward trong fetch request?

---

## 🎯 Next Steps

1. **Run debug page:** Navigate to `/admin/debug-session`
2. **Check server logs:** Submit form và xem logs
3. **Verify environment:** Run `npm run verify:env`
4. **Test login flow:** Log out và log in lại
5. **Check browser cookies:** DevTools → Application → Cookies

**Sau khi có thông tin từ debug:**
- Share server logs output
- Share debug page output
- Share browser cookies info

---

## 📝 Files Modified

1. **`src/app/admin/homepage/new/page.tsx`**
   - Added debug logging for session check
   - Added debug logging for cookie forwarding
   - Improved error messages

2. **`src/app/admin/debug-session/page.tsx`** (NEW)
   - Debug page để check session và cookies
   - Environment check
   - Quick links để test

---

**Status:** 🔍 **DEBUGGING IN PROGRESS**

Vui lòng follow các bước trên và share kết quả để tiếp tục debug.

