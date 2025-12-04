# Hướng Dẫn Kết Nối MongoDB với Dự Án

## 📋 Tình Trạng Hiện Tại

✅ File `.env.local` đã được cấu hình  
✅ MongoDB đang chạy trên `localhost:27017`  
✅ Connection string: `mongodb://localhost:27017/teddy-shop`

## 🔌 Kết Nối với MongoDB Compass

### Bước 1: Mở MongoDB Compass

1. Mở ứng dụng **MongoDB Compass** (đã thấy bạn đang mở)
2. Click vào nút **"+ Add new connection"** (màu xanh lá)

### Bước 2: Nhập Connection String

Trong cửa sổ "New Connection", nhập connection string:

```
mongodb://localhost:27017/teddy-shop
```

Hoặc nếu không có database name:
```
mongodb://localhost:27017
```

### Bước 3: Kết Nối

1. Click nút **"Connect"** (màu xanh lá)
2. Nếu thành công, bạn sẽ thấy database `teddy-shop` trong danh sách bên trái

## 🧪 Test Kết Nối từ Dự Án

### Cách 1: Chạy Migration Script (Khuyến nghị)

Script này sẽ:
- Test kết nối MongoDB
- Import mock data vào database
- Tạo các collections cần thiết

```bash
# Cài đặt tsx nếu chưa có
npm install -D tsx

# Chạy migration
npx tsx scripts/migrate-mock-data.ts
```

### Cách 2: Test Kết Nối Thủ Công

Tạo file test tạm thời:

```bash
# Tạo file test
npx tsx -e "import('./src/lib/db').then(async (db) => { try { await db.connectDB(); console.log('✅ Connected!'); process.exit(0); } catch(e) { console.error('❌ Error:', e.message); process.exit(1); } })"
```

## 📊 Kiểm Tra Database trong Compass

Sau khi kết nối thành công, bạn sẽ thấy:

### Collections trong Database `teddy-shop`:
- `products` - Sản phẩm
- `orders` - Đơn hàng
- `carts` - Giỏ hàng
- `users` - Người dùng
- `contacts` - Liên hệ
- `posts` - Bài viết
- `navigation` - Menu điều hướng
- `stockReservations` - Đặt chỗ tồn kho

## 🚀 Chạy Migration Data

Sau khi kết nối thành công, chạy migration để import dữ liệu mẫu:

```bash
npx tsx scripts/migrate-mock-data.ts
```

Kết quả mong đợi:
```
🔄 Starting data migration...
📦 Migrating products...
✅ Inserted X products
📋 Migrating orders...
✅ Inserted X orders
...
✅ Migration completed successfully!
```

## 🔧 Troubleshooting

### Lỗi: "connect ECONNREFUSED"

**Nguyên nhân:** MongoDB service chưa chạy

**Giải pháp:**
1. Kiểm tra MongoDB service:
   ```powershell
   Get-Service -Name MongoDB
   ```

2. Khởi động MongoDB service:
   ```powershell
   Start-Service -Name MongoDB
   ```

3. Hoặc khởi động MongoDB thủ công:
   ```bash
   mongod --dbpath "C:\data\db"
   ```

### Lỗi: "MongoDB URI is not configured"

**Nguyên nhân:** File `.env.local` chưa có hoặc thiếu `MONGODB_URI`

**Giải pháp:** Đảm bảo file `.env.local` có dòng:
```
MONGODB_URI=mongodb://localhost:27017/teddy-shop
```

### Lỗi: "Authentication failed"

**Nguyên nhân:** MongoDB yêu cầu authentication

**Giải pháp:** Nếu MongoDB có username/password:
```
MONGODB_URI=mongodb://username:password@localhost:27017/teddy-shop
```

## 🌐 Kết Nối với MongoDB Atlas (Cloud)

Nếu bạn muốn dùng MongoDB Atlas thay vì local:

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster miễn phí
3. Lấy connection string từ Atlas dashboard
4. Cập nhật `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teddy-shop
   ```
5. Thêm IP address vào whitelist trong Atlas

## ✅ Kiểm Tra Kết Nối Thành Công

Sau khi kết nối, bạn có thể:

1. **Xem data trong Compass:**
   - Mở database `teddy-shop`
   - Click vào collection `products`
   - Xem các documents đã được import

2. **Test từ Next.js app:**
   - Chạy `npm run dev`
   - Truy cập trang sản phẩm
   - Data sẽ được lấy từ MongoDB thay vì mock data

## 📝 Lưu Ý

- File `.env.local` đã được thêm vào `.gitignore`, không commit lên git
- Connection string trong `.env.local` chỉ dùng cho development
- Production nên dùng MongoDB Atlas hoặc managed MongoDB service
- Đảm bảo MongoDB service luôn chạy khi development



