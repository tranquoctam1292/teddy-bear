# 🚀 DEPLOY LÊN VERCEL - HƯỚNG DẪN CHI TIẾT

## ✅ **ĐÃ HOÀN THÀNH:**

- ✅ 19 bugs fixed
- ✅ Code pushed lên GitHub
- ✅ Pre-push hook optimized
- ✅ Sẵn sàng deploy 100%

---

## 📋 **BƯỚC 1: CHUẨN BỊ ENVIRONMENT VARIABLES**

### **⚠️ QUAN TRỌNG: Tạo giá trị MỚI cho production!**

```bash
# 1. Generate AUTH_SECRET (BẮT BUỘC - Tạo mới!)
openssl rand -base64 32
# Output example: aK9mN2pQ8rT3sV6wX1yZ4bC7dE0fG5hI2jK8lM

# 2. Chuẩn bị các values:
```

### **Required Environment Variables (7 vars):**

```env
# ⚠️ Tạo TOÀN BỘ giá trị mới - KHÔNG copy từ .env.example!

AUTH_SECRET=<paste-result-from-openssl-command-above>
NEXTAUTH_URL=https://your-domain.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teddy-shop
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-super-strong-password-123!@#
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📋 **BƯỚC 2: TẠO VERCEL BLOB STORAGE**

### **2.1. Tạo Blob Store:**

1. Truy cập: https://vercel.com/dashboard/stores
2. Click **"Create Database"** hoặc **"New"**
3. Chọn **"Blob"**
4. Đặt tên: `teddy-shop-uploads`
5. Click **"Create"**

### **2.2. Lấy Token:**

1. Sau khi tạo, click vào Blob store vừa tạo
2. Tab **"Settings"** → **"Tokens"**
3. Click **"Generate New Token"**
4. Copy token (bắt đầu bằng `vercel_blob_rw_...`)
5. **LƯU LẠI** token này (chỉ hiện 1 lần!)

---

## 📋 **BƯỚC 3: SETUP MONGODB ATLAS (Nếu chưa có)**

### **3.1. Tạo Cluster (Free):**

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Tạo tài khoản miễn phí
3. Create **Free Cluster** (M0)
4. Chọn region gần Việt Nam (Singapore/Tokyo)
5. Đặt tên cluster: `teddy-shop`

### **3.2. Tạo Database User:**

1. Sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `teddyadmin` (hoặc tên khác)
4. Password: **Tạo password mạnh** (click Generate)
5. **LƯU LẠI** username và password
6. Database User Privileges: **"Atlas Admin"**
7. Click **"Add User"**

### **3.3. Whitelist IP:**

1. Sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (cho Vercel)
4. IP: `0.0.0.0/0`
5. Click **"Confirm"**

### **3.4. Lấy Connection String:**

1. Sidebar → **"Database"** → Click **"Connect"**
2. Chọn **"Connect your application"**
3. Driver: **Node.js**, Version: **6.7 or later**
4. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Thay thế:
   - `<username>` → username bạn đã tạo
   - `<password>` → password bạn đã tạo
   - Thêm `/teddy-shop` vào cuối (tên database)

   **Result:**

   ```
   mongodb+srv://teddyadmin:YourPassword123@cluster0.xxxxx.mongodb.net/teddy-shop
   ```

---

## 📋 **BƯỚC 4: DEPLOY LÊN VERCEL**

### **4.1. Import Repository:**

1. Truy cập: https://vercel.com/new
2. Login với tài khoản có access vào repo GitHub
3. Click **"Import"** bên cạnh repo `teddy-bear`
4. (Nếu không thấy repo → Click **"Adjust GitHub App Permissions"**)

### **4.2. Configure Project:**

**Framework Preset:** `Next.js`  
**Root Directory:** `.` (default)  
**Build Command:** `npm run build` (default)  
**Output Directory:** `.next` (default)  
**Install Command:** `npm ci` (default)

### **4.3. Add Environment Variables:**

Click **"Environment Variables"** và thêm **TẤT CẢ 7 biến**:

| Variable                | Value                            | Example                        |
| ----------------------- | -------------------------------- | ------------------------------ |
| `AUTH_SECRET`           | <result-from-openssl>            | `aK9mN2pQ8rT3sV6wX1yZ...`      |
| `NEXTAUTH_URL`          | `https://your-domain.vercel.app` | ⚠️ Sẽ update sau               |
| `MONGODB_URI`           | <connection-string-from-atlas>   | `mongodb+srv://teddyadmin:...` |
| `ADMIN_EMAIL`           | `admin@yourdomain.com`           | Email đăng nhập admin          |
| `ADMIN_PASSWORD`        | <strong-password>                | Password mạnh                  |
| `NEXT_PUBLIC_SITE_URL`  | `https://your-domain.vercel.app` | ⚠️ Sẽ update sau               |
| `BLOB_READ_WRITE_TOKEN` | <token-from-blob-storage>        | `vercel_blob_rw_...`           |

**⚠️ LƯU Ý:**

- `NEXTAUTH_URL` và `NEXT_PUBLIC_SITE_URL`: Tạm thời để `https://your-project.vercel.app`, sau deploy sẽ update
- Apply to: **Production, Preview, Development** (chọn cả 3)

### **4.4. Deploy:**

1. Click **"Deploy"**
2. Chờ 3-5 phút
3. Vercel sẽ build và deploy

---

## 📋 **BƯỚC 5: CẬP NHẬT URLs SAU DEPLOY**

### **5.1. Lấy Production URL:**

Sau khi deploy xong, bạn sẽ có URL như:

```
https://teddy-bear-abc123xyz.vercel.app
```

### **5.2. Update Environment Variables:**

1. Vào **Vercel Dashboard** → Your Project → **"Settings"** → **"Environment Variables"**
2. Update 2 biến sau:

| Variable               | Old Value                        | New Value                                 |
| ---------------------- | -------------------------------- | ----------------------------------------- |
| `NEXTAUTH_URL`         | `https://your-domain.vercel.app` | `https://teddy-bear-abc123xyz.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | `https://teddy-bear-abc123xyz.vercel.app` |

3. Click **"Save"**

### **5.3. Redeploy:**

1. Tab **"Deployments"**
2. Click **"..."** bên deployment mới nhất
3. Click **"Redeploy"**
4. Chờ 2-3 phút

---

## 📋 **BƯỚC 6: TẠO ADMIN USER**

### **6.1. Kết nối MongoDB:**

```bash
# Cách 1: Trực tiếp từ MongoDB Atlas Compass
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Paste connection string
3. Connect

# Cách 2: Từ local machine (nếu có MongoDB client)
mongosh "mongodb+srv://teddyadmin:password@cluster0.xxxxx.mongodb.net/teddy-shop"
```

### **6.2. Admin user sẽ tự động tạo:**

Admin user được tạo tự động khi bạn:

1. Truy cập `/admin/login` lần đầu
2. System sẽ check `ADMIN_EMAIL` và `ADMIN_PASSWORD` từ env vars
3. Tạo user nếu chưa tồn tại

**Hoặc chạy script thủ công:**

```bash
# Local (nếu có code)
npm run reset:admin
```

---

## 📋 **BƯỚC 7: KIỂM TRA DEPLOYMENT**

### **7.1. Test Trang Chủ:**

```
https://your-domain.vercel.app
```

✅ Expect: Trang chủ shop hiển thị

### **7.2. Test Admin Login:**

```
https://your-domain.vercel.app/admin/login
```

✅ Expect: Trang login hiển thị

### **7.3. Login Admin:**

- Email: `<ADMIN_EMAIL từ env vars>`
- Password: `<ADMIN_PASSWORD từ env vars>`

✅ Expect: Đăng nhập thành công → Dashboard

### **7.4. Test Features:**

- ✅ Dashboard hiển thị stats
- ✅ Products listing
- ✅ Orders listing
- ✅ Settings page
- ✅ Media upload

---

## 📋 **BƯỚC 8: CUSTOM DOMAIN (Optional)**

### **8.1. Thêm Domain:**

1. Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Nhập domain: `teddyshop.vn` (ví dụ)
4. Click **"Add"**

### **8.2. Config DNS:**

Vercel sẽ hiển thị DNS records cần add:

**For Root Domain (`teddyshop.vn`):**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW (`www.teddyshop.vn`):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### **8.3. Update Environment Variables:**

Sau khi domain hoạt động, update lại:

```
NEXTAUTH_URL=https://teddyshop.vn
NEXT_PUBLIC_SITE_URL=https://teddyshop.vn
```

Redeploy 1 lần nữa.

---

## 🎯 **CHECKLIST DEPLOY:**

### **Trước Deploy:**

- [x] 19 bugs fixed
- [x] Code pushed lên GitHub
- [x] Generated `AUTH_SECRET`
- [x] Có MongoDB Atlas connection string
- [x] Có Vercel Blob token
- [x] Có admin email & password

### **Trong Deploy:**

- [ ] Import repo vào Vercel
- [ ] Add đủ 7 environment variables
- [ ] Deploy thành công
- [ ] Update `NEXTAUTH_URL` & `NEXT_PUBLIC_SITE_URL`
- [ ] Redeploy

### **Sau Deploy:**

- [ ] Test trang chủ
- [ ] Test admin login
- [ ] Test upload media
- [ ] Test tạo product
- [ ] Test tạo blog post
- [ ] (Optional) Add custom domain

---

## ⚠️ **TROUBLESHOOTING:**

### **Lỗi: "Failed to build"**

- Check build logs trong Vercel
- Thường do thiếu env vars
- Verify tất cả 7 biến đã add đúng

### **Lỗi: "AUTH_SECRET is required"**

- Chưa add `AUTH_SECRET` vào Vercel
- Hoặc value bị empty
- Generate lại: `openssl rand -base64 32`

### **Lỗi: "Cannot connect to database"**

- Check `MONGODB_URI` đúng format
- Check MongoDB Atlas Network Access cho phép `0.0.0.0/0`
- Check database user có permissions

### **Lỗi: "Cannot upload images"**

- Check `BLOB_READ_WRITE_TOKEN` đúng
- Check Vercel Blob store đã tạo
- Token phải bắt đầu `vercel_blob_rw_`

### **Lỗi: "Redirect loop" khi login**

- `NEXTAUTH_URL` phải match exactly với production URL
- Không có trailing slash `/`
- Format: `https://domain.com` (không có `http`)

---

## 🎊 **SUMMARY:**

```
1. Generate AUTH_SECRET ✅
2. Tạo Vercel Blob Storage ✅
3. Setup MongoDB Atlas ✅
4. Deploy lên Vercel ✅
5. Update URLs ✅
6. Redeploy ✅
7. Test site ✅
8. Login admin ✅

Total Time: ~15 minutes
Result: LIVE PRODUCTION SITE! 🚀
```

---

## 💰 **CHI PHÍ:**

| Service        | Plan      | Cost           |
| -------------- | --------- | -------------- |
| Vercel Hosting | Hobby     | **FREE**       |
| MongoDB Atlas  | M0 Free   | **FREE**       |
| Vercel Blob    | Free Tier | **FREE** (1GB) |
| **TOTAL**      |           | **$0/month**   |

**Paid Plans (khi scale):**

- Vercel Pro: $20/month
- MongoDB M10: $9/month
- Vercel Blob: $0.15/GB
- **Total**: ~$30/month (khi có traffic)

---

## 📱 **TIẾP THEO:**

1. ✅ **Test thật kỹ tất cả features**
2. ✅ **Tạo vài sản phẩm mẫu**
3. ✅ **Viết vài blog posts**
4. ✅ **Setup Google Analytics** (optional)
5. ✅ **Setup Facebook Pixel** (optional)
6. ✅ **Marketing & SEO!**

---

# 🎉 **GO DEPLOY! MAKE MONEY! 💰**

**Repository:** https://github.com/tranquoctam1292/teddy-bear  
**Deploy:** https://vercel.com/new  
**Status:** READY! 🚀
