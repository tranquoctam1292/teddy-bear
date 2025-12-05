# 📋 Manual QA Checklist - Phase 3: Frontend Enhancements

**Project:** Teddy Shop Blog Upgrade  
**Phase:** Phase 3 - Frontend Enhancements  
**Date:** _[Điền ngày test]_  
**Tester:** _[Điền tên người test]_

---

## 🎯 Mục tiêu

Kiểm tra thủ công các tính năng frontend mới để đảm bảo UI/UX hoạt động đúng, đặc biệt là responsive design trên Mobile.

---

## ✅ Test Cases

### 1. Blog Filters & Search

**Mục tiêu:** Verify filter và search hoạt động đúng với URL params.

**Các bước:**

1. Truy cập trang `/blog`
2. Quan sát component `BlogFilters` ở đầu trang
3. Test Search:
   - [ ] Nhập từ khóa vào ô tìm kiếm
   - [ ] Đợi 500ms (debounce)
   - [ ] Kiểm tra URL có thay đổi thành `?search=từ+khóa` không?
   - [ ] Danh sách bài viết có được filter không?
4. Test Category Filter:
   - [ ] Chọn một category từ dropdown
   - [ ] Kiểm tra URL có thay đổi thành `?category=category-name` không?
   - [ ] Danh sách bài viết có được filter theo category không?
5. Test Sort:
   - [ ] Chọn "Mới nhất" / "Phổ biến" / "Cũ nhất"
   - [ ] Kiểm tra URL có thay đổi thành `?sort=...` không?
   - [ ] Danh sách bài viết có được sắp xếp đúng không?
6. Test Clear Filters:
   - [ ] Click nút "Xóa bộ lọc"
   - [ ] Kiểm tra tất cả filters có được reset không?
   - [ ] URL có về trạng thái ban đầu không?

**Kết quả mong đợi:**

- Filters cập nhật URL search params
- Debounce hoạt động (không gọi API liên tục)
- Active filters được hiển thị rõ ràng

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 2. Table of Contents (TOC)

**Mục tiêu:** Verify TOC sticky và smooth scroll hoạt động đúng.

**Các bước:**

1. Truy cập một bài viết có `tableOfContents` (ví dụ: bài viết dài với nhiều headings)
2. Quan sát TOC ở sidebar (desktop) hoặc top (mobile)
3. Test Sticky:
   - [ ] Scroll xuống trang
   - [ ] TOC có dính (sticky) ở vị trí cố định không?
   - [ ] TOC có bị che bởi header không?
4. Test Active Section Highlight:
   - [ ] Scroll đến một heading trong bài viết
   - [ ] Mục tương ứng trong TOC có được highlight không?
   - [ ] Highlight có chuyển đổi khi scroll đến heading khác không?
5. Test Smooth Scroll:
   - [ ] Click vào một mục trong TOC
   - [ ] Trang có cuộn mượt (smooth) đến heading tương ứng không?
   - [ ] Heading có được scroll vào đúng vị trí không? (không bị che bởi sticky header)
6. Test Mobile:
   - [ ] Mở trên mobile (< 768px)
   - [ ] TOC có hiển thị đúng không?
   - [ ] Click vào TOC có hoạt động không?

**Kết quả mong đợi:**

- TOC sticky ở vị trí đúng
- Active section được highlight chính xác
- Smooth scroll hoạt động mượt mà
- Responsive trên mobile

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 3. Social Share Buttons

**Mục tiêu:** Verify share buttons mở popup đúng.

**Các bước:**

1. Truy cập một bài viết
2. Tìm component `SocialShareButtons` (thường ở sidebar hoặc cuối bài)
3. Test Facebook Share:
   - [ ] Click nút "Facebook"
   - [ ] Popup có mở không?
   - [ ] URL bài viết có được truyền vào popup không?
   - [ ] Popup có đúng kích thước không? (600x400)
4. Test Zalo Share:
   - [ ] Click nút "Zalo"
   - [ ] Popup có mở không?
   - [ ] URL và title có được truyền đúng không?
5. Test Copy Link:
   - [ ] Click nút "Sao chép liên kết"
   - [ ] Có hiện toast thông báo "Đã sao chép!" không?
   - [ ] Link có được copy vào clipboard không?
   - [ ] Paste link có đúng không?
6. Test Native Share (nếu có):
   - [ ] Trên mobile, có hiện nút "Chia sẻ" (native) không?
   - [ ] Click có mở native share dialog không?

**Kết quả mong đợi:**

- Tất cả share buttons hoạt động
- Popup mở đúng
- Copy link hoạt động với toast notification

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 4. Reading Time Badge

**Mục tiêu:** Verify reading time hiển thị đúng.

**Các bước:**

1. Truy cập một bài viết có `readingTime` (ví dụ: 5 phút)
2. Tìm `ReadingTimeBadge` (thường ở header bài viết)
3. Test Display:
   - [ ] Badge có hiển thị "5 phút đọc" không?
   - [ ] Icon Clock có hiển thị không?
   - [ ] Styling có đúng không? (badge màu hồng)
4. Test Compact Variant:
   - [ ] Nếu có variant compact, có hiển thị "5 phút" (ngắn gọn) không?
5. Test Edge Cases:
   - [ ] Bài viết không có `readingTime` có bị lỗi không?
   - [ ] `readingTime = 0` có được xử lý đúng không? (không hiển thị)

**Kết quả mong đợi:**

- Reading time hiển thị chính xác
- Edge cases được xử lý đúng

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 5. Product Comparison View - Desktop

**Mục tiêu:** Verify bảng so sánh hiển thị đúng trên Desktop.

**Các bước:**

1. Truy cập một bài viết có `template: 'review'` và `comparisonTable`
2. Mở trên Desktop (≥ 768px)
3. Test Table Layout:
   - [ ] Bảng có hiển thị dạng table (ngang) không?
   - [ ] Cột đầu có là "Tính năng" không?
   - [ ] Các cột sau có là tên sản phẩm không?
4. Test Product Display:
   - [ ] Ảnh sản phẩm có hiển thị không? (nếu `showImages: true`)
   - [ ] Tên sản phẩm có hiển thị đúng không?
   - [ ] Giá có hiển thị không? (nếu `showPrices: true`)
5. Test Features:
   - [ ] Các tính năng có được liệt kê đúng không?
   - [ ] Giá trị của từng tính năng có đúng không?
6. Test Actions:
   - [ ] Nút "Xem chi tiết" có link đúng đến trang sản phẩm không?
   - [ ] Nút "Mua ngay" có hoạt động không?
7. Test Expandable Rows:
   - [ ] Nếu có nội dung dài (> 50 ký tự), có nút "Xem thêm" không?
   - [ ] Click "Xem thêm" có expand nội dung không?
   - [ ] Click "Thu gọn" có collapse lại không?

**Kết quả mong đợi:**

- Bảng so sánh hiển thị đúng format
- Tất cả thông tin sản phẩm đúng
- Actions hoạt động

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 6. Product Comparison View - Mobile ⚠️ QUAN TRỌNG

**Mục tiêu:** Verify bảng so sánh chuyển thành Card Stack trên Mobile.

**Các bước:**

1. Truy cập một bài viết có `template: 'review'` và `comparisonTable`
2. Mở trên Mobile (< 768px) hoặc resize browser
3. Test Card Stack Layout:
   - [ ] **Bảng có chuyển thành Card Stack (thẻ dọc) không?** ⚠️ QUAN TRỌNG
   - [ ] Mỗi sản phẩm có là một card riêng không?
   - [ ] Cards có xếp chồng dọc không?
4. Test Product Card:
   - [ ] Mỗi card có hiển thị ảnh sản phẩm không?
   - [ ] Tên sản phẩm có hiển thị đúng không?
   - [ ] Giá có hiển thị không?
5. Test Features in Card:
   - [ ] Các tính năng có được liệt kê trong card không?
   - [ ] Format có dễ đọc không? (tên tính năng + giá trị)
   - [ ] Có border phân cách giữa các tính năng không?
6. Test Expandable Content:
   - [ ] Nếu có nội dung dài (> 100 ký tự), có nút "Xem thêm" không?
   - [ ] Click "Xem thêm" có expand nội dung trong card không?
7. Test Actions:
   - [ ] Nút "Xem chi tiết" và "Mua ngay" có ở cuối mỗi card không?
   - [ ] Buttons có responsive không? (không bị tràn)
8. Test Scroll:
   - [ ] Scroll giữa các cards có mượt không?
   - [ ] Cards có spacing đủ không?

**Kết quả mong đợi:**

- ⚠️ **BẮT BUỘC:** Bảng phải chuyển thành Card Stack trên Mobile
- Cards hiển thị đầy đủ thông tin
- Layout responsive và dễ đọc

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 7. Gift Guide View

**Mục tiêu:** Verify template gift-guide hiển thị đúng.

**Các bước:**

1. Truy cập một bài viết có `template: 'gift-guide'`
2. Test Occasion Banner:
   - [ ] Banner có hiển thị ở đầu không?
   - [ ] Occasions có được hiển thị đúng không? (ví dụ: "Gợi ý Quà Tặng Sinh nhật & Valentine")
   - [ ] Price range có hiển thị không? (nếu có)
   - [ ] Delivery options có hiển thị không? (nếu có)
3. Test Products Grid:
   - [ ] Grid có hiển thị danh sách sản phẩm không?
   - [ ] Mỗi sản phẩm có là một card không?
   - [ ] Cards có responsive không? (1 cột mobile, 2-3 cột desktop)
4. Test Product Card:
   - [ ] Ảnh sản phẩm có hiển thị không?
   - [ ] Tên sản phẩm có hiển thị đúng không?
   - [ ] Giá có hiển thị không?
   - [ ] Custom message badge có hiển thị không? (nếu có)
   - [ ] Nút "Xem ngay" có hoạt động không?
5. Test Empty State:
   - [ ] Nếu không có sản phẩm, có hiển thị empty state không?
   - [ ] Empty state có message rõ ràng không?

**Kết quả mong đợi:**

- Banner hiển thị đẹp
- Products grid responsive
- Product cards đầy đủ thông tin

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 8. Product Link Card

**Mục tiêu:** Verify inline product cards hiển thị đúng.

**Các bước:**

1. Truy cập một bài viết có `linkedProducts` với `position: 'inline'`
2. Test Card Display:
   - [ ] Product card có hiển thị trong nội dung bài viết không?
   - [ ] Ảnh sản phẩm có hiển thị không?
   - [ ] Tên sản phẩm có hiển thị đúng không?
   - [ ] Giá có hiển thị không?
3. Test Display Types:
   - [ ] `displayType: 'card'` có hiển thị card mặc định không?
   - [ ] `displayType: 'spotlight'` có hiển thị card nổi bật (gradient) không?
   - [ ] `displayType: 'cta'` có hiển thị compact CTA không?
4. Test Custom Message:
   - [ ] Custom message có hiển thị không? (nếu có)
   - [ ] Message có ở vị trí đúng không?
5. Test Actions:
   - [ ] Nút "Xem chi tiết" / "Xem ngay" / "Mua ngay" có link đúng không?
   - [ ] Click có navigate đến trang sản phẩm không?
6. Test Loading State:
   - [ ] Khi đang fetch product, có hiển thị skeleton không?
   - [ ] Skeleton có đúng format không?

**Kết quả mong đợi:**

- Product cards hiển thị đúng
- Display types khác nhau hoạt động
- Actions hoạt động

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 9. Blog Post Renderer - Template Logic

**Mục tiêu:** Verify renderer điều hướng đúng theo template.

**Các bước:**

1. Test Default Template:
   - [ ] Bài viết `template: 'default'` có render nội dung bình thường không?
   - [ ] Inline products có được render không?
   - [ ] Sidebar products có được render không?
2. Test Review Template:
   - [ ] Bài viết `template: 'review'` có render `ProductComparisonView` không?
   - [ ] Comparison table có hiển thị đúng không?
3. Test Gift Guide Template:
   - [ ] Bài viết `template: 'gift-guide'` có render `GiftGuideView` không?
   - [ ] Gift guide view có hiển thị trước nội dung không?
   - [ ] Nội dung bài viết có hiển thị sau gift guide không?
4. Test Layout:
   - [ ] Sidebar có hiển thị TOC, products, share buttons không?
   - [ ] Main content có đủ width không? (3/4 trên desktop)
   - [ ] Layout có responsive không?

**Kết quả mong đợi:**

- Template logic hoạt động đúng
- Layout responsive

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 10. Mobile Responsiveness (Tổng thể)

**Mục tiêu:** Verify toàn bộ trang blog responsive trên Mobile.

**Các bước:**

1. Mở trang blog trên Mobile (< 768px)
2. Test Layout:
   - [ ] Sidebar có chuyển thành full-width không?
   - [ ] TOC có hiển thị đúng không?
   - [ ] Product cards có responsive không?
3. Test Touch Interactions:
   - [ ] Buttons có đủ lớn để click không? (≥ 44x44px)
   - [ ] Links có đủ spacing không?
4. Test Performance:
   - [ ] Trang có load nhanh không? (< 3s)
   - [ ] Images có lazy load không?
   - [ ] Scroll có mượt không?

**Kết quả mong đợi:**

- Toàn bộ trang responsive
- Touch interactions tốt
- Performance tốt

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

## 📊 Tổng kết

| Test Case                       | Status     | Notes             |
| ------------------------------- | ---------- | ----------------- |
| Blog Filters & Search           | ⏳ PENDING |                   |
| Table of Contents               | ⏳ PENDING |                   |
| Social Share Buttons            | ⏳ PENDING |                   |
| Reading Time Badge              | ⏳ PENDING |                   |
| Product Comparison - Desktop    | ⏳ PENDING |                   |
| **Product Comparison - Mobile** | ⏳ PENDING | **⚠️ QUAN TRỌNG** |
| Gift Guide View                 | ⏳ PENDING |                   |
| Product Link Card               | ⏳ PENDING |                   |
| Blog Post Renderer              | ⏳ PENDING |                   |
| Mobile Responsiveness           | ⏳ PENDING |                   |

**Tổng số test cases:** 10  
**Đã pass:** 0  
**Đã fail:** 0  
**Đang pending:** 10

---

**Lưu ý:** Checklist này nên được cập nhật sau mỗi lần test và trước khi deploy lên production.
