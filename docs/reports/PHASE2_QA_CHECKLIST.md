# Phase 2 QA Checklist - CMS Updates

**Ngày tạo:** 2025-12-04  
**Mục tiêu:** Kiểm tra các tương tác UI và logic của ProductFormV3 sau khi tích hợp các sections mới  
**Người thực hiện:** Developer/QA Engineer

---

## 📋 Tổng quan

Checklist này hướng dẫn kiểm tra thủ công các tính năng UI mà script automation không thể test được. Mỗi test case cần được đánh dấu ✅ (PASS) hoặc ❌ (FAIL) kèm theo screenshot/notes nếu có lỗi.

---

## 🎯 Test Environment Setup

- [ ] Đảm bảo đã chạy migration script: `npx tsx scripts/migrate-product-schema.ts`
- [ ] Đảm bảo đã chạy indexes script: `npx tsx scripts/create-product-indexes.ts`
- [ ] Đảm bảo đã chạy integration test: `npx tsx scripts/test-cms-submission.ts` (PASS)
- [ ] Mở CMS: `/admin/products/new` hoặc `/admin/products/[id]/edit`
- [ ] Đảm bảo đã login với quyền admin

---

## 1️⃣ Product Details Section

### 1.1 Basic Fields

- [ ] **Material Input**
  - Nhập text: "Bông gòn cao cấp, vải lông mềm"
  - ✅ Input nhận giá trị và hiển thị đúng

- [ ] **Dimensions (3 cột)**
  - Nhập Length: `80`, Width: `50`, Height: `60`
  - ✅ Tất cả 3 fields đều nhận giá trị số
  - ✅ Không cho phép nhập số âm (nếu có validation)

- [ ] **Weight Input**
  - Nhập: `500`
  - ✅ Hiển thị suffix "gram" bên phải input
  - ✅ Chỉ chấp nhận số >= 0

- [ ] **Age Range Input**
  - Nhập: "3+"
  - ✅ Input nhận giá trị text

- [ ] **Warranty Input**
  - Nhập: "6 tháng"
  - ✅ Input nhận giá trị text

### 1.2 Rich Text Fields

- [ ] **Care Instructions (RichTextEditor)**
  - Click vào editor
  - ✅ Toolbar hiển thị đầy đủ
  - ✅ Có thể format text (bold, italic, list...)
  - ✅ Nhập HTML: `<p>Giặt tay nhẹ nhàng</p>`
  - ✅ Lưu và load lại form → HTML được giữ nguyên

- [ ] **Safety Info (Textarea)**
  - Nhập text dài (200+ ký tự)
  - ✅ Textarea có thể scroll
  - ✅ Text được lưu đúng

### 1.3 Validation

- [ ] **Weight Validation**
  - Nhập số âm: `-100`
  - ✅ Form hiển thị error message màu đỏ: "Trọng lượng phải >= 0"
  - ✅ Form không submit được

- [ ] **Dimensions Validation**
  - Để trống Length, nhập Width và Height
  - ✅ Form hiển thị error cho Length (nếu required)
  - ✅ Hoặc form chấp nhận (nếu optional)

---

## 2️⃣ Gift Features Section

### 2.1 Gift Wrapping Toggle

- [ ] **Toggle Switch**
  - Click toggle "Hỗ trợ gói quà" → ON
  - ✅ Toggle chuyển sang màu active (thường là màu primary)
  - ✅ Section "Các loại gói quà" hiển thị ngay bên dưới (với border-left highlight)

- [ ] **Toggle OFF**
  - Click toggle → OFF
  - ✅ Section "Các loại gói quà" ẩn đi
  - ✅ Dữ liệu `giftWrappingOptions` vẫn được giữ (không mất khi toggle OFF)

### 2.2 Gift Wrapping Options

- [ ] **Default Options**
  - Với toggle ON, click checkbox "Hộp giấy"
  - ✅ Checkbox được tick
  - ✅ Badge "Hộp giấy" xuất hiện trong "Đã chọn"
  - ✅ Click checkbox lần nữa → Uncheck và badge biến mất

- [ ] **Custom Option**
  - Nhập text: "Hộp đỏ" vào input "Thêm loại gói quà tùy chỉnh"
  - ✅ Click nút Plus hoặc Enter
  - ✅ Badge "Hộp đỏ" xuất hiện
  - ✅ Click X trên badge → Badge biến mất

- [ ] **Multiple Selection**
  - Chọn 3 options: "Hộp giấy", "Túi vải", "Hộp đỏ"
  - ✅ Tất cả 3 badges đều hiển thị
  - ✅ Submit form → Dữ liệu được lưu đúng array

### 2.3 Gift Message

- [ ] **Gift Message Toggle**
  - Click toggle "Cho phép ghi lời chúc" → ON
  - ✅ Textarea "Template lời chúc mặc định" hiển thị

- [ ] **Template Input**
  - Nhập: "Chúc mừng sinh nhật bạn yêu!"
  - ✅ Textarea nhận giá trị
  - ✅ Placeholder text hiển thị đúng

### 2.4 Special Occasions

- [ ] **Default Occasions**
  - Click checkbox "Valentine"
  - ✅ Checkbox được tick
  - ✅ Badge "Valentine" xuất hiện

- [ ] **Custom Occasion**
  - Nhập: "Ngày cưới" vào input
  - ✅ Click Plus → Badge "Ngày cưới" xuất hiện

- [ ] **Multiple Occasions**
  - Chọn: "Valentine", "Sinh nhật", "8/3"
  - ✅ Tất cả 3 badges hiển thị
  - ✅ Submit → Dữ liệu lưu đúng array

---

## 3️⃣ Media Extended Section

### 3.1 Video URL

- [ ] **Valid YouTube URL**
  - Nhập: `https://www.youtube.com/watch?v=test123`
  - ✅ Input nhận giá trị
  - ✅ Không có error message

- [ ] **Invalid URL**
  - Nhập: `not-a-url`
  - ✅ Form hiển thị error: "URL video không hợp lệ"
  - ✅ Form không submit được

- [ ] **Empty String**
  - Nhập rồi xóa hết (empty string)
  - ✅ Form chấp nhận (vì optional)

### 3.2 Video Thumbnail

- [ ] **Upload Image**
  - Click vào upload area
  - ✅ File picker mở ra
  - ✅ Chọn file ảnh (.jpg, .png)
  - ✅ Ảnh preview hiển thị ngay
  - ✅ Có nút X để xóa ảnh

- [ ] **Invalid File Type**
  - Chọn file .pdf hoặc .txt
  - ✅ Hiển thị alert: "Vui lòng chọn file ảnh"

- [ ] **File Size Limit**
  - Chọn file > 5MB
  - ✅ Hiển thị alert: "Kích thước ảnh phải nhỏ hơn 5MB"

### 3.3 Images 360

- [ ] **Upload Multiple Images**
  - Click vào upload area
  - ✅ File picker cho phép chọn multiple files
  - ✅ Chọn 3 ảnh cùng lúc
  - ✅ Tất cả 3 ảnh đều hiển thị trong grid
  - ✅ Counter hiển thị: "Đã upload 3/36 ảnh"

- [ ] **Remove Image**
  - Click nút X trên ảnh thứ 2
  - ✅ Ảnh biến mất khỏi grid
  - ✅ Counter cập nhật: "Đã upload 2/36 ảnh"

- [ ] **Max Limit**
  - Upload 36 ảnh
  - ✅ Upload area biến mất (không cho upload thêm)
  - ✅ Counter: "Đã upload 36/36 ảnh"

### 3.4 Lifestyle Images

- [ ] **Upload & Remove**
  - Upload 2 ảnh lifestyle
  - ✅ Ảnh hiển thị trong grid
  - ✅ Click X → Ảnh bị xóa
  - ✅ Max limit: 10 ảnh

---

## 4️⃣ Variant Form Enhanced

### 4.1 Basic Variant Fields

- [ ] **Add Variant**
  - Click nút "Thêm biến thể"
  - ✅ Một variant mới xuất hiện với index #2
  - ✅ Tất cả fields đều empty (trừ default values)

- [ ] **Remove Variant**
  - Có 2 variants, click nút Trash trên variant #2
  - ✅ Variant #2 biến mất
  - ✅ Variant #1 vẫn còn (không thể xóa variant cuối cùng)

- [ ] **Required Fields**
  - Để trống "Kích thước" và "Giá"
  - ✅ Submit form → Error messages hiển thị

### 4.2 Variant Image Upload

- [ ] **Upload Variant Image**
  - Trong variant #1, click upload area
  - ✅ File picker mở
  - ✅ Chọn ảnh → Preview hiển thị (32x32 rounded)
  - ✅ Có nút X để xóa

- [ ] **Remove Variant Image**
  - Click X trên variant image
  - ✅ Ảnh biến mất, upload area hiển thị lại

### 4.3 Variant Weight & Dimensions

- [ ] **Variant Weight**
  - Nhập: `800` (gram)
  - ✅ Input nhận giá trị
  - ✅ Có thể để trống (optional)

- [ ] **Variant Dimensions**
  - Nhập Length: `80`, Width: `50`, Height: `60`
  - ✅ Tất cả 3 fields nhận giá trị
  - ✅ Có thể để trống (optional)

### 4.4 isPopular Checkbox

- [ ] **Toggle Popular**
  - Click checkbox "Variant phổ biến" trên variant #1
  - ✅ Checkbox được tick
  - ✅ Click lại → Uncheck

- [ ] **Multiple Popular Variants**
  - Đánh dấu cả 2 variants là Popular
  - ✅ Cả 2 checkboxes đều tick
  - ✅ Submit → Dữ liệu lưu đúng: `variants[0].isPopular: true`, `variants[1].isPopular: true`

---

## 5️⃣ Collection & Combo Section

### 5.1 Collection Input

- [ ] **Collection Name**
  - Nhập: "Teddy Classic"
  - ✅ Input nhận giá trị
  - ✅ Có thể để trống (optional)

### 5.2 Related Products Selector

- [ ] **Search Products**
  - Nhập "gấu" vào search box
  - ✅ Sau 300ms, dropdown hiển thị kết quả
  - ✅ Mỗi kết quả có: ảnh thumbnail, tên sản phẩm, category

- [ ] **Select Product**
  - Click vào một sản phẩm trong dropdown
  - ✅ Sản phẩm được thêm vào "Đã chọn"
  - ✅ Badge hiển thị với ảnh thumbnail và tên
  - ✅ Dropdown đóng lại

- [ ] **Remove Product**
  - Click nút X trên badge
  - ✅ Badge biến mất
  - ✅ Sản phẩm có thể được chọn lại

- [ ] **Filter Current Product**
  - Đang edit sản phẩm A
  - ✅ Sản phẩm A không xuất hiện trong search results

- [ ] **Filter Already Selected**
  - Đã chọn sản phẩm B
  - ✅ Sản phẩm B không xuất hiện trong search results nữa

### 5.3 Combo Products Builder

- [ ] **Add Combo Item**
  - Click "Thêm sản phẩm"
  - ✅ Card mới xuất hiện với index #1
  - ✅ Có search box để chọn product

- [ ] **Search & Select Product for Combo**
  - Trong combo item #1, nhập "gấu" vào search
  - ✅ Dropdown hiển thị kết quả
  - ✅ Click một sản phẩm
  - ✅ Card hiển thị: ảnh thumbnail, tên sản phẩm, ID
  - ✅ Có nút X để xóa selection

- [ ] **Set Discount for Item**
  - Sau khi chọn product, nhập discount: `15` (%)
  - ✅ Input nhận giá trị
  - ✅ Validation: chỉ chấp nhận 0-100

- [ ] **Remove Combo Item**
  - Click nút Trash trên combo item #1
  - ✅ Card biến mất

- [ ] **Bundle Discount**
  - Nhập: `5` (%)
  - ✅ Input nhận giá trị
  - ✅ Validation: 0-100

- [ ] **Multiple Combo Items**
  - Thêm 3 combo items với discount khác nhau
  - ✅ Tất cả 3 items đều hiển thị
  - ✅ Submit → Dữ liệu lưu đúng array

---

## 6️⃣ Form Integration & Validation

### 6.1 Accordion Navigation

- [ ] **Accordion Sections**
  - Mở trang `/admin/products/new`
  - ✅ Accordion hiển thị các sections:
    - Thông tin cơ bản (mở mặc định)
    - Mô tả sản phẩm (mở mặc định)
    - Chi tiết sản phẩm
    - Biến thể & Kho
    - Media mở rộng
    - Quà tặng & Dịch vụ
    - SEO & Collection

- [ ] **Expand/Collapse**
  - Click vào "Chi tiết sản phẩm"
  - ✅ Section mở ra, hiển thị ProductDetailsSection
  - ✅ Click lại → Section đóng lại

### 6.2 Form Submission

- [ ] **Submit với đầy đủ data**
  - Điền đầy đủ tất cả sections
  - ✅ Click "Lưu" hoặc "Publish"
  - ✅ Form submit thành công
  - ✅ Redirect về trang products list hoặc edit page

- [ ] **Submit với missing required fields**
  - Để trống "Tên sản phẩm"
  - ✅ Click "Lưu" → Error message hiển thị
  - ✅ Form không submit

- [ ] **Submit với invalid data**
  - Nhập weight: `-100`
  - ✅ Error message hiển thị
  - ✅ Form không submit

### 6.3 Data Persistence

- [ ] **Save & Reload**
  - Điền form đầy đủ
  - ✅ Click "Lưu" → Success
  - ✅ Reload trang edit
  - ✅ Tất cả dữ liệu được load lại đúng:
    - Gift wrapping options
    - Special occasions
    - Variant images
    - Related products
    - Combo products

---

## 7️⃣ Edge Cases & Error Handling

### 7.1 Network Errors

- [ ] **Upload Image - Network Error**
  - Disconnect internet
  - ✅ Click upload image
  - ✅ Hiển thị error message: "Tải ảnh lên thất bại"

### 7.2 Large Data

- [ ] **Many Related Products**
  - Chọn 20 related products
  - ✅ Tất cả badges hiển thị (có thể scroll)
  - ✅ Submit → Dữ liệu lưu đúng

- [ ] **Many Combo Items**
  - Thêm 10 combo items
  - ✅ Tất cả cards hiển thị
  - ✅ Submit → Dữ liệu lưu đúng

### 7.3 Special Characters

- [ ] **Special Characters in Text**
  - Nhập: "Gấu bông & Quà tặng <3"
  - ✅ Text được lưu đúng (không bị escape)

---

## 8️⃣ Performance & UX

### 8.1 Loading States

- [ ] **Image Upload Loading**
  - Upload ảnh lớn (> 2MB)
  - ✅ Hiển thị loading indicator: "Đang tải ảnh lên..."
  - ✅ Sau khi upload xong, loading biến mất

### 8.2 Responsive Design

- [ ] **Mobile View**
  - Mở form trên mobile (< 768px)
  - ✅ Accordion sections vẫn hoạt động
  - ✅ Inputs không bị overflow
  - ✅ Buttons có kích thước phù hợp

### 8.3 Accessibility

- [ ] **Keyboard Navigation**
  - Tab qua các fields
  - ✅ Focus visible rõ ràng
  - ✅ Enter để submit form

- [ ] **Screen Reader**
  - Sử dụng screen reader (nếu có)
  - ✅ Labels được đọc đúng
  - ✅ Error messages được announce

---

## 📊 Test Results Summary

**Ngày test:** _______________  
**Người test:** _______________  
**Environment:** Development / Staging / Production

### Overall Status

- [ ] ✅ **PASS** - Tất cả test cases đều pass
- [ ] ❌ **FAIL** - Có test cases fail (xem chi tiết bên dưới)

### Failed Test Cases

| Test Case | Section | Issue | Screenshot/Notes |
|-----------|---------|-------|------------------|
|           |         |       |                  |

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
**Version:** Phase 2 - CMS Updates

