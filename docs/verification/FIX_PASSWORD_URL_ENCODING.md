# 🔧 Fix Password URL Encoding - Double @@ Issue

**Date:** December 4, 2025  
**Issue:** Double `@@` in connection string - password contains `@` character  
**Status:** 🚨 **CRITICAL - MUST FIX**

---

## 🚨 Vấn Đề

**Error:** `Protocol and host list are required in "mongodb+srv://admin:Tranngocchauanh1@@cluster0..."`

**Root Cause:** Password chứa ký tự `@` và không được URL-encode, tạo ra double `@@`:
- `@` từ password: `Tranngocchauanh1@`
- `@` từ separator: `username:password@host`

**Result:** `Tranngocchauanh1@@cluster0...` (SAI)

---

## ✅ Solution: URL-Encode Password

### Bước 1: Identify Special Characters in Password

Password hiện tại: `Tranngocchauanh1@`

Ký tự đặc biệt cần encode:
- `@` → `%40`

---

### Bước 2: URL-Encode Password

**Password gốc:** `Tranngocchauanh1@`  
**Password encoded:** `Tranngocchauanh1%40`

**Encoding rules:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (space) → `%20`

---

### Bước 3: Update `.env.local`

**Mở file:** `C:\Users\xaydu\teddy-bear\.env.local`

**Tìm dòng:**
```env
MONGODB_URI=mongodb+srv://admin:Tranngocchauanh1@@cluster0.jvhppem.mongodb.net/teddy-shop
```

**Sửa thành:**
```env
MONGODB_URI=mongodb+srv://admin:Tranngocchauanh1%40@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

**Thay đổi:**
1. ✅ `Tranngocchauanh1@@` → `Tranngocchauanh1%40@` (encode `@` thành `%40`)
2. ✅ Thêm query parameters: `?retryWrites=true&w=majority`

---

## 🔍 Quick Reference: URL Encoding

### Common Characters:

| Character | Encoded | Example |
|-----------|---------|---------|
| `@` | `%40` | `password@123` → `password%40123` |
| `#` | `%23` | `pass#word` → `pass%23word` |
| `$` | `%24` | `pass$word` → `pass%24word` |
| `%` | `%25` | `pass%word` → `pass%25word` |
| `&` | `%26` | `pass&word` → `pass%26word` |
| `+` | `%2B` | `pass+word` → `pass%2Bword` |
| `=` | `%3D` | `pass=word` → `pass%3Dword` |
| `?` | `%3F` | `pass?word` → `pass%3Fword` |
| `/` | `%2F` | `pass/word` → `pass%2Fword` |
| ` ` (space) | `%20` | `pass word` → `pass%20word` |

---

## 🛠️ Online URL Encoder (Nếu Cần)

Nếu password có nhiều ký tự đặc biệt, sử dụng online encoder:

1. **Go to:** https://www.urlencoder.org/
2. **Paste password:** `Tranngocchauanh1@`
3. **Click "Encode"**
4. **Copy encoded result:** `Tranngocchauanh1%40`
5. **Use in connection string**

---

## ✅ Verification

Sau khi fix, verify:

```bash
npm run fix:mongodb-uri
```

**Expected Output:**
```
✅ No format issues detected!
```

Sau đó test connection:

```bash
npm run test:mongodb
```

**Expected Output:**
```
✅ MONGODB_URI found
✅ Successfully connected to MongoDB!
✅ Collection "homepage_configs" accessible
🎉 MongoDB connection test PASSED!
```

---

## 📝 Final Correct Format

**Connection String:**
```env
MONGODB_URI=mongodb+srv://admin:Tranngocchauanh1%40@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

**Breakdown:**
- `mongodb+srv://` - Protocol
- `admin` - Username
- `:` - Separator
- `Tranngocchauanh1%40` - Password (URL-encoded)
- `@` - Credentials separator (chỉ 1 lần!)
- `cluster0.jvhppem.mongodb.net` - Host
- `/teddy-shop` - Database name
- `?retryWrites=true&w=majority` - Query parameters

---

## 🚀 Next Steps

1. **Fix `.env.local`:**
   - Replace `Tranngocchauanh1@@` → `Tranngocchauanh1%40@`
   - Add query parameters: `?retryWrites=true&w=majority`

2. **Verify format:**
   ```bash
   npm run fix:mongodb-uri
   ```

3. **Test connection:**
   ```bash
   npm run test:mongodb
   ```

4. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

5. **Test homepage creation:**
   - Navigate to `/admin/homepage/new`
   - Fill form và submit
   - Verify success!

---

## ⚠️ Important Notes

1. **Password Encoding:**
   - Nếu password có ký tự đặc biệt → phải URL-encode
   - Chỉ encode password, không encode username hoặc host

2. **Single @ Separator:**
   - Connection string chỉ có **1 dấu @** (sau password encoded)
   - Format: `username:encoded_password@host`

3. **Query Parameters:**
   - Luôn thêm `?retryWrites=true&w=majority` cho Atlas
   - Đảm bảo có `/teddy-shop` trước `?`

---

**Status:** 🚨 **URGENT - FIX REQUIRED**

Vui lòng fix `.env.local` ngay:
1. Encode password: `@` → `%40`
2. Add query parameters
3. Verify và test!

