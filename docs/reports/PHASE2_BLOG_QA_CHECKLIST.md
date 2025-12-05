# 📋 Manual QA Checklist - Phase 2: CMS Editor Enhancements

**Project:** Teddy Shop Blog Upgrade  
**Phase:** Phase 2 - CMS Editor Enhancements  
**Date:** _[Điền ngày test]_  
**Tester:** _[Điền tên người test]_

---

## 🎯 Mục tiêu

Kiểm tra thủ công các tính năng mới của CMS Editor để đảm bảo UI/UX hoạt động đúng và dữ liệu được lưu chính xác.

---

## ✅ Test Cases

### 1. Reading Time Display

**Mục tiêu:** Verify reading time tự động tính toán và hiển thị đúng.

**Các bước:**

1. Mở Post Editor (tạo bài viết mới hoặc edit bài viết có sẵn)
2. Quan sát widget "Thời gian đọc" trong Sidebar
3. Nhập nội dung vào Rich Text Editor (khoảng 500 từ)
4. Kiểm tra:
   - [ ] Số phút có tự động cập nhật không?
   - [ ] Số phút có hợp lý không? (VD: 500 từ ≈ 2-3 phút)
5. Xóa toàn bộ nội dung
6. Kiểm tra:
   - [ ] Số phút có về 0 hoặc 1 không?

**Kết quả mong đợi:**

- Reading time tự động cập nhật khi content thay đổi
- Tính toán chính xác (~200 từ/phút)

**Trạng thái:** ✅ PASS

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 2. Product Picker Widget

**Mục tiêu:** Verify search và chọn sản phẩm để link vào bài viết.

**Các bước:**

1. Mở Post Editor
2. Scroll xuống widget "Sản phẩm liên kết" trong Sidebar
3. Test Search:
   - [ ] Nhập từ khóa vào ô search (VD: "gấu bông")
   - [ ] Kết quả tìm kiếm có hiển thị không?
   - [ ] Có debounce không? (không search ngay khi gõ)
4. Test Add Product:
   - [ ] Click vào một sản phẩm trong kết quả
   - [ ] Sản phẩm có xuất hiện trong "Đã chọn" không?
   - [ ] Ảnh, tên, giá có hiển thị đúng không?
5. Test Settings:
   - [ ] Thay đổi "Vị trí hiển thị" (inline/sidebar/bottom)
   - [ ] Thay đổi "Kiểu hiển thị" (card/spotlight/cta)
   - [ ] Nhập "Tin nhắn tùy chỉnh"
6. Test Remove:
   - [ ] Click nút X để xóa sản phẩm
   - [ ] Sản phẩm có bị xóa khỏi list không?

**Kết quả mong đợi:**

- Search hoạt động với debounce
- Add/Remove product hoạt động mượt mà
- Settings được lưu đúng

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 3. Template Selector

**Mục tiêu:** Verify chọn template và cảnh báo khi đổi template.

**Các bước:**

1. Mở Post Editor (tạo bài viết mới)
2. Tìm widget "Loại bài viết" (ở đầu Main Content hoặc Sidebar)
3. Test Template Selection:
   - [ x] Click vào dropdown
   - [ x] Có 5 options: default, gift-guide, review, care-guide, story không?
   - [ ] Icon và mô tả có hiển thị đúng không? - Lỗi hiển thị
4. Test Template Change:
   - [ x] Chọn template "gift-guide"
   - [ x] Template có được cập nhật không?
   - [ x] Form Builder có hiện ra không? (DynamicTemplateFields)
5. Test Warning (nếu có templateData cũ):
   - [x ] Nhập một số dữ liệu vào Gift Guide Builder
   - [ x] Đổi sang template "default"
   - [ x] Có hiện cảnh báo không?
   - [ x] Có thể xác nhận hoặc hủy không?

**Kết quả mong đợi:**

- Template selector hoạt động đúng
- Cảnh báo hiển thị khi đổi template có dữ liệu cũ
- Form Builder hiện/ẩn đúng theo template

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** Lỗi hiển thị khi dropdown thả xuống

---

### 4. Gift Guide Builder

**Mục tiêu:** Verify builder cho template "gift-guide".

**Các bước:**

1. Chọn template "gift-guide" trong Template Selector
2. Scroll xuống "Cấu hình Template" (DynamicTemplateFields)
3. Mở Accordion "⚙️ Cấu hình Hướng dẫn Quà tặng"
4. Test Occasions:
   - [x ] Click vào các dịp lễ (Sinh nhật, Valentine, 8/3...)
   - [ x] Các dịp được chọn có highlight không?
   - [ x] Click lại để bỏ chọn có hoạt động không?
5. Test Price Range:
   - [x ] Nhập giá Min (VD: 100000)
   - [ x] Nhập giá Max (VD: 500000)
   - [ x] Giá trị có được lưu không?
6. Test Delivery Options:
   - [x ] Check các tùy chọn giao hàng
   - [ x] Uncheck có hoạt động không?
7. Save bài viết và kiểm tra:
   - [ ] Dữ liệu có được lưu vào `templateData.giftGuide` không?

**Kết quả mong đợi:**

- Tất cả fields hoạt động đúng
- Dữ liệu được lưu vào templateData

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 5. Comparison Table Builder

**Mục tiêu:** Verify builder cho bảng so sánh sản phẩm.

**Các bước:**

1. Chọn template "review" trong Template Selector
2. Scroll xuống "Cấu hình Template"
3. Mở Accordion "⚙️ Cấu hình Đánh giá & So sánh"
4. Test Product Selection:
   - [ x] Search và thêm sản phẩm đầu tiên
   - [ x] Search và thêm sản phẩm thứ hai
   - [ x] Có hiện thông báo "Cần ít nhất 2 sản phẩm" không?
   - [ ] Sau khi có 2 sản phẩm, Features Table có hiện ra không?
5. Test Features:
   - [ ] Click "Thêm tính năng"
   - [ ] Nhập tên tính năng (VD: "Kích thước")
   - [ ] Nhập giá trị cho từng sản phẩm
   - [ ] Thêm thêm 2-3 tính năng nữa
6. Test Remove:
   - [ ] Xóa một tính năng
   - [ ] Xóa một sản phẩm
   - [ ] Features có được cập nhật đúng không?
7. Save bài viết và kiểm tra:
   - [ ] Dữ liệu có được lưu vào `comparisonTable` không?

**Kết quả mong đợi:**

- Product selection hoạt động
- Features có thể thêm/xóa
- Dữ liệu được lưu vào comparisonTable

**Trạng thái:** ❌ FAIL

**Ghi chú:** Không thêm được sản phẩm

---

### 6. Form Integration & Data Persistence

**Mục tiêu:** Verify dữ liệu được lưu và load lại đúng.

**Các bước:**

1. Tạo bài viết mới với:
   - Template: "gift-guide"
   - Linked Products: 2 sản phẩm
   - Gift Guide Data: Occasions, Price Range, Delivery Options
   - Comparison Table: 2 products, 3 features
2. Save bài viết (Lưu nháp)
3. Reload trang hoặc mở lại bài viết
4. Kiểm tra:
   - [ ] Template có được load đúng không?
   - [ ] Linked Products có được load đúng không?
   - [ ] Template Data có được load đúng không?
   - [ ] Comparison Table có được load đúng không?
   - [ ] Reading Time có được load đúng không?

**Kết quả mong đợi:**

- Tất cả dữ liệu được lưu và load lại chính xác

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

### 7. UI/UX & Responsive

**Mục tiêu:** Verify giao diện đẹp và responsive.

**Các bước:**

1. Test Desktop:
   - [ ] Sidebar có hiển thị đúng không?
   - [ ] Main Content và Sidebar có layout đúng không?
   - [ ] Các widgets có spacing hợp lý không?
2. Test Mobile:
   - [ ] Resize browser xuống mobile size
   - [ ] Sidebar có chuyển sang bottom sheet không?
   - [ ] Các widgets có responsive không?
   - [ ] Form inputs có dễ nhập trên mobile không?
3. Test Interactions:
   - [ ] Hover states có hoạt động không?
   - [ ] Focus states có rõ ràng không?
   - [ ] Loading states có hiển thị không?

**Kết quả mong đợi:**

- UI đẹp và professional
- Responsive tốt trên mobile
- Interactions mượt mà

**Trạng thái:** ⏳ PENDING / ✅ PASS / ❌ FAIL

**Ghi chú:** _[Ghi chú nếu có lỗi]_

---

## 📊 Tổng kết

**Tổng số test cases:** 7  
**Đã test:** _[Số lượng]_  
**Passed:** _[Số lượng]_  
**Failed:** _[Số lượng]_  
**Pending:** _[Số lượng]_

**Tỷ lệ pass:** _[%]_

---

## 🐛 Known Issues

_[Liệt kê các lỗi đã phát hiện]_

1. _[Mô tả lỗi 1]_
2. _[Mô tả lỗi 2]_

---

## ✅ Sign-off

**Tester:** _[Tên]_  
**Date:** _[Ngày]_  
**Status:** ⏳ PENDING / ✅ APPROVED / ❌ REJECTED

---

**Lưu ý:** Checklist này nên được cập nhật sau mỗi lần test và trước khi deploy lên production.
