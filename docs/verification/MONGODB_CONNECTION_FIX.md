# 🔧 MongoDB Connection Fix Guide

**Date:** December 4, 2025  
**Issue:** Database connection failed - Connection timeout  
**Status:** 🔍 **ROOT CAUSE IDENTIFIED**

---

## 🚨 Vấn Đề

**Error:** `Connection timeout after 10 seconds`  
**MONGODB_URI:** `mongodb://localhost:27017/teddy-shop` ✅ (đã set đúng)

**Root Cause:** MongoDB service không chạy hoặc không accessible từ localhost:27017

---

## ✅ Solution Options

### Option 1: Start MongoDB Service (Local)

#### Windows:

**Method A: Services Manager**
1. Press `Win + R`
2. Type `services.msc` và Enter
3. Tìm service "MongoDB" hoặc "MongoDB Server"
4. Right-click → **Start**
5. Verify status = **Running**

**Method B: Command Line**
```powershell
# Check if MongoDB service exists
Get-Service | Where-Object {$_.Name -like "*mongo*"}

# Start MongoDB service
Start-Service MongoDB

# Or if service name is different:
Start-Service "MongoDB Server"
```

**Method C: Manual Start (if service not installed)**
```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\<version>\bin"

# Start MongoDB
.\mongod.exe --dbpath "C:\data\db"
```

**Note:** Nếu chưa có MongoDB installed:
- Download từ: https://www.mongodb.com/try/download/community
- Install MongoDB Community Edition
- Default port: 27017

---

### Option 2: Use MongoDB Atlas (Cloud - Recommended)

**Advantages:**
- ✅ Không cần install MongoDB locally
- ✅ Free tier available (512MB)
- ✅ Auto-backup
- ✅ Accessible từ anywhere

**Steps:**

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free)

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select region (closest to you)
   - Click "Create"

3. **Setup Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Or add your IP: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/teddy-shop?retryWrites=true&w=majority`

6. **Update .env.local:**
   ```env
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/teddy-shop?retryWrites=true&w=majority
   ```
   **Replace:**
   - `admin` → your database username
   - `YOUR_PASSWORD` → your database password
   - `cluster0.xxxxx` → your cluster URL

7. **Test Connection:**
   ```bash
   npm run test:mongodb
   ```

---

## 🔍 Verification Steps

### Step 1: Test MongoDB Connection

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

### Step 2: Verify MongoDB Service (Local Only)

**Windows:**
```powershell
# Check if MongoDB is running
Get-Service | Where-Object {$_.Name -like "*mongo*"}

# Should show:
# Status: Running
```

**Or test connection:**
```powershell
# Test if port 27017 is listening
Test-NetConnection -ComputerName localhost -Port 27017

# Should show:
# TcpTestSucceeded: True
```

---

### Step 3: Restart Dev Server

Sau khi fix MongoDB connection:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

### Step 4: Test Homepage Creation

1. Navigate to `/admin/homepage/new`
2. Fill form và submit
3. Verify không có "Database connection failed" error
4. Check server logs cho success message

---

## 📋 Troubleshooting

### Issue 1: "MongoDB service not found"

**Solution:**
- MongoDB chưa được install
- Download và install từ: https://www.mongodb.com/try/download/community
- Hoặc sử dụng MongoDB Atlas (cloud)

---

### Issue 2: "Port 27017 already in use"

**Solution:**
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### Issue 3: "Permission denied"

**Solution:**
- Run PowerShell as Administrator
- Or check MongoDB data directory permissions
- Default: `C:\data\db`

---

### Issue 4: "Connection timeout" với MongoDB Atlas

**Solution:**
1. Check Network Access settings
2. Verify IP address is whitelisted
3. Check username/password in connection string
4. Verify cluster is running (not paused)

---

## 🎯 Quick Fix Checklist

- [ ] MongoDB service running? (Local) OR MongoDB Atlas cluster active? (Cloud)
- [ ] `MONGODB_URI` set correctly in `.env.local`?
- [ ] Test connection: `npm run test:mongodb` → PASSED?
- [ ] Dev server restarted?
- [ ] Homepage creation works?

---

## 📝 Files Modified

1. **`scripts/test-mongodb-connection.ts`** (NEW)
   - Direct MongoDB connection test
   - Detailed error messages
   - Specific solutions based on error type

2. **`package.json`**
   - Added `test:mongodb` script

---

## 🚀 Next Steps

1. **Choose solution:**
   - Option 1: Start local MongoDB service
   - Option 2: Setup MongoDB Atlas (recommended)

2. **Test connection:**
   ```bash
   npm run test:mongodb
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Test homepage creation:**
   - Navigate to `/admin/homepage/new`
   - Fill form và submit
   - Verify success

---

**Status:** 🔧 **AWAITING USER ACTION**

Vui lòng:
1. Start MongoDB service (local) hoặc setup MongoDB Atlas (cloud)
2. Run `npm run test:mongodb` để verify
3. Restart dev server và test lại

