# 🔧 Fix MongoDB URI Format - Immediate Action Required

**Date:** December 4, 2025  
**Issue:** Invalid MongoDB Atlas connection string format  
**Status:** 🚨 **CRITICAL - MUST FIX**

---

## 🚨 Vấn Đề Phát Hiện

Từ terminal output, connection string có **2 lỗi nghiêm trọng**:

### ❌ Lỗi 1: Duplicate Prefix
```
mongodb+srv://***:***@mongodb+srv://admin:...
```
→ Prefix `mongodb+srv://` xuất hiện **2 lần** (duplicate)

### ❌ Lỗi 2: Placeholder Not Replaced
```
...admin:<db_password>@cluster0...
```
→ `<db_password>` là **placeholder**, chưa được thay bằng password thực tế

---

## ✅ Solution: Fix `.env.local` File

### Bước 1: Mở `.env.local` File

File location: `C:\Users\xaydu\teddy-bear\.env.local`

### Bước 2: Tìm Dòng `MONGODB_URI`

Hiện tại có thể trông như thế này (SAI):
```env
MONGODB_URI=mongodb+srv://mongodb+srv://admin:<db_password>@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

### Bước 3: Sửa Thành Format Đúng

**Format đúng:**
```env
MONGODB_URI=mongodb+srv://admin:YOUR_ACTUAL_PASSWORD@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

**Thay đổi cần thiết:**
1. ❌ Xóa duplicate prefix: `mongodb+srv://mongodb+srv://` → `mongodb+srv://`
2. ❌ Thay placeholder: `<db_password>` → **YOUR_ACTUAL_PASSWORD** (password thực tế từ MongoDB Atlas)

---

## 📝 Step-by-Step Fix

### Option A: Nếu Bạn Đã Có Password

1. **Mở `.env.local`**
2. **Tìm dòng `MONGODB_URI`**
3. **Sửa thành:**
   ```env
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD_HERE@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
   ```
   **Replace `YOUR_PASSWORD_HERE` với password thực tế**

4. **Lưu file**

---

### Option B: Nếu Bạn Không Nhớ Password

1. **Login MongoDB Atlas:**
   - Go to: https://cloud.mongodb.com
   - Login vào account của bạn

2. **Get Connection String Mới:**
   - Database → Click "Connect" trên cluster
   - Choose "Connect your application"
   - Copy connection string mới

3. **Format Connection String:**
   - Connection string từ Atlas sẽ có format:
     ```
     mongodb+srv://admin:<password>@cluster0.jvhppem.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Thay `<password>` bằng password thực tế**
   - **Thêm database name:** `/teddy-shop` trước `?`
   - Final format:
     ```
     mongodb+srv://admin:YOUR_PASSWORD@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
     ```

4. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
   ```

5. **Lưu file**

---

### Option C: Reset Database Password (Nếu Cần)

1. **MongoDB Atlas → Database Access**
2. **Tìm user `admin`**
3. **Click "Edit"**
4. **Click "Edit Password"**
5. **Generate new password** (hoặc tự tạo)
6. **Copy password ngay** (sẽ không thấy lại)
7. **Update `.env.local` với password mới**

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

## 📋 Correct Format Checklist

Connection string phải:
- ✅ Bắt đầu với `mongodb+srv://` (chỉ 1 lần!)
- ✅ Có format: `mongodb+srv://username:password@cluster...`
- ✅ Username và password là giá trị thực tế (không phải placeholder)
- ✅ Có database name: `/teddy-shop` trước `?`
- ✅ Có query parameters: `?retryWrites=true&w=majority`
- ✅ Không có spaces hoặc line breaks
- ✅ Password được URL-encoded nếu có ký tự đặc biệt

---

## 🔍 Common Mistakes to Avoid

❌ **WRONG:**
```env
MONGODB_URI=mongodb+srv://mongodb+srv://admin:<db_password>@cluster0...
```

✅ **CORRECT:**
```env
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@cluster0.jvhppem.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

---

## 🚀 Next Steps After Fix

1. **Fix `.env.local`** (theo hướng dẫn trên)
2. **Verify format:** `npm run fix:mongodb-uri`
3. **Test connection:** `npm run test:mongodb`
4. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
5. **Test homepage creation:**
   - Navigate to `/admin/homepage/new`
   - Fill form và submit
   - Verify không có errors

---

**Status:** 🚨 **URGENT - FIX REQUIRED**

Vui lòng fix `.env.local` ngay để connection string có format đúng!

