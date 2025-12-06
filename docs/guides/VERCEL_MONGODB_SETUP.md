# 🔧 Cấu hình MongoDB trên Vercel

Hướng dẫn chi tiết để cấu hình MongoDB connection trên Vercel deployment.

---

## 🚨 Nguyên nhân MongoDB chưa kết nối trên Vercel

### 1. **Environment Variables chưa được cấu hình**

Vercel cần environment variables được set trong dashboard, không đọc từ `.env.local`.

### 2. **Logic `isBuildPhase()` sai** (đã fix)

Code cũ đang detect `VERCEL === '1'` như là build phase, nhưng biến này luôn true cả trong runtime.

### 3. **MongoDB Atlas Network Access**

Nếu dùng MongoDB Atlas, cần whitelist Vercel IP addresses.

---

## ✅ Giải pháp

### Bước 1: Thêm `MONGODB_URI` vào Vercel Environment Variables

1. **Truy cập Vercel Dashboard:**
   - Vào: https://vercel.com/dashboard
   - Chọn project của bạn

2. **Vào Settings → Environment Variables:**
   - Click vào project
   - Click tab **Settings**
   - Click **Environment Variables** ở sidebar

3. **Thêm `MONGODB_URI`:**

   **Nếu dùng MongoDB Atlas:**
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://username:password@cluster.mongodb.net/teddy-shop?retryWrites=true&w=majority
   ```

   **Nếu dùng MongoDB local (không khuyến khích):**
   ```
   Key: MONGODB_URI
   Value: mongodb://your-server-ip:27017/teddy-shop
   ```

4. **Chọn Environments:**
   - ✅ Production
   - ✅ Preview (optional - cho preview deployments)
   - ✅ Development (optional - cho local development)

5. **Save và Redeploy:**
   - Click **Save**
   - Vào **Deployments** tab
   - Click **Redeploy** để apply environment variables mới

---

### Bước 2: Cấu hình MongoDB Atlas Network Access (nếu dùng Atlas)

1. **Vào MongoDB Atlas Dashboard:**
   - https://cloud.mongodb.com/
   - Login và chọn cluster của bạn

2. **Vào Network Access:**
   - Click **Network Access** ở sidebar
   - Click **Add IP Address**

3. **Whitelist Vercel IPs:**
   
   **Option 1: Whitelist tất cả IPs (dễ nhưng kém bảo mật):**
   - IP Address: `0.0.0.0/0`
   - Comment: `Vercel deployments`
   - Click **Confirm**

   **Option 2: Whitelist Vercel IP ranges (khuyến khích):**
   - Xem danh sách IP ranges tại: https://vercel.com/docs/concepts/edge-network/regions
   - Thêm từng range hoặc dùng Vercel's IP ranges

---

### Bước 3: Verify Connection

Sau khi cấu hình xong, kiểm tra:

1. **Check Vercel Logs:**
   - Vào **Deployments** → Click vào deployment mới nhất
   - Xem **Functions** logs
   - Tìm log: `✅ Successfully connected to MongoDB!`

2. **Test API Routes:**
   - Truy cập: `https://your-app.vercel.app/api/products`
   - Nếu connection OK, sẽ trả về products (hoặc empty array)
   - Nếu connection fail, sẽ thấy error trong logs

3. **Check Environment Variables:**
   ```bash
   # Trong Vercel Functions logs, add temporary log:
   console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
   ```

---

## 🔍 Debugging

### Error: "MongoDB URI is not configured"

**Nguyên nhân:** `MONGODB_URI` chưa được set trên Vercel.

**Giải pháp:**
1. Vào Vercel Dashboard → Settings → Environment Variables
2. Verify `MONGODB_URI` có trong list
3. Redeploy application

---

### Error: "MongoNetworkError: ECONNREFUSED"

**Nguyên nhân:** MongoDB Atlas không cho phép connection từ Vercel IPs.

**Giải pháp:**
1. Vào MongoDB Atlas → Network Access
2. Whitelist IP: `0.0.0.0/0` (tạm thời để test)
3. Sau đó có thể hạn chế lại chỉ Vercel IP ranges

---

### Error: "Authentication failed"

**Nguyên nhân:** Username/password trong connection string sai.

**Giải pháp:**
1. Verify username/password trong MongoDB Atlas
2. Update `MONGODB_URI` trên Vercel với credentials đúng
3. Lưu ý: Password có ký tự đặc biệt cần URL encode

**URL Encoding cho password:**
```javascript
// Example: Password có @ symbol
// Before: password@123
// After: password%40123

// Use online tool: https://www.urlencoder.org/
```

---

### Error: "Cannot read properties of null (reading 'findOne')"

**Nguyên nhân:** MongoDB connection chưa ready khi API được gọi.

**Giải pháp:** (Đã fix trong code)
- Code đã thêm null checks trong tất cả API routes
- Nếu connection chưa ready, sẽ trả về empty data thay vì error

---

## 📋 Checklist

- [ ] `MONGODB_URI` đã được add vào Vercel Environment Variables
- [ ] Environment variables đã được apply cho **Production** environment
- [ ] MongoDB Atlas Network Access đã whitelist Vercel IPs
- [ ] Đã redeploy application sau khi thêm env vars
- [ ] Đã verify connection qua Vercel logs
- [ ] API routes trả về data (hoặc empty array) thay vì error

---

## 🔗 References

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Network Access](https://docs.atlas.mongodb.com/security/ip-access-list/)
- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

---

**Lưu ý quan trọng:**

1. **Không commit `.env.local` lên Git** - Vercel không đọc từ file này
2. **Environment Variables phải được set trong Vercel Dashboard**
3. **Sau khi thêm env vars, phải redeploy để apply**
4. **MongoDB Atlas cần whitelist Vercel IPs để connection thành công**

