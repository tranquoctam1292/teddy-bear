# 📋 Manual QA Checklist - Phase 4: Comment System

**Project:** Teddy Shop Blog Upgrade  
**Phase:** Phase 4 - Comment System với Spam Filter  
**Date:** [Ngày kiểm tra]  
**Tester:** [Tên người kiểm tra]  
**Status:** ⏳ PENDING

---

## ⚙️ Setup & Configuration

**Cloudflare Turnstile Test Keys (Development):**

- ✅ Site Key: `1x00000000000000000000AA` (always passes - no verification needed)
- ✅ Secret Key: `1x0000000000000000000000000000000AA` (for server-side verification)
- ✅ Test keys đã được cấu hình mặc định trong code
- ✅ Không cần set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` trong `.env.local` cho development

**Production:**

- ⚠️ Phải thay bằng real keys từ Cloudflare Dashboard
- ⚠️ Get keys tại: https://dash.cloudflare.com/

---

## 📊 Executive Summary

**Mục tiêu:** Xác minh hệ thống bình luận hoạt động đúng, spam filter phát hiện spam chính xác, và Admin có thể duyệt bài hiệu quả.

**Phạm vi kiểm tra:**

- ✅ User gửi comment với CAPTCHA
- ✅ Spam detection tự động
- ✅ Admin moderation dashboard
- ✅ Nested replies (cấp 2)
- ✅ Status workflow (Pending → Approved/Spam)

---

## 1️⃣ User Flow - Gửi Bình Luận

### Test Case 1.1: Gửi Comment Bình Thường

**Mục tiêu:** User có thể gửi comment thành công với CAPTCHA.

**Các bước:**

1. ✅ Vào trang blog post bất kỳ (ví dụ: `/blog/[slug]`)
2. ✅ Scroll xuống phần "Bình luận"
3. ✅ Điền form:
   - Tên: "Nguyễn Văn A"
   - Email: "user@example.com"
   - Nội dung: "Bài viết rất hay! Cảm ơn tác giả."
4. ✅ Hoàn thành CAPTCHA (Turnstile)
5. ✅ Click "Gửi bình luận"

**Kỳ vọng:**

- ✅ CAPTCHA hiển thị và yêu cầu giải
- ✅ Nút "Gửi bình luận" chỉ enable sau khi CAPTCHA solved
- ✅ Sau khi submit, hiện Toast: "Bình luận đã được gửi và đang chờ duyệt" (nếu status = pending)
- ✅ Form reset sau khi submit thành công
- ✅ Comment KHÔNG hiện ngay lập tức (nếu config duyệt thủ công)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 1.2: Validation Form

**Mục tiêu:** Form validation hoạt động đúng.

**Các bước:**

1. ✅ Thử submit form trống
2. ✅ Thử submit với email không hợp lệ (ví dụ: "invalid-email")
3. ✅ Thử submit với nội dung quá ngắn (< 10 ký tự)
4. ✅ Thử submit với nội dung quá dài (> 2000 ký tự)

**Kỳ vọng:**

- ✅ Hiện lỗi validation cho từng trường
- ✅ Không cho phép submit khi có lỗi
- ✅ Thông báo lỗi rõ ràng (tiếng Việt)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 1.3: CAPTCHA Required

**Mục tiêu:** Không thể submit nếu chưa giải CAPTCHA.

**Các bước:**

1. ✅ Điền đầy đủ form
2. ✅ KHÔNG giải CAPTCHA
3. ✅ Thử click "Gửi bình luận"

**Kỳ vọng:**

- ✅ Nút "Gửi bình luận" bị disable
- ✅ Hiện thông báo: "Vui lòng hoàn thành CAPTCHA để gửi bình luận"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 2️⃣ Spam Detection - Tự Động Phát Hiện Spam

### Test Case 2.1: Comment Chứa Từ Khóa Cấm

**Mục tiêu:** Spam filter phát hiện comment chứa từ khóa cấm.

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Điền form:
   - Tên: "Test User"
   - Email: "test@example.com"
   - Nội dung: "Mua ngay tại http://spam-link.com"
3. ✅ Hoàn thành CAPTCHA
4. ✅ Submit comment

**Kỳ vọng:**

- ✅ Comment được gửi thành công
- ✅ Status tự động = `auto-spam` (hoặc `spam`)
- ✅ Admin thấy comment trong tab "Spam"
- ✅ Spam Score >= 50
- ✅ Spam Reasons hiển thị: "Chứa từ khóa cấm: mua ngay"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 2.2: Comment All CAPS

**Mục tiêu:** Spam filter phát hiện comment viết hoa toàn bộ.

**Các bước:**

1. ✅ Điền form:
   - Nội dung: "THIS IS SPAM MESSAGE IN ALL CAPS"
2. ✅ Submit comment

**Kỳ vọng:**

- ✅ Spam Score tăng (+25 điểm)
- ✅ Spam Reasons: "Viết hoa toàn bộ (suspicious)"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 2.3: Comment Quá Nhiều Links

**Mục tiêu:** Spam filter phát hiện comment có quá nhiều links.

**Các bước:**

1. ✅ Điền form:
   - Nội dung: "Check out http://link1.com and https://link2.com and http://link3.com and http://link4.com"
2. ✅ Submit comment

**Kỳ vọng:**

- ✅ Spam Score tăng (+20 điểm)
- ✅ Spam Reasons: "Quá nhiều liên kết: 4 (tối đa 3)"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 2.4: Email Từ Domain Bị Chặn

**Mục tiêu:** Spam filter phát hiện email từ domain bị chặn.

**Các bước:**

1. ✅ Điền form:
   - Email: "user@tempmail.com"
   - Nội dung: "Normal comment"
2. ✅ Submit comment

**Kỳ vọng:**

- ✅ Spam Score tăng (+40 điểm)
- ✅ Status = `auto-spam`
- ✅ Spam Reasons: "Email từ domain bị chặn: tempmail.com"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 2.5: Comment Sạch (Auto-Approve)

**Mục tiêu:** Comment sạch được auto-approve.

**Các bước:**

1. ✅ Điền form:
   - Nội dung: "Bài viết rất hay! Cảm ơn tác giả đã chia sẻ thông tin hữu ích này."
2. ✅ Submit comment

**Kỳ vọng:**

- ✅ Spam Score < 20
- ✅ Status = `approved`
- ✅ Comment hiện ngay lập tức trên trang blog

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 3️⃣ Admin Moderation Dashboard

### Test Case 3.1: Xem Danh Sách Comments

**Mục tiêu:** Admin có thể xem tất cả comments với filter.

**Các bước:**

1. ✅ Đăng nhập với quyền Admin
2. ✅ Vào `/admin/comments`
3. ✅ Kiểm tra các tabs: All, Pending, Approved, Spam

**Kỳ vọng:**

- ✅ Tab "All" hiển thị tất cả comments
- ✅ Tab "Pending" chỉ hiển thị comments chờ duyệt
- ✅ Tab "Approved" chỉ hiển thị comments đã duyệt
- ✅ Tab "Spam" hiển thị comments spam (bao gồm auto-spam)
- ✅ Số lượng comments đúng trong mỗi tab

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 3.2: Duyệt Comment (Approve)

**Mục tiêu:** Admin có thể duyệt comment từ Pending.

**Các bước:**

1. ✅ Vào tab "Pending"
2. ✅ Tìm comment cần duyệt
3. ✅ Click nút "Duyệt" (hoặc checkbox + bulk action)
4. ✅ Quay lại trang blog post tương ứng

**Kỳ vọng:**

- ✅ Comment chuyển từ "Pending" sang "Approved"
- ✅ Comment hiện lên trên trang blog post
- ✅ Toast notification: "Đã duyệt bình luận"
- ✅ Comment không còn trong tab "Pending"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 3.3: Đánh Dấu Spam

**Mục tiêu:** Admin có thể đánh dấu comment là spam.

**Các bước:**

1. ✅ Vào tab "Pending" hoặc "Approved"
2. ✅ Tìm comment cần đánh dấu spam
3. ✅ Click nút "Spam"

**Kỳ vọng:**

- ✅ Comment chuyển sang status "spam"
- ✅ Comment xuất hiện trong tab "Spam"
- ✅ Toast notification: "Đã đánh dấu spam bình luận"
- ✅ Comment không hiện trên trang blog post

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 3.4: Xem Spam Score & Reasons

**Mục tiêu:** Admin có thể xem spam score và lý do spam.

**Các bước:**

1. ✅ Vào tab "Spam"
2. ✅ Tìm comment có spam score cao
3. ✅ Kiểm tra cột "Spam Score" và "Nội dung"

**Kỳ vọng:**

- ✅ Spam Score hiển thị (0-100)
- ✅ Màu sắc: Đỏ nếu >= 50, Vàng nếu >= 20, Xanh nếu < 20
- ✅ Spam Reasons hiển thị dưới nội dung comment
- ✅ Icon cảnh báo nếu score >= 50

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 3.5: Xóa Comment

**Mục tiêu:** Admin có thể xóa comment.

**Các bước:**

1. ✅ Tìm comment cần xóa
2. ✅ Click nút "Xóa" (trash icon)
3. ✅ Confirm (nếu có)

**Kỳ vọng:**

- ✅ Comment bị xóa khỏi database
- ✅ Comment không còn hiện trong danh sách
- ✅ Toast notification: "Đã xóa bình luận"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 3.6: Bulk Actions

**Mục tiêu:** Admin có thể thao tác hàng loạt.

**Các bước:**

1. ✅ Chọn nhiều comments (checkbox)
2. ✅ Chọn action: "Duyệt tất cả" hoặc "Đánh dấu spam"
3. ✅ Click "Áp dụng"

**Kỳ vọng:**

- ✅ Tất cả comments được chọn được cập nhật
- ✅ Toast notification hiển thị số lượng đã cập nhật
- ✅ Danh sách refresh sau khi cập nhật

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 4️⃣ Nested Replies (Cấp 2)

### Test Case 4.1: Reply Comment

**Mục tiêu:** User có thể reply comment.

**Các bước:**

1. ✅ Vào trang blog post có comments
2. ✅ Tìm comment cần reply
3. ✅ Click nút "Phản hồi"
4. ✅ Điền form reply (tên, email, nội dung)
5. ✅ Hoàn thành CAPTCHA
6. ✅ Submit

**Kỳ vọng:**

- ✅ Form reply hiện inline bên dưới comment
- ✅ Reply được gửi thành công
- ✅ Reply hiện thụt vào trong (indent) sau khi được duyệt
- ✅ Reply có `parentId` trỏ đến comment gốc

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 4.2: Nested Structure (Tree)

**Mục tiêu:** Comments hiển thị đúng cấu trúc tree.

**Các bước:**

1. ✅ Tạo comment gốc (level 1)
2. ✅ Reply comment gốc (level 2)
3. ✅ Reply comment level 2 (level 3 - nếu cho phép)

**Kỳ vọng:**

- ✅ Level 1: Không thụt vào
- ✅ Level 2: Thụt vào 8-12px (mobile/desktop)
- ✅ Level 3: Thụt vào thêm 8-12px
- ✅ Border-left hiển thị cho nested comments
- ✅ Avatar và meta info hiển thị đúng

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 4.3: Max Depth Limit

**Mục tiêu:** Giới hạn độ sâu của nested replies.

**Các bước:**

1. ✅ Tạo comment gốc
2. ✅ Reply đến level 3
3. ✅ Thử reply level 4

**Kỳ vọng:**

- ✅ Nút "Phản hồi" ẩn khi đạt max depth (3 levels)
- ✅ Hoặc hiện thông báo: "Không thể reply sâu hơn"

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 5️⃣ UI/UX & Responsive

### Test Case 5.1: Loading States

**Mục tiêu:** Loading states hiển thị đúng.

**Các bước:**

1. ✅ Submit comment
2. ✅ Quan sát UI trong lúc submit

**Kỳ vọng:**

- ✅ Nút "Gửi bình luận" hiện spinner và text "Đang gửi..."
- ✅ Nút bị disable trong lúc submit
- ✅ Comment list hiện spinner khi đang load

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 5.2: Toast Notifications

**Mục tiêu:** Toast notifications hiển thị đúng.

**Các bước:**

1. ✅ Submit comment thành công
2. ✅ Submit comment thất bại
3. ✅ Admin approve comment

**Kỳ vọng:**

- ✅ Toast hiện ở góc trên/bên phải
- ✅ Màu xanh cho success, đỏ cho error
- ✅ Tự động ẩn sau 3-5 giây
- ✅ Có thể đóng thủ công

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 5.3: Mobile Responsive

**Mục tiêu:** Comment system responsive trên mobile.

**Các bước:**

1. ✅ Mở trang blog post trên mobile (375px width)
2. ✅ Test form comment
3. ✅ Test comment list
4. ✅ Test nested replies

**Kỳ vọng:**

- ✅ Form comment hiển thị đầy đủ
- ✅ Comment list responsive (không bị tràn)
- ✅ Nested replies indent phù hợp
- ✅ Buttons đủ lớn để click (touch-friendly)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 5.4: Avatar Display

**Mục tiêu:** Avatar hiển thị đúng từ email/name.

**Các bước:**

1. ✅ Gửi comment với email: "test@example.com", name: "Nguyễn Văn A"
2. ✅ Kiểm tra avatar

**Kỳ vọng:**

- ✅ Avatar hiển thị initials "NV" hoặc "NA"
- ✅ Background color random/consistent
- ✅ Avatar tròn, kích thước 40x40px

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 6️⃣ Security & Performance

### Test Case 6.1: XSS Prevention

**Mục tiêu:** Content được sanitize để tránh XSS.

**Các bước:**

1. ✅ Gửi comment với nội dung: `<script>alert('xss')</script>Hello`
2. ✅ Kiểm tra nội dung hiển thị

**Kỳ vọng:**

- ✅ `<script>` tag bị remove
- ✅ Chỉ hiển thị text "Hello"
- ✅ Không có alert popup

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 6.2: CAPTCHA Verification

**Mục tiêu:** CAPTCHA token được gửi lên server.

**Các bước:**

1. ✅ Mở DevTools → Network tab
2. ✅ Submit comment
3. ✅ Kiểm tra request payload

**Kỳ vọng:**

- ✅ Request chứa CAPTCHA token (nếu server yêu cầu)
- ✅ Token hợp lệ (format đúng)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 6.3: Rate Limiting (Nếu có)

**Mục tiêu:** Không thể spam comments quá nhanh.

**Các bước:**

1. ✅ Gửi 5 comments liên tiếp trong 1 phút
2. ✅ Quan sát response

**Kỳ vọng:**

- ✅ Có rate limiting (nếu đã implement)
- ✅ Hoặc hiện cảnh báo nếu quá nhiều comments

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 7️⃣ Edge Cases

### Test Case 7.1: Comment Dài

**Mục tiêu:** Comment dài hiển thị đúng.

**Các bước:**

1. ✅ Gửi comment với nội dung ~2000 ký tự
2. ✅ Kiểm tra hiển thị

**Kỳ vọng:**

- ✅ Comment hiển thị đầy đủ
- ✅ Không bị cắt hoặc tràn layout

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 7.2: Comment Với Emoji

**Mục tiêu:** Comment với emoji hiển thị đúng.

**Các bước:**

1. ✅ Gửi comment: "Bài viết rất hay! 👍😊❤️"
2. ✅ Kiểm tra hiển thị

**Kỳ vọng:**

- ✅ Emoji hiển thị đúng
- ✅ Không bị lỗi encoding

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### Test Case 7.3: Comment Với Line Breaks

**Mục tiêu:** Line breaks được preserve.

**Các bước:**

1. ✅ Gửi comment:
   ```
   Dòng 1
   Dòng 2
   Dòng 3
   ```
2. ✅ Kiểm tra hiển thị

**Kỳ vọng:**

- ✅ Line breaks được preserve (hoặc convert thành `<br>`)
- ✅ Format đúng

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 📊 Test Summary

| Category         | Total  | Passed | Failed | Skipped |
| ---------------- | ------ | ------ | ------ | ------- |
| User Flow        | 3      | ⬜     | ⬜     | ⬜      |
| Spam Detection   | 5      | ⬜     | ⬜     | ⬜      |
| Admin Moderation | 6      | ⬜     | ⬜     | ⬜      |
| Nested Replies   | 3      | ⬜     | ⬜     | ⬜      |
| UI/UX            | 4      | ⬜     | ⬜     | ⬜      |
| Security         | 3      | ⬜     | ⬜     | ⬜      |
| Edge Cases       | 3      | ⬜     | ⬜     | ⬜      |
| **TOTAL**        | **27** | ⬜     | ⬜     | ⬜      |

---

## 🐛 Known Issues

### Issue 1: [Tiêu đề]

**Mô tả:** [Mô tả chi tiết]  
**Severity:** 🔴 Critical / 🟡 Medium / 🟢 Low  
**Status:** ⏳ Open / ✅ Fixed / ⏸️ In Progress  
**Steps to Reproduce:**

1. [Bước 1]
2. [Bước 2]

---

## ✅ Sign-off

**Tester:** [Tên]  
**Date:** [Ngày]  
**Status:** ⏳ PENDING / ✅ PASSED / ❌ FAILED

**Notes:** [Ghi chú tổng kết]

---

**Version:** 1.0  
**Last Updated:** [Ngày cập nhật]
