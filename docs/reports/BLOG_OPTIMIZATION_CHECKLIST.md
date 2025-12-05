# 📋 Blog Optimization & Audit Checklist

**Project:** Teddy Shop Blog Upgrade  
**Phase:** Phase 5 - Final Optimization & Polish  
**Date:** [Ngày kiểm tra]  
**Auditor:** [Tên người kiểm tra]  
**Status:** ⏳ PENDING

---

## 📊 Executive Summary

**Mục tiêu:** Đảm bảo Blog System đạt chuẩn Production về SEO, Performance, Accessibility và Security trước khi deploy.

**Phạm vi kiểm tra:**
- ✅ SEO Audit (Meta tags, Schema.org, Canonical URLs)
- ✅ Performance Optimization (Bundle size, Lazy loading, Core Web Vitals)
- ✅ Accessibility (A11y) Compliance
- ✅ Security Hardening (CAPTCHA, Rate limiting, XSS prevention)

---

## 1️⃣ SEO Audit

### 1.1 Meta Tags - Blog Post Pages

**Mục tiêu:** Kiểm tra Meta Title, Description, Canonical URL cho tất cả template types.

**Test Cases:**

#### Test Case 1.1.1: Default Template

**Các bước:**

1. ✅ Vào trang blog post với template "default"
2. ✅ Mở DevTools → Elements → `<head>`
3. ✅ Kiểm tra các meta tags:

**Kỳ vọng:**

- ✅ `<title>`: Có title, độ dài 50-60 ký tự
- ✅ `<meta name="description">`: Có description, độ dài 150-160 ký tự
- ✅ `<link rel="canonical">`: URL chính xác, không có duplicate
- ✅ `<meta property="og:title">`: Match với title
- ✅ `<meta property="og:description">`: Match với description
- ✅ `<meta property="og:image">`: Có featured image hoặc default image
- ✅ `<meta property="og:type">`: "article"
- ✅ `<meta property="article:published_time">`: Có timestamp
- ✅ `<meta property="article:author">`: Có author name

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 1.1.2: Gift Guide Template

**Các bước:**

1. ✅ Vào trang blog post với template "gift-guide"
2. ✅ Kiểm tra meta tags như Test Case 1.1.1
3. ✅ Kiểm tra thêm:

**Kỳ vọng:**

- ✅ `<meta property="og:type">`: "article" hoặc "product"
- ✅ Schema.org `Product` hoặc `ItemList` cho gift guide
- ✅ Structured data cho price range (nếu có)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 1.1.3: Review Template

**Các bước:**

1. ✅ Vào trang blog post với template "review"
2. ✅ Kiểm tra meta tags như Test Case 1.1.1
3. ✅ Kiểm tra thêm:

**Kỳ vọng:**

- ✅ Schema.org `Review` với `reviewRating`
- ✅ Schema.org `Product` cho sản phẩm được review
- ✅ Comparison table có structured data (nếu có)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 1.2 Schema.org Structured Data

**Mục tiêu:** Kiểm tra JSON-LD structured data đúng format và validate.

**Test Cases:**

#### Test Case 1.2.1: BlogPosting Schema

**Các bước:**

1. ✅ Vào trang blog post bất kỳ
2. ✅ View page source
3. ✅ Tìm `<script type="application/ld+json">`
4. ✅ Copy JSON và validate tại: https://validator.schema.org/

**Kỳ vọng:**

- ✅ JSON-LD có `@type: "BlogPosting"`
- ✅ Có `headline`, `datePublished`, `dateModified`
- ✅ Có `author` với `@type: "Person"` hoặc `Organization`
- ✅ Có `publisher` với logo
- ✅ Validate thành công trên schema.org validator

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 1.2.2: ArticleWithAuthor Schema (E-E-A-T)

**Các bước:**

1. ✅ Vào trang blog post có author
2. ✅ Kiểm tra structured data cho author

**Kỳ vọng:**

- ✅ Có `author` object với đầy đủ thông tin
- ✅ Có `name`, `url`, `image` (avatar)
- ✅ Có `jobTitle` hoặc `description` (credentials)
- ✅ Có `sameAs` (social links) nếu có

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 1.3 Canonical URLs

**Mục tiêu:** Đảm bảo không có duplicate content issues.

**Các bước:**

1. ✅ Kiểm tra tất cả blog post pages
2. ✅ Verify canonical URL

**Kỳ vọng:**

- ✅ Mỗi page có đúng 1 canonical URL
- ✅ Canonical URL là absolute URL (https://)
- ✅ Không có trailing slash issues
- ✅ Preview mode (`?preview=true`) không index (noindex)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 1.4 Open Graph Images

**Mục tiêu:** Đảm bảo OG images hiển thị đúng trên social media.

**Các bước:**

1. ✅ Kiểm tra `<meta property="og:image">`
2. ✅ Test với Facebook Debugger: https://developers.facebook.com/tools/debug/
3. ✅ Test với Twitter Card Validator: https://cards-dev.twitter.com/validator

**Kỳ vọng:**

- ✅ OG image URL hợp lệ (absolute URL)
- ✅ Image size: 1200x630px (recommended)
- ✅ Image format: JPG hoặc PNG
- ✅ Image load thành công
- ✅ Facebook/Twitter preview hiển thị đúng

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 2️⃣ Performance Optimization

### 2.1 Bundle Size Analysis

**Mục tiêu:** Kiểm tra kích thước bundle JS, đặc biệt là Tiptap editor.

**Test Cases:**

#### Test Case 2.1.1: Admin Blog Editor Bundle

**Các bước:**

1. ✅ Vào `/admin/posts/new`
2. ✅ Mở DevTools → Network tab
3. ✅ Reload page
4. ✅ Kiểm tra bundle size

**Kỳ vọng:**

- ✅ Initial bundle < 500KB (gzipped)
- ✅ Tiptap editor lazy loaded (nếu có)
- ✅ Total JS < 1MB (gzipped)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 2.1.2: Public Blog Post Bundle

**Các bước:**

1. ✅ Vào trang blog post bất kỳ
2. ✅ Kiểm tra bundle size

**Kỳ vọng:**

- ✅ Initial bundle < 250KB (gzipped)
- ✅ No Tiptap editor code (chỉ admin)
- ✅ Comment system lazy loaded (nếu có)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 2.2 Image Lazy Loading

**Mục tiêu:** Đảm bảo ảnh trong bài viết được lazy load.

**Các bước:**

1. ✅ Vào trang blog post có nhiều ảnh
2. ✅ Mở DevTools → Network tab
3. ✅ Scroll xuống từ từ
4. ✅ Quan sát khi nào ảnh được load

**Kỳ vọng:**

- ✅ Ảnh chỉ load khi vào viewport (lazy loading)
- ✅ Sử dụng `loading="lazy"` hoặc `next/image` với lazy
- ✅ Above-the-fold images có `priority` prop

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 2.3 Core Web Vitals

**Mục tiêu:** Đo LCP, CLS, FID trên trang blog post dài.

**Test Cases:**

#### Test Case 2.3.1: Largest Contentful Paint (LCP)

**Các bước:**

1. ✅ Vào trang blog post dài (> 2000 words)
2. ✅ Mở DevTools → Lighthouse
3. ✅ Run Performance audit
4. ✅ Kiểm tra LCP score

**Kỳ vọng:**

- ✅ LCP < 2.5 seconds (Good)
- ✅ LCP element là featured image hoặc heading
- ✅ Image optimization (WebP, proper sizing)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 2.3.2: Cumulative Layout Shift (CLS)

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Run Lighthouse Performance audit
3. ✅ Kiểm tra CLS score

**Kỳ vọng:**

- ✅ CLS < 0.1 (Good)
- ✅ No layout shift khi images load
- ✅ No layout shift khi ads/embeds load (nếu có)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

#### Test Case 2.3.3: First Input Delay (FID)

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Run Lighthouse Performance audit
3. ✅ Kiểm tra FID score

**Kỳ vọng:**

- ✅ FID < 100ms (Good)
- ✅ No long tasks blocking main thread
- ✅ Comment form responsive

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 2.4 Dynamic Import Check

**Mục tiêu:** Kiểm tra các heavy libraries được dynamic import.

**Các bước:**

1. ✅ Kiểm tra code cho Tiptap, Recharts, Framer Motion
2. ✅ Verify dynamic import pattern

**Kỳ vọng:**

- ✅ Tiptap chỉ load trên admin editor pages
- ✅ Recharts chỉ load trên analytics pages
- ✅ Framer Motion chỉ load khi cần (modals)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 3️⃣ Accessibility (A11y)

### 3.1 Color Contrast

**Mục tiêu:** Đảm bảo contrast ratio đạt WCAG 2.1 AA.

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Sử dụng tool: https://webaim.org/resources/contrastchecker/
3. ✅ Kiểm tra các text elements

**Kỳ vọng:**

- ✅ Body text: Contrast ratio >= 4.5:1
- ✅ Heading text: Contrast ratio >= 4.5:1
- ✅ Link text: Contrast ratio >= 4.5:1
- ✅ Button text: Contrast ratio >= 4.5:1

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 3.2 ARIA Labels

**Mục tiêu:** Đảm bảo interactive elements có ARIA labels.

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Inspect các nút Share, Comment, Like
3. ✅ Kiểm tra ARIA attributes

**Kỳ vọng:**

- ✅ Icon-only buttons có `aria-label`
- ✅ Form inputs có `aria-label` hoặc `<label>`
- ✅ Toggle buttons có `aria-pressed` state
- ✅ Modal dialogs có `aria-modal="true"`

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 3.3 Keyboard Navigation

**Mục tiêu:** Đảm bảo tất cả interactive elements có thể navigate bằng keyboard.

**Các bước:**

1. ✅ Vào trang blog post
2. ✅ Chỉ sử dụng Tab, Enter, Space để navigate
3. ✅ Test tất cả interactive elements

**Kỳ vọng:**

- ✅ Tab order hợp lý
- ✅ Focus visible (outline)
- ✅ Enter/Space activate buttons
- ✅ Escape close modals
- ✅ Skip links hoạt động (nếu có)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 3.4 Screen Reader Testing

**Mục tiêu:** Test với screen reader (NVDA/JAWS/VoiceOver).

**Các bước:**

1. ✅ Enable screen reader
2. ✅ Navigate trang blog post
3. ✅ Verify announcements

**Kỳ vọng:**

- ✅ Heading structure đúng (h1 → h2 → h3)
- ✅ Landmarks được announce (main, article, aside)
- ✅ Form labels được read
- ✅ Error messages được announce

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 4️⃣ Security Hardening

### 4.1 CAPTCHA Configuration

**Mục tiêu:** Kiểm tra CAPTCHA keys trên Vercel.

**Các bước:**

1. ✅ Vào Vercel Dashboard → Project Settings → Environment Variables
2. ✅ Kiểm tra `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
3. ✅ Verify không phải test key trong production

**Kỳ vọng:**

- ✅ Production có real Turnstile Site Key
- ✅ Secret Key được set (nếu cần server-side verification)
- ✅ Test keys chỉ dùng trong development

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 4.2 Rate Limiting

**Mục tiêu:** Kiểm tra rate limiting cho Comment API.

**Các bước:**

1. ✅ Gửi 10 comments liên tiếp từ cùng IP
2. ✅ Quan sát response

**Kỳ vọng:**

- ✅ Có rate limiting (nếu đã implement)
- ✅ Error message rõ ràng khi rate limit exceeded
- ✅ Rate limit reasonable (ví dụ: 5 comments/hour)

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 4.3 XSS Prevention

**Mục tiêu:** Kiểm tra content sanitization.

**Các bước:**

1. ✅ Gửi comment với `<script>alert('xss')</script>`
2. ✅ Kiểm tra nội dung hiển thị

**Kỳ vọng:**

- ✅ Script tags bị remove
- ✅ HTML tags được escape hoặc sanitize
- ✅ No JavaScript execution

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 4.4 CSRF Protection

**Mục tiêu:** Kiểm tra CSRF protection cho API routes.

**Các bước:**

1. ✅ Kiểm tra API routes có CSRF token validation
2. ✅ Test với invalid token

**Kỳ vọng:**

- ✅ API routes validate CSRF token (nếu cần)
- ✅ Next.js built-in CSRF protection hoạt động

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 5️⃣ Mobile Responsiveness

### 5.1 Mobile Viewport

**Mục tiêu:** Kiểm tra responsive trên mobile devices.

**Các bước:**

1. ✅ Mở trang blog post trên mobile (375px, 414px)
2. ✅ Test tất cả sections

**Kỳ vọng:**

- ✅ Layout không bị tràn
- ✅ Text readable (font size >= 16px)
- ✅ Buttons đủ lớn để click (min 44x44px)
- ✅ Images responsive

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

### 5.2 Comparison Table Mobile

**Mục tiêu:** Kiểm tra comparison table chuyển sang card stack trên mobile.

**Các bước:**

1. ✅ Vào trang blog post có comparison table
2. ✅ Resize browser xuống mobile width
3. ✅ Kiểm tra layout

**Kỳ vọng:**

- ✅ Desktop: Hiển thị dạng table
- ✅ Mobile: Hiển thị dạng card stack (vertical)
- ✅ Không bị horizontal scroll

**Kết quả:** ⬜ PASS / ⬜ FAIL

**Ghi chú:** [Ghi chú nếu có lỗi]

---

## 📊 Audit Summary

| Category              | Total | Passed | Failed | Skipped |
| --------------------- | ----- | ------ | ------ | ------- |
| SEO Audit             | 4     | ⬜     | ⬜     | ⬜      |
| Performance           | 4     | ⬜     | ⬜     | ⬜      |
| Accessibility         | 4     | ⬜     | ⬜     | ⬜      |
| Security              | 4     | ⬜     | ⬜     | ⬜      |
| Mobile Responsiveness | 2     | ⬜     | ⬜     | ⬜      |
| **TOTAL**             | **18** | ⬜     | ⬜     | ⬜      |

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

**Auditor:** [Tên]  
**Date:** [Ngày]  
**Status:** ⏳ PENDING / ✅ PASSED / ❌ FAILED

**Notes:** [Ghi chú tổng kết]

---

**Version:** 1.0  
**Last Updated:** [Ngày cập nhật]

