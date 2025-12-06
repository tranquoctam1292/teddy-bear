# Phase 3 QA Checklist - Frontend Updates

**Ngày tạo:** 2025-12-04  
**Mục tiêu:** Kiểm tra các tính năng UI/UX phức tạp của trang chi tiết sản phẩm sau Phase 3  
**Người thực hiện:** Developer/QA Engineer

---

## 📋 Tổng quan

Checklist này hướng dẫn kiểm tra thủ công các tính năng UI/UX mà unit tests không thể cover được. Mỗi test case cần được đánh dấu ✅ (PASS) hoặc ❌ (FAIL) kèm theo screenshot/notes nếu có lỗi.

---

## 🎯 Test Environment Setup

- [ ] Đảm bảo đã có sản phẩm test với đầy đủ fields mới:
  - `giftWrapping: true`
  - `videoUrl` (YouTube hoặc Vimeo)
  - `images360` (array ít nhất 3 ảnh)
  - `comboProducts` (ít nhất 2 items)
  - `relatedProducts` (ít nhất 2 product IDs)
- [ ] Mở trang sản phẩm: `/products/[slug]`
- [ ] Đảm bảo đã login (nếu cần cho một số tính năng)
- [ ] Mở DevTools để kiểm tra Network requests và Console errors

---

## 1️⃣ Gallery Experience

### 1.1 Image Zoom

- [ ] **Hover Zoom**
  - **Steps:**
    1. Hover chuột vào ảnh chính (main image)
    2. Di chuyển chuột qua các vùng khác nhau của ảnh
  - **Expected:**
    - ✅ Ảnh phóng to 2x (scale-150)
    - ✅ Transform origin thay đổi theo vị trí chuột
    - ✅ Có indicator "Di chuột để zoom" ở góc trên phải
    - ✅ Smooth transition khi zoom
  - **Notes:** _______________

- [ ] **Zoom on Click (nếu có)**
  - **Steps:**
    1. Click vào ảnh chính
  - **Expected:**
    - ✅ (Nếu implement) Mở lightbox/modal với ảnh full size
  - **Notes:** _______________

### 1.2 Video Support

- [ ] **Video Thumbnail Display**
  - **Steps:**
    1. Kiểm tra ảnh đầu tiên trong gallery
  - **Expected:**
    - ✅ Nếu có `videoUrl`, hiển thị Play button overlay ở giữa ảnh
    - ✅ Play button có icon Play màu pink
    - ✅ Background overlay (bg-black/20) khi hover
  - **Notes:** _______________

- [ ] **Video Modal**
  - **Steps:**
    1. Click vào Play button trên video thumbnail
  - **Expected:**
    - ✅ Modal mở ra với title "Video giới thiệu sản phẩm"
    - ✅ YouTube/Vimeo iframe hiển thị đúng
    - ✅ Video autoplay (nếu có autoplay=1 trong URL)
    - ✅ Có nút X để đóng modal
    - ✅ Click outside modal → Modal đóng
  - **Notes:** _______________

- [ ] **Invalid Video URL Handling**
  - **Steps:**
    1. Tạo sản phẩm với `videoUrl` không hợp lệ (VD: "not-a-url")
    2. Reload trang
  - **Expected:**
    - ✅ Không hiển thị Play button
    - ✅ Không có lỗi trong console
  - **Notes:** _______________

### 1.3 360 View

- [ ] **360 Button Visibility**
  - **Steps:**
    1. Kiểm tra gallery của sản phẩm có `images360`
  - **Expected:**
    - ✅ Nút "Xem 360°" hiển thị ở góc dưới phải của ảnh chính
    - ✅ Nút có icon Image360 và text "Xem 360°"
    - ✅ Nếu không có `images360`, nút không hiển thị
  - **Notes:** _______________

- [ ] **360 Modal**
  - **Steps:**
    1. Click nút "Xem 360°"
  - **Expected:**
    - ✅ Modal mở ra với title "Xem 360 độ (1/3)" (số lượng ảnh)
    - ✅ Ảnh 360 đầu tiên hiển thị
    - ✅ Có navigation arrows (trái/phải)
    - ✅ Có thumbnails dots ở dưới (nếu có nhiều hơn 1 ảnh)
  - **Notes:** _______________

- [ ] **360 Navigation**
  - **Steps:**
    1. Trong 360 modal, click arrow phải
    2. Click arrow trái
    3. Click vào dot thumbnail thứ 2
  - **Expected:**
    - ✅ Ảnh chuyển sang ảnh tiếp theo
    - ✅ Counter cập nhật: "Xem 360 độ (2/3)"
    - ✅ Dot thumbnail thứ 2 được highlight
    - ✅ Smooth transition giữa các ảnh
  - **Notes:** _______________

### 1.4 Thumbnail Gallery

- [ ] **Thumbnail Display**
  - **Steps:**
    1. Kiểm tra grid thumbnails bên dưới ảnh chính
  - **Expected:**
    - ✅ Grid 4 cột hiển thị tất cả ảnh
    - ✅ Thumbnail của ảnh đang chọn có border-pink-600 và ring
    - ✅ Hover vào thumbnail → Border highlight
  - **Notes:** _______________

- [ ] **Thumbnail Click**
  - **Steps:**
    1. Click vào thumbnail thứ 2
  - **Expected:**
    - ✅ Ảnh chính chuyển sang ảnh thứ 2
    - ✅ Thumbnail thứ 2 được highlight
    - ✅ Thumbnail thứ 1 không còn highlight
  - **Notes:** _______________

---

## 2️⃣ Add to Cart Flow với Gift Options

### 2.1 Gift Features Section Display

- [ ] **Conditional Rendering**
  - **Steps:**
    1. Mở sản phẩm có `giftWrapping: false`
    2. Mở sản phẩm có `giftWrapping: true`
  - **Expected:**
    - ✅ Sản phẩm không có gift → Section không hiển thị
    - ✅ Sản phẩm có gift → Section hiển thị với pink background
  - **Notes:** _______________

### 2.2 Gift Wrapping Selection

- [ ] **Radio Group Selection**
  - **Steps:**
    1. Trong Gift Features Section, click radio button "Hộp giấy"
    2. Click radio button "Túi vải"
  - **Expected:**
    - ✅ Radio button được tick khi chọn
    - ✅ Chỉ một option được chọn tại một thời điểm
    - ✅ Visual feedback rõ ràng (checked state)
  - **Notes:** _______________

### 2.3 Gift Message Input

- [ ] **Textarea Visibility**
  - **Steps:**
    1. Kiểm tra sản phẩm có `giftMessageEnabled: true`
  - **Expected:**
    - ✅ Textarea "Lời chúc" hiển thị
    - ✅ Placeholder hiển thị `giftMessageTemplate` nếu có
  - **Notes:** _______________

- [ ] **Message Input**
  - **Steps:**
    1. Nhập text vào textarea: "Chúc mừng sinh nhật bạn yêu!"
    2. Xóa text
  - **Expected:**
    - ✅ Text được nhập và hiển thị đúng
    - ✅ Textarea có thể resize (nếu cho phép)
    - ✅ Text được clear khi xóa
  - **Notes:** _______________

### 2.4 Add to Cart với Gift Options

- [ ] **Add to Cart - With Gift Options**
  - **Steps:**
    1. Chọn variant (size)
    2. Chọn gói quà: "Hộp giấy"
    3. Nhập lời chúc: "Chúc mừng sinh nhật!"
    4. Click "Thêm vào giỏ hàng"
  - **Expected:**
    - ✅ Toast notification hiển thị: "Đã thêm vào giỏ hàng"
    - ✅ Description: Tên sản phẩm và size
    - ✅ (Quan trọng) Kiểm tra trong DevTools → Network tab → Xem request hoặc Zustand store
    - ✅ Cart item có `giftWrappingOption: "Hộp giấy"`
    - ✅ Cart item có `giftMessage: "Chúc mừng sinh nhật!"`
  - **Notes:** _______________

- [ ] **Add to Cart - Without Gift Options**
  - **Steps:**
    1. Không chọn gói quà, không nhập lời chúc
    2. Click "Thêm vào giỏ hàng"
  - **Expected:**
    - ✅ Toast notification hiển thị
    - ✅ Cart item không có `giftWrappingOption` và `giftMessage` (undefined)
  - **Notes:** _______________

- [ ] **Add to Cart - Validation**
  - **Steps:**
    1. Không chọn variant (size)
    2. Click "Thêm vào giỏ hàng"
  - **Expected:**
    - ✅ Toast error: "Vui lòng chọn biến thể"
    - ✅ Variant: "destructive" (màu đỏ)
    - ✅ Sản phẩm không được thêm vào giỏ
  - **Notes:** _______________

- [ ] **Add to Cart - Out of Stock**
  - **Steps:**
    1. Chọn variant có `stock: 0`
    2. Click "Thêm vào giỏ hàng"
  - **Expected:**
    - ✅ Toast error: "Hết hàng"
    - ✅ Button disabled
    - ✅ Sản phẩm không được thêm vào giỏ
  - **Notes:** _______________

---

## 3️⃣ Tabs Switching

### 3.1 Tab Navigation

- [ ] **Tab Click**
  - **Steps:**
    1. Click tab "Chi tiết"
    2. Click tab "Mô tả"
    3. Click tab "Bảo hành & Hướng dẫn"
  - **Expected:**
    - ✅ Tab được active (highlight)
    - ✅ Content của tab hiển thị ngay
    - ✅ Smooth transition giữa các tabs
    - ✅ Tab "Đánh giá" hiển thị placeholder
  - **Notes:** _______________

### 3.2 Tab Content

- [ ] **Tab "Mô tả"**
  - **Steps:**
    1. Click tab "Mô tả"
  - **Expected:**
    - ✅ HTML description được render đúng (không hiển thị raw HTML)
    - ✅ Prose styling áp dụng đúng
    - ✅ Images trong description hiển thị (nếu có)
  - **Notes:** _______________

- [ ] **Tab "Chi tiết"**
  - **Steps:**
    1. Click tab "Chi tiết"
  - **Expected:**
    - ✅ ProductSpecsTable hiển thị
    - ✅ Bảng có 5 rows: Kích thước, Trọng lượng, Chất liệu, Độ tuổi, Bảo hành
    - ✅ Values hiển thị đúng format (VD: "80 x 50 x 60 cm", "800 gram")
    - ✅ Nếu field empty → Hiển thị "Chưa có thông tin"
  - **Notes:** _______________

- [ ] **Tab "Bảo hành & Hướng dẫn"**
  - **Steps:**
    1. Click tab "Bảo hành & Hướng dẫn"
  - **Expected:**
    - ✅ Section "Hướng dẫn bảo quản" hiển thị (nếu có `careInstructions`)
    - ✅ Section "Thông tin an toàn" hiển thị (nếu có `safetyInfo`)
    - ✅ Section "Chính sách bảo hành" hiển thị (nếu có `warranty`)
    - ✅ HTML content được render đúng
    - ✅ Background colors khác nhau cho từng section (pink-50, blue-50, green-50)
  - **Notes:** _______________

---

## 4️⃣ Combo Products

### 4.1 Combo Display

- [ ] **Combo Section Visibility**
  - **Steps:**
    1. Kiểm tra sản phẩm có `comboProducts`
  - **Expected:**
    - ✅ Section "Combo sản phẩm" hiển thị
    - ✅ Badge "Giảm X%" hiển thị nếu có `bundleDiscount`
    - ✅ Nếu không có combo → Section không hiển thị
  - **Notes:** _______________

### 4.2 Combo Items List

- [ ] **Items Display**
  - **Steps:**
    1. Kiểm tra list combo items
  - **Expected:**
    - ✅ Mỗi item hiển thị: Tên sản phẩm, giá gốc (nếu có discount), giá sau giảm
    - ✅ Badge discount cho từng item (nếu có)
    - ✅ Items được sắp xếp theo thứ tự trong array
  - **Notes:** _______________

### 4.3 Savings Calculation

- [ ] **Savings Display**
  - **Steps:**
    1. Kiểm tra section "Tiết kiệm"
  - **Expected:**
    - ✅ Hiển thị tổng tiết kiệm: "Tiết kiệm: X₫"
    - ✅ Calculation đúng: (Original - Final) sau khi áp dụng tất cả discounts
    - ✅ Background green-50 với border green-200
    - ✅ Nếu không có savings → Section không hiển thị
  - **Notes:** _______________

### 4.4 Add All to Cart

- [ ] **Add All Button**
  - **Steps:**
    1. Click "Thêm tất cả vào giỏ hàng"
  - **Expected:**
    - ✅ Toast notification: "Đã thêm X sản phẩm vào giỏ hàng"
    - ✅ Description: "Tiết kiệm X%" nếu có bundle discount
    - ✅ Tất cả combo items được thêm vào giỏ
    - ✅ Kiểm tra trong cart → Tất cả items đều có
  - **Notes:** _______________

- [ ] **Add All - Partial Failure**
  - **Steps:**
    1. Tạo combo với 1 item có stock = 0
    2. Click "Thêm tất cả vào giỏ hàng"
  - **Expected:**
    - ✅ Toast success cho items thành công
    - ✅ Toast warning: "X sản phẩm không thể thêm vào giỏ hàng"
    - ✅ Items có stock > 0 được thêm, items hết hàng không được thêm
  - **Notes:** _______________

---

## 5️⃣ Related Products

### 5.1 Related Products Display

- [ ] **Section Visibility**
  - **Steps:**
    1. Kiểm tra sản phẩm có `relatedProducts`
  - **Expected:**
    - ✅ Section "Sản phẩm liên quan" hiển thị
    - ✅ Grid layout: 2 cols mobile, 4 cols desktop
    - ✅ Nếu không có related → Section không hiển thị
  - **Notes:** _______________

### 5.2 Product Cards

- [ ] **Cards Rendering**
  - **Steps:**
    1. Kiểm tra các ProductCard trong grid
  - **Expected:**
    - ✅ Mỗi card hiển thị: Ảnh, tên, giá, rating (nếu có)
    - ✅ Cards responsive (không bị overflow)
    - ✅ Click vào card → Navigate đến trang chi tiết sản phẩm
  - **Notes:** _______________

### 5.3 Loading State

- [ ] **Loading Skeleton**
  - **Steps:**
    1. Reload trang (hoặc clear cache)
    2. Quan sát Related Products section
  - **Expected:**
    - ✅ Skeleton loaders hiển thị trong khi fetch
    - ✅ 4 skeleton cards (grid 2x2)
    - ✅ Sau khi load xong → Skeleton biến mất, cards hiển thị
  - **Notes:** _______________

---

## 6️⃣ Social Share

### 6.1 Share Buttons Display

- [ ] **Buttons Visibility**
  - **Steps:**
    1. Kiểm tra section share buttons (dưới Add to Cart)
  - **Expected:**
    - ✅ 3 buttons: Facebook, Zalo, Copy link
    - ✅ Icons hiển thị đúng
    - ✅ Labels hiển thị trên desktop, ẩn trên mobile
  - **Notes:** _______________

### 6.2 Facebook Share

- [ ] **Facebook Share Action**
  - **Steps:**
    1. Click button "Facebook"
  - **Expected:**
    - ✅ Popup window mở ra (width=600, height=400)
    - ✅ URL Facebook shareer với product URL
    - ✅ User có thể share trên Facebook
  - **Notes:** _______________

### 6.3 Zalo Share

- [ ] **Zalo Share Action**
  - **Steps:**
    1. Click button "Zalo"
  - **Expected:**
    - ✅ Popup window mở ra
    - ✅ URL Zalo shareer với product URL và title
    - ✅ User có thể share trên Zalo
  - **Notes:** _______________

### 6.4 Copy Link

- [ ] **Copy Link Action**
  - **Steps:**
    1. Click button "Sao chép link"
  - **Expected:**
    - ✅ Toast notification: "Đã sao chép" + "Link sản phẩm đã được sao chép vào clipboard"
    - ✅ Button text thay đổi thành "Đã sao chép" với icon Check
    - ✅ Sau 2 giây → Button trở lại trạng thái ban đầu
    - ✅ Paste clipboard → URL đúng format: `https://domain.com/products/[slug]`
  - **Notes:** _______________

---

## 7️⃣ Responsive Design

### 7.1 Mobile View (< 768px)

- [ ] **Layout Stack**
  - **Steps:**
    1. Resize browser xuống < 768px (hoặc dùng DevTools mobile view)
  - **Expected:**
    - ✅ Gallery và Product Info stack vertically (không còn 2 cột)
    - ✅ Gallery full width
    - ✅ Product Info full width, bên dưới gallery
  - **Notes:** _______________

- [ ] **Mobile Buy Button**
  - **Steps:**
    1. Scroll xuống dưới trang
  - **Expected:**
    - ✅ MobileBuyButton sticky ở bottom
    - ✅ Button hiển thị: Tên sản phẩm, giá, "Thêm vào giỏ"
    - ✅ Button không che nội dung quan trọng
  - **Notes:** _______________

- [ ] **Tabs on Mobile**
  - **Steps:**
    1. Scroll đến ProductTabs section
  - **Expected:**
    - ✅ Tabs có thể scroll horizontal nếu không đủ chỗ
    - ✅ Tab content full width
    - ✅ Tables có thể scroll horizontal (nếu cần)
  - **Notes:** _______________

### 7.2 Tablet View (768px - 1024px)

- [ ] **Layout Adaptation**
  - **Steps:**
    1. Resize browser đến tablet size
  - **Expected:**
    - ✅ Gallery và Product Info vẫn 2 cột (nếu đủ chỗ)
    - ✅ Hoặc stack nếu màn hình nhỏ
    - ✅ Related Products grid: 3 cols
  - **Notes:** _______________

### 7.3 Desktop View (> 1024px)

- [ ] **Full Layout**
  - **Steps:**
    1. Resize browser đến desktop size (> 1024px)
  - **Expected:**
    - ✅ Gallery và Product Info: 2 cột side-by-side
    - ✅ Tabs full width
    - ✅ Related Products grid: 4 cols
    - ✅ Tất cả sections hiển thị đầy đủ
  - **Notes:** _______________

---

## 8️⃣ Performance & Loading States

### 8.1 Image Loading

- [ ] **Lazy Loading**
  - **Steps:**
    1. Mở trang sản phẩm
    2. Scroll xuống dưới
    3. Quan sát Network tab
  - **Expected:**
    - ✅ Images load khi vào viewport (lazy loading)
    - ✅ Priority image (ảnh đầu tiên) load ngay
    - ✅ Không có layout shift khi images load
  - **Notes:** _______________

### 8.2 API Calls

- [ ] **Related Products Fetch**
  - **Steps:**
    1. Mở DevTools → Network tab
    2. Reload trang sản phẩm có related products
  - **Expected:**
    - ✅ Request đến `/api/products?limit=100` (hoặc endpoint tương tự)
    - ✅ Response time < 500ms (lý tưởng)
    - ✅ Loading state hiển thị trong khi fetch
  - **Notes:** _______________

### 8.3 Error Handling

- [ ] **Network Error**
  - **Steps:**
    1. Disconnect internet
    2. Reload trang
    3. Hoặc block API requests trong DevTools
  - **Expected:**
    - ✅ Error state hiển thị (không crash)
    - ✅ User-friendly error message
    - ✅ Retry option (nếu có)
  - **Notes:** _______________

---

## 9️⃣ Edge Cases

### 9.1 Empty Data

- [ ] **Product without New Fields**
  - **Steps:**
    1. Mở sản phẩm cũ (chưa có fields mới)
  - **Expected:**
    - ✅ Page vẫn load được (không crash)
    - ✅ GiftFeaturesSection không hiển thị
    - ✅ ComboProducts không hiển thị
    - ✅ RelatedProducts không hiển thị
    - ✅ ProductSpecsTable hiển thị "Chưa có thông tin" cho các fields
  - **Notes:** _______________

### 9.2 Large Data

- [ ] **Many Related Products**
  - **Steps:**
    1. Tạo sản phẩm với 20 related products
  - **Expected:**
    - ✅ Grid hiển thị tất cả 20 products
    - ✅ Page không bị lag
    - ✅ Scroll smooth
  - **Notes:** _______________

- [ ] **Many 360 Images**
  - **Steps:**
    1. Tạo sản phẩm với 36 images360
  - **Expected:**
    - ✅ 360 modal có thể navigate qua tất cả 36 ảnh
    - ✅ Thumbnails dots hiển thị đúng
    - ✅ Performance vẫn tốt
  - **Notes:** _______________

### 9.3 Special Characters

- [ ] **Special Characters in Gift Message**
  - **Steps:**
    1. Nhập lời chúc: "Chúc mừng <3 & Happy Birthday!"
    2. Add to cart
  - **Expected:**
    - ✅ Special characters được lưu đúng
    - ✅ Không bị escape hoặc encode sai
    - ✅ Hiển thị đúng khi xem lại trong cart
  - **Notes:** _______________

---

## 🔟 Integration Tests

### 10.1 End-to-End Flow

- [ ] **Complete Purchase Flow với Gift**
  - **Steps:**
    1. Chọn variant
    2. Chọn gói quà + Nhập lời chúc
    3. Add to cart
    4. Navigate đến cart page
    5. Kiểm tra cart items
  - **Expected:**
    - ✅ Cart item có đầy đủ thông tin: variant, quantity, price
    - ✅ Cart item có `giftWrappingOption` và `giftMessage`
    - ✅ Thông tin gift hiển thị trong cart (nếu có UI)
  - **Notes:** _______________

### 10.2 Cross-sell Flow

- [ ] **Combo Add to Cart Flow**
  - **Steps:**
    1. Scroll đến Combo Products section
    2. Click "Thêm tất cả vào giỏ hàng"
    3. Navigate đến cart
  - **Expected:**
    - ✅ Tất cả combo items có trong cart
    - ✅ Prices đã được apply discount đúng
    - ✅ Cart total tính đúng
  - **Notes:** _______________

---

## 📊 Test Results Summary

**Ngày test:** _______________  
**Người test:** _______________  
**Environment:** Development / Staging / Production  
**Browser:** Chrome / Firefox / Safari / Edge  
**Device:** Desktop / Tablet / Mobile

### Overall Status

- [ ] ✅ **PASS** - Tất cả test cases đều pass
- [ ] ❌ **FAIL** - Có test cases fail (xem chi tiết bên dưới)

### Failed Test Cases

| Test Case | Section | Issue | Screenshot/Notes |
|-----------|---------|-------|------------------|
|           |         |       |                  |

### Performance Metrics

- **Page Load Time:** _______ ms
- **Time to Interactive:** _______ ms
- **Largest Contentful Paint:** _______ ms
- **First Input Delay:** _______ ms

### Notes

- 
- 
- 

---

## ✅ Sign-off

- [ ] **Developer Review:** Đã review và fix các issues
- [ ] **QA Approval:** Đã approve để deploy
- [ ] **Product Owner Approval:** Đã approve để release

**Ngày hoàn thành:** _______________  
**Version:** Phase 3 - Frontend Updates




