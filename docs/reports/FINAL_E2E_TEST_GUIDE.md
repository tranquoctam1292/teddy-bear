# Final End-to-End Test Guide - Teddy Shop Upgrade

**Ngày tạo:** 2025-12-04  
**Mục tiêu:** Kiểm tra toàn bộ luồng từ CMS → Database → Frontend → Cart  
**Thời gian ước tính:** 15-20 phút  
**Người thực hiện:** QA Lead / Developer

---

## 🎯 Kịch bản: "Hành trình của một sản phẩm mới"

Test một luồng đi hoàn chỉnh từ tạo sản phẩm trong CMS đến khách hàng thêm vào giỏ hàng.

---

## ✅ Pre-Test Setup

- [ ] **Development Server đang chạy:**

  ```bash
  npm run dev
  ```

  - [ ] Server start thành công tại `http://localhost:3000`
  - [ ] Không có errors trong console

- [ ] **Database Connection:**

  - [ ] MongoDB đang chạy (local hoặc Atlas)
  - [ ] Connection string đúng trong `.env.local`
  - [ ] Test connection: `npm run test:db` → PASS

- [ ] **Admin Access:**
  - [ ] Đã login vào admin panel: `http://localhost:3000/admin/login`
  - [ ] Có quyền tạo/sửa sản phẩm

---

## 📝 Bước 1: Tạo Sản Phẩm Phức Tạp (CMS - Phase 2)

**Mục tiêu:** Tạo sản phẩm với đầy đủ tính năng mới trong CMS

### 1.1. Truy cập Form Tạo Sản Phẩm

- [ ] Vào URL: `http://localhost:3000/admin/products/new`
- [ ] Form load thành công, không có lỗi
- [ ] Tất cả sections hiển thị (Basic Info, Product Details, Variants, Media, Gift, Collection)

### 1.2. Điền Thông Tin Cơ Bản

- [ ] **Tên sản phẩm:** "Gấu Bông Test E2E - Premium"
- [ ] **Slug:** Tự động generate hoặc nhập thủ công
- [ ] **Category:** Chọn một category (VD: "teddy")
- [ ] **Mô tả:** Nhập HTML description (có thể dùng Rich Text Editor)
- [ ] **Tags:** Thêm 2-3 tags (VD: "Best Seller", "Valentine")

### 1.3. Product Details Section

- [ ] **Material:** "Bông gòn cao cấp"
- [ ] **Dimensions:**
  - Length: `80`
  - Width: `50`
  - Height: `60`
- [ ] **Weight:** `800` (gram)
- [ ] **Age Range:** "3+"
- [ ] **Care Instructions:** Nhập HTML text (VD: "Giặt tay nhẹ nhàng")
- [ ] **Safety Info:** Nhập HTML text (VD: "An toàn cho trẻ em")
- [ ] **Warranty:** "6 tháng"

### 1.4. Variants & Stock

- [ ] **Thêm Variant 1:**

  - Size: "80cm"
  - Price: `250000`
  - Stock: `100`
  - Color: "Hồng" (nếu có)
  - **Image:** Upload ảnh cho variant này
  - **Is Popular:** ✅ Check

- [ ] **Thêm Variant 2:**
  - Size: "100cm"
  - Price: `350000`
  - Stock: `50`
  - Color: "Xanh" (nếu có)
  - **Image:** Upload ảnh khác
  - **Is Popular:** ❌ Uncheck

### 1.5. Media Extended Section

- [ ] **Video URL:**
  - Nhập YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - Hoặc Vimeo URL
- [ ] **Video Thumbnail:** Upload ảnh thumbnail
- [ ] **Images 360:** Upload ít nhất 3 ảnh (để test 360 view)
- [ ] **Lifestyle Images:** Upload 2-3 ảnh lifestyle

### 1.6. Gift Features Section

- [ ] **Gift Wrapping:** ✅ Bật switch
- [ ] **Gift Wrapping Options:**
  - ✅ "Hộp giấy"
  - ✅ "Túi vải"
  - ✅ "Hộp cao cấp"
- [ ] **Gift Message Enabled:** ✅ Bật switch
- [ ] **Gift Message Template:** "Chúc mừng sinh nhật!"
- [ ] **Special Occasions:**
  - ✅ "Valentine"
  - ✅ "Sinh nhật"
  - ✅ "Giáng sinh"

### 1.7. Collection & Combo Section

- [ ] **Collection:** Nhập tên collection (VD: "Premium Collection")
- [ ] **Related Products:**
  - Search và chọn 2-3 sản phẩm liên quan
  - Products được thêm vào list
- [ ] **Combo Products:**
  - Click "Add Item"
  - Chọn sản phẩm combo 1
  - Discount: `10` (%)
  - Click "Add Item" lần nữa
  - Chọn sản phẩm combo 2
  - Discount: `15` (%)
- [ ] **Bundle Discount:** `5` (%)

### 1.8. Submit Form

- [ ] Click nút "Lưu" hoặc "Publish"
- [ ] **Checkpoint:** ✅ Form submit thành công
- [ ] **Checkpoint:** ✅ Không có lỗi validation (màu đỏ)
- [ ] **Checkpoint:** ✅ Redirect đến trang edit hoặc list products
- [ ] **Checkpoint:** ✅ Toast notification hiển thị "Đã lưu thành công"
- [ ] **Ghi lại Product ID/Slug:** `_________________`

---

## 🗄️ Bước 2: Kiểm tra Dữ liệu (Database - Phase 1)

**Mục tiêu:** Verify dữ liệu đã được lưu đúng vào MongoDB

### 2.1. Truy cập Database

**Option A: MongoDB Compass**

- [ ] Mở MongoDB Compass
- [ ] Connect đến database
- [ ] Navigate đến collection `products`
- [ ] Tìm product vừa tạo (search by name hoặc slug)

**Option B: Script Verification**

- [ ] Chạy script: `npx tsx scripts/verify-phase1.ts`
- [ ] Script chạy thành công
- [ ] Kiểm tra output log

### 2.2. Verify Basic Fields

- [ ] **name:** "Gấu Bông Test E2E - Premium"
- [ ] **slug:** Đúng format (lowercase, hyphenated)
- [ ] **category:** Đúng category đã chọn
- [ ] **description:** Có HTML content
- [ ] **tags:** Array có 2-3 items

### 2.3. Verify Product Details Fields

- [ ] **material:** "Bông gòn cao cấp"
- [ ] **dimensions:**
  - `length: 80`
  - `width: 50`
  - `height: 60`
- [ ] **weight:** `800`
- [ ] **ageRange:** "3+"
- [ ] **careInstructions:** Có HTML content
- [ ] **safetyInfo:** Có HTML content
- [ ] **warranty:** "6 tháng"

### 2.4. Verify Variants

- [ ] **variants:** Array có 2 items
- [ ] **Variant 1:**
  - `size: "80cm"`
  - `price: 250000`
  - `stock: 100`
  - `image:` Có URL
  - `isPopular: true`
- [ ] **Variant 2:**
  - `size: "100cm"`
  - `price: 350000`
  - `stock: 50`
  - `image:` Có URL
  - `isPopular: false`

### 2.5. Verify Media Fields

- [ ] **videoUrl:** Có YouTube/Vimeo URL
- [ ] **videoThumbnail:** Có image URL
- [ ] **images360:** Array có ít nhất 3 URLs
- [ ] **lifestyleImages:** Array có 2-3 URLs

### 2.6. Verify Gift Features

- [ ] **giftWrapping:** `true` ✅
- [ ] **giftWrappingOptions:** Array có 3 items ["Hộp giấy", "Túi vải", "Hộp cao cấp"]
- [ ] **giftMessageEnabled:** `true`
- [ ] **giftMessageTemplate:** "Chúc mừng sinh nhật!"
- [ ] **specialOccasions:** Array có 3 items ["Valentine", "Sinh nhật", "Giáng sinh"]

### 2.7. Verify Collection & Combo

- [ ] **collection:** "Premium Collection"
- [ ] **relatedProducts:** Array có 2-3 product IDs
- [ ] **comboProducts:** Array có 2 items
  - Item 1: `productId`, `productName`, `discount: 10`
  - Item 2: `productId`, `productName`, `discount: 15`
- [ ] **bundleDiscount:** `5`

### 2.8. Verify Indexes (Optional)

- [ ] Chạy: `npx tsx scripts/create-product-indexes.ts`
- [ ] Verify indexes đã được tạo:
  - `collection_1`
  - `specialOccasions_1`
  - `relatedProducts_1`

**Checkpoint:** ✅ Tất cả fields đều có giá trị đúng như đã nhập trong CMS

---

## 🎨 Bước 3: Trải nghiệm Khách hàng (Frontend - Phase 3)

**Mục tiêu:** Test UI/UX trên trang product detail

### 3.1. Truy cập Product Page

- [ ] Vào URL: `http://localhost:3000/products/[slug-san-pham-vua-tao]`
- [ ] Page load thành công, không có lỗi 404
- [ ] Không có errors trong browser console

### 3.2. Product Gallery Enhanced

- [ ] **Main Image:**

  - [ ] Ảnh chính hiển thị (variant image hoặc product image)
  - [ ] **Hover Zoom:** Hover vào ảnh → Ảnh phóng to 2x
  - [ ] Zoom origin thay đổi theo vị trí chuột

- [ ] **Video Support:**

  - [ ] Thumbnail video hiển thị với Play button overlay
  - [ ] Click Play button → Modal mở ra
  - [ ] Video player hiển thị đúng (YouTube/Vimeo)
  - [ ] Video có thể play/pause
  - [ ] Đóng modal → Modal đóng

- [ ] **360 View:**

  - [ ] Nút "Xem 360°" hiển thị (nếu có images360)
  - [ ] Click nút → Modal 360 view mở ra
  - [ ] Ảnh 360 đầu tiên hiển thị
  - [ ] Click arrow phải → Chuyển sang ảnh tiếp theo
  - [ ] Click arrow trái → Chuyển về ảnh trước
  - [ ] Thumbnails dots hiển thị ở dưới
  - [ ] Click thumbnail → Chuyển đến ảnh đó

- [ ] **Thumbnail Gallery:**
  - [ ] Grid thumbnails hiển thị bên dưới
  - [ ] Thumbnail của ảnh đang chọn có border highlight
  - [ ] Click thumbnail → Ảnh chính chuyển

### 3.3. Product Information

- [ ] **Product Name:** Hiển thị đúng
- [ ] **Price:** Hiển thị đúng (variant price hoặc minPrice)
- [ ] **Rating:** Hiển thị (nếu có)
- [ ] **Category Badge:** Hiển thị
- [ ] **Tags:** Hiển thị các tags

### 3.4. Variant Selector

- [ ] **Size Options:** Hiển thị 2 variants (80cm, 100cm)
- [ ] Click variant "80cm" → Variant được chọn (highlight)
- [ ] Price cập nhật theo variant
- [ ] Image chính chuyển sang variant image (nếu có)
- [ ] Stock hiển thị: "Còn X sản phẩm"

### 3.5. Gift Features Section

- [ ] **Section hiển thị:** Section "Tùy chọn quà tặng" có pink background
- [ ] **Gift Wrapping Options:**

  - [ ] Radio buttons hiển thị: "Hộp giấy", "Túi vải", "Hộp cao cấp"
  - [ ] Click "Hộp giấy" → Radio button được tick
  - [ ] Chỉ một option được chọn tại một thời điểm

- [ ] **Gift Message:**

  - [ ] Textarea "Lời chúc" hiển thị
  - [ ] Placeholder hiển thị: "Chúc mừng sinh nhật!"
  - [ ] Nhập text: "Chúc bạn sinh nhật vui vẻ!"
  - [ ] Text được lưu trong textarea

- [ ] **Special Occasions:**
  - [ ] Badges hiển thị: "Valentine", "Sinh nhật", "Giáng sinh"
  - [ ] Badges có màu pink

### 3.6. Product Tabs

- [ ] **Tab Navigation:**

  - [ ] 4 tabs hiển thị: "Mô tả", "Chi tiết", "Đánh giá", "Bảo hành & Hướng dẫn"
  - [ ] Tab "Mô tả" active mặc định

- [ ] **Tab "Mô tả":**

  - [ ] Click tab "Mô tả"
  - [ ] HTML description được render đúng (không hiển thị raw HTML)
  - [ ] Prose styling áp dụng

- [ ] **Tab "Chi tiết":**

  - [ ] Click tab "Chi tiết"
  - [ ] ProductSpecsTable hiển thị
  - [ ] Bảng có 5 rows:
    - Kích thước: "80 x 50 x 60 cm"
    - Trọng lượng: "800 gram"
    - Chất liệu: "Bông gòn cao cấp"
    - Độ tuổi: "3+"
    - Bảo hành: "6 tháng"

- [ ] **Tab "Bảo hành & Hướng dẫn":**

  - [ ] Click tab "Bảo hành & Hướng dẫn"
  - [ ] Section "Hướng dẫn bảo quản" hiển thị với HTML content
  - [ ] Section "Thông tin an toàn" hiển thị với HTML content
  - [ ] Section "Chính sách bảo hành" hiển thị: "6 tháng"

- [ ] **Tab "Đánh giá":**
  - [ ] Click tab "Đánh giá"
  - [ ] Placeholder text hiển thị: "Chức năng đánh giá sẽ sớm ra mắt!"

### 3.7. Combo Products Section

- [ ] **Section hiển thị:** Section "Combo sản phẩm" hiển thị
- [ ] **Badge:** Badge "Giảm 5%" hiển thị (bundle discount)
- [ ] **Combo Items List:**

  - [ ] 2 items hiển thị với tên sản phẩm
  - [ ] Mỗi item có giá gốc và giá sau giảm
  - [ ] Badge discount cho từng item (-10%, -15%)

- [ ] **Savings Display:**

  - [ ] Section "Tiết kiệm: X₫" hiển thị
  - [ ] Calculation đúng (tổng tiết kiệm sau tất cả discounts)

- [ ] **Add All Button:**
  - [ ] Nút "Thêm tất cả vào giỏ hàng" hiển thị
  - [ ] (Optional) Click nút → Toast notification hiển thị

### 3.8. Related Products Section

- [ ] **Section hiển thị:** Section "Sản phẩm liên quan" hiển thị
- [ ] **Grid Layout:**

  - [ ] Grid 2 cols (mobile) hoặc 4 cols (desktop)
  - [ ] 2-3 product cards hiển thị
  - [ ] Mỗi card có: Ảnh, tên, giá

- [ ] **Product Cards:**
  - [ ] Click vào card → Navigate đến trang chi tiết sản phẩm
  - [ ] Cards responsive (không bị overflow)

### 3.9. Social Share

- [ ] **Buttons hiển thị:** 3 buttons: Facebook, Zalo, Copy link
- [ ] **Facebook Share:**

  - [ ] Click button → Popup window mở ra
  - [ ] URL Facebook shareer với product URL

- [ ] **Zalo Share:**

  - [ ] Click button → Popup window mở ra
  - [ ] URL Zalo shareer với product URL và title

- [ ] **Copy Link:**
  - [ ] Click button → Toast notification: "Đã sao chép"
  - [ ] Button text thay đổi thành "Đã sao chép"
  - [ ] Paste clipboard → URL đúng format

**Checkpoint:** ✅ Tất cả UI components hoạt động đúng, không có lỗi

---

## 🛒 Bước 4: Chốt đơn (Integration)

**Mục tiêu:** Test luồng Add to Cart với gift options

### 4.1. Add to Cart với Gift Options

- [ ] **Chọn Variant:**

  - [ ] Chọn variant "80cm"
  - [ ] Price cập nhật: 250,000₫

- [ ] **Chọn Gift Options:**

  - [ ] Chọn gói quà: "Hộp giấy"
  - [ ] Nhập lời chúc: "Chúc bạn sinh nhật vui vẻ!"

- [ ] **Quantity:**

  - [ ] Set quantity: `2`
  - [ ] Quantity selector hoạt động (+/- buttons)

- [ ] **Add to Cart:**
  - [ ] Click nút "Thêm vào giỏ hàng"
  - [ ] **Checkpoint:** ✅ Toast notification hiển thị: "Đã thêm vào giỏ hàng"
  - [ ] **Checkpoint:** ✅ Description: Tên sản phẩm và size
  - [ ] **Checkpoint:** ✅ Không có errors trong console

### 4.2. Verify Cart Store (DevTools)

- [ ] Mở DevTools → Application/Storage → Local Storage
- [ ] Tìm key: `teddy-shop-cart`
- [ ] **Checkpoint:** ✅ Cart item có structure:
  ```json
  {
    "productId": "...",
    "variantId": "...",
    "name": "Gấu Bông Test E2E - Premium",
    "size": "80cm",
    "price": 250000,
    "quantity": 2,
    "image": "...",
    "giftWrappingOption": "Hộp giấy",
    "giftMessage": "Chúc bạn sinh nhật vui vẻ!"
  }
  ```

### 4.3. Cart Page Verification

- [ ] Navigate đến: `http://localhost:3000/cart`
- [ ] **Checkpoint:** ✅ Product hiển thị trong cart
- [ ] **Checkpoint:** ✅ Product name, size, price, quantity đúng
- [ ] **Checkpoint:** ✅ Product image hiển thị

- [ ] **Gift Options Display:**

  - [ ] **Checkpoint:** ✅ Text hiển thị: "Gói quà: Hộp giấy" (hoặc tương tự)
  - [ ] **Checkpoint:** ✅ Text hiển thị: "Lời chúc: Chúc bạn sinh nhật vui vẻ!" (hoặc tương tự)
  - [ ] **Checkpoint:** ✅ Gift options được lưu và hiển thị đúng

- [ ] **Cart Total:**
  - [ ] Subtotal: 500,000₫ (250,000 x 2)
  - [ ] Total calculation đúng

**Checkpoint:** ✅ Gift options đã được truyền từ Frontend → Cart Store → Cart Page

---

## ✅ Bước 5: Pre-deploy Check (Phase 4)

**Mục tiêu:** Verify code quality trước khi deploy

### 5.1. Run Pre-Deploy Script

- [ ] Chạy lệnh:
  ```bash
  npx tsx scripts/pre-deploy-check.ts
  ```
  Hoặc:
  ```bash
  npm run pre-deploy
  ```

### 5.2. Verify Checks

- [ ] **Required Files Check:** ✅ PASS
- [ ] **TypeScript Type Check:** ✅ PASS (hoặc chỉ warnings, không có errors)
- [ ] **ESLint Check:** ✅ PASS (hoặc chỉ warnings, không có errors)
- [ ] **Unit Tests:** ✅ PASS (22/22 tests)
- [ ] **Production Build:** ✅ PASS

### 5.3. Build Output

- [ ] **Checkpoint:** ✅ Script output: "✅ READY TO DEPLOY"
- [ ] **Checkpoint:** ✅ Exit code: `0`
- [ ] **Checkpoint:** ✅ Không có critical errors

**Checkpoint:** ✅ Tất cả checks đều PASS, code sẵn sàng deploy

---

## 📊 Test Results Summary

**Ngày test:** **\*\***\_\_\_**\*\***  
**Người test:** **\*\***\_\_\_**\*\***  
**Environment:** Development / Staging  
**Browser:** Chrome / Firefox / Safari / Edge  
**Device:** Desktop / Tablet / Mobile

### Overall Status

- [ ] ✅ **PASS** - Tất cả checkpoints đều pass
- [ ] ❌ **FAIL** - Có checkpoints fail (xem chi tiết bên dưới)

### Failed Checkpoints

| Bước | Checkpoint | Issue | Screenshot/Notes |
| ---- | ---------- | ----- | ---------------- |
|      |            |       |                  |

### Performance Notes

- **Page Load Time:** **\_\_\_** ms
- **Form Submit Time:** **\_\_\_** ms
- **Cart Update Time:** **\_\_\_** ms

### Issues Found

-
-
- ***

## ✅ Final Sign-off

- [ ] **Bước 1 (CMS):** ✅ PASS
- [ ] **Bước 2 (Database):** ✅ PASS
- [ ] **Bước 3 (Frontend):** ✅ PASS
- [ ] **Bước 4 (Integration):** ✅ PASS
- [ ] **Bước 5 (Pre-deploy):** ✅ PASS

**Status:** ✅ **READY FOR PRODUCTION** / ❌ **ISSUES FOUND**

---

## 🚀 Next Steps

Nếu tất cả checkpoints đều PASS:

1. ✅ Review code một lần nữa
2. ✅ Follow `DEPLOYMENT_CHECKLIST.md` để chuẩn bị deploy
3. ✅ Deploy lên Vercel Production
4. ✅ Run smoke tests trên production

Nếu có checkpoints FAIL:

1. ❌ Document issues trong section "Failed Checkpoints"
2. ❌ Fix issues và re-test
3. ❌ Re-run E2E test cho đến khi tất cả pass

---

**Generated:** 2025-12-04  
**Version:** Phase 4 - Final E2E Test  
**Last Updated:** 2025-12-04
