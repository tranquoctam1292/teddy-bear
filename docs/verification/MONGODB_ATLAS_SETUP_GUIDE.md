# 🚀 MongoDB Atlas Setup Guide - Final Instructions

**Date:** December 4, 2025  
**Status:** ✅ **CODE AUDIT COMPLETE - NO CHANGES NEEDED**  
**Action Required:** User must update `.env.local` with Atlas connection string

---

## ✅ Code Audit Results

### `src/lib/db.ts` - VERIFIED ✅

**Implementation Status:** ✅ **ROBUST & READY**

**Findings:**
- ✅ Correctly reads `process.env.MONGODB_URI`
- ✅ Uses MongoDB native driver (`MongoClient`)
- ✅ **Automatically supports both URI formats:**
  - Local: `mongodb://localhost:27017/teddy-shop`
  - Atlas: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/teddy-shop?retryWrites=true&w=majority`
- ✅ Proper error handling
- ✅ HMR-safe connection pooling for development
- ✅ **NO CODE CHANGES REQUIRED**

**Conclusion:** Codebase is **fully compatible** with MongoDB Atlas. Only environment variable update is needed.

---

## 🎯 CRITICAL ACTION: Update `.env.local`

### Step 1: Create MongoDB Atlas Account & Cluster

1. **Sign Up / Login:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free) or login

2. **Create Free Cluster:**
   - Click **"Build a Database"** button
   - Choose **"FREE"** tier (M0 Sandbox)
   - Select **region** closest to you (e.g., `AWS / ap-southeast-1` for Vietnam)
   - Cluster name: `Cluster0` (default) or your choice
   - Click **"Create"**
   - ⏳ Wait 3-5 minutes for cluster creation

---

### Step 2: Setup Database User

1. **Navigate to Database Access:**
   - Left sidebar → **"Database Access"**
   - Click **"Add New Database User"**

2. **Configure User:**
   - **Authentication Method:** Password
   - **Username:** `admin` (or your choice)
   - **Password:** 
     - Click **"Autogenerate Secure Password"** (recommended)
     - **⚠️ CRITICAL:** Copy password immediately (you won't see it again!)
     - Or create your own strong password (min 8 chars, mix of letters, numbers, symbols)
   - **Database User Privileges:** `Atlas admin` (full access)
   - Click **"Add User"**

---

### Step 3: Setup Network Access

1. **Navigate to Network Access:**
   - Left sidebar → **"Network Access"**
   - Click **"Add IP Address"**

2. **Allow Access:**
   - **Option A (Development - Recommended):**
     - Click **"Allow Access from Anywhere"**
     - IP Address: `0.0.0.0/0`
     - Comment: `Development - Allow all IPs`
   
   - **Option B (Production - More Secure):**
     - Click **"Add Current IP Address"** (adds your current IP)
     - Or manually add specific IPs
   
   - Click **"Confirm"**

**Note:** For development, `0.0.0.0/0` is acceptable. For production, restrict to specific IPs.

---

### Step 4: Get Connection String

1. **Navigate to Database:**
   - Left sidebar → **"Database"**
   - Click **"Connect"** button on your cluster

2. **Choose Connection Method:**
   - Select **"Connect your application"**

3. **Copy Connection String:**
   - **Driver:** Node.js
   - **Version:** 6.0 or later (default)
   - **Connection String Format:**
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Click **"Copy"** button

---

### Step 5: Update `.env.local` File

**⚠️ CRITICAL: Follow this EXACT format**

1. **Open `.env.local` file** (in project root directory)

2. **Find existing `MONGODB_URI` line:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/teddy-shop
   ```

3. **Replace with Atlas connection string:**
   ```env
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/teddy-shop?retryWrites=true&w=majority
   ```

4. **Replace placeholders:**
   - `admin` → Your database username (from Step 2)
   - `YOUR_PASSWORD` → Your database password (from Step 2)
   - `cluster0.xxxxx` → Your actual cluster URL (from Step 4)
   - `teddy-shop` → Database name (keep this - it's correct)

**Example (DO NOT USE - Replace with your actual values):**
```env
MONGODB_URI=mongodb+srv://admin:MySecureP@ssw0rd123@cluster0.abc123.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

**⚠️ SECURITY NOTE:**
- `.env.local` is in `.gitignore` (safe)
- Never commit `.env.local` to Git
- Never share connection string publicly

---

### Step 6: Verify Connection String Format

**Correct Format Checklist:**
- ✅ Starts with `mongodb+srv://`
- ✅ Contains username:password before `@`
- ✅ Contains cluster URL after `@`
- ✅ Contains database name: `/teddy-shop`
- ✅ Contains query parameters: `?retryWrites=true&w=majority`
- ✅ No spaces or line breaks
- ✅ Password is URL-encoded if contains special characters

**Common Mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Missing database name (`/teddy-shop`)
- ❌ Missing query parameters
- ❌ Spaces in connection string
- ❌ Wrong username/password

---

### Step 7: Test Connection

1. **Run test script:**
   ```bash
   npm run test:mongodb
   ```

2. **Expected Output:**
   ```
   ✅ MONGODB_URI found
   ✅ Successfully connected to MongoDB!
   ✅ Collection "homepage_configs" accessible
   🎉 MongoDB connection test PASSED!
   ```

3. **If test fails:**
   - Check connection string format
   - Verify username/password are correct
   - Check Network Access settings (IP whitelist)
   - Verify cluster is running (not paused)

---

### Step 8: Restart Dev Server

**⚠️ CRITICAL: Must restart after updating `.env.local`**

1. **Stop current server:**
   - Press `Ctrl + C` in terminal running `npm run dev`

2. **Start server again:**
   ```bash
   npm run dev
   ```

3. **Verify startup:**
   - Check for MongoDB connection success messages
   - No connection errors in console

---

### Step 9: Test Homepage Creation

1. **Navigate to:**
   ```
   http://localhost:3000/admin/homepage/new
   ```

2. **Fill form:**
   - Configuration Name: `Test Homepage`
   - Page Title: `Test Page Title`
   - Meta Description: `Test meta description`

3. **Submit form:**
   - Click **"Create & Continue"**
   - Verify **NO** "Database connection failed" error
   - Should redirect to edit page on success

---

## 📋 Final Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created and running
- [ ] Database user created (username + password saved)
- [ ] Network Access configured (IP whitelist)
- [ ] Connection string copied from Atlas
- [ ] `.env.local` updated with Atlas connection string
- [ ] Connection string format verified (no spaces, correct format)
- [ ] Test connection: `npm run test:mongodb` → PASSED
- [ ] Dev server restarted
- [ ] Homepage creation tested and working

---

## 🔍 Troubleshooting

### Issue 1: "Authentication failed"

**Solution:**
- Verify username/password in connection string
- Check password doesn't contain unencoded special characters
- URL-encode password if needed (e.g., `@` → `%40`)

---

### Issue 2: "Connection timeout"

**Solution:**
- Check Network Access settings
- Verify IP is whitelisted (`0.0.0.0/0` for development)
- Check cluster is running (not paused)

---

### Issue 3: "Invalid connection string format"

**Solution:**
- Verify connection string starts with `mongodb+srv://`
- Check no spaces or line breaks
- Verify database name is included: `/teddy-shop`
- Check query parameters are present

---

### Issue 4: "Database not found"

**Solution:**
- Database name `teddy-shop` will be created automatically on first use
- Or create manually in Atlas UI if needed
- Verify connection string includes `/teddy-shop`

---

## 📝 Summary

**Code Status:** ✅ **NO CHANGES NEEDED**  
**Action Required:** ✅ **UPDATE `.env.local` ONLY**

**Next Steps:**
1. Setup MongoDB Atlas (Steps 1-4)
2. Update `.env.local` (Step 5)
3. Test connection (Step 7)
4. Restart server (Step 8)
5. Test homepage creation (Step 9)

---

**Status:** 🚀 **READY FOR ATLAS MIGRATION**

Sau khi hoàn thành các bước trên, project sẽ sử dụng MongoDB Atlas cloud database thay vì local MongoDB, giải quyết hoàn toàn vấn đề connection timeout.

