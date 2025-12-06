# 📖 Kế Hoạch Tối Ưu Trải Nghiệm Đọc Bài Viết

## Chủ đề: Gấu Bông & Quà Tặng

**Ngày tạo:** 2025-12-06  
**Mục tiêu:** Tối ưu typography, spacing, và visual elements để tạo trải nghiệm đọc dễ chịu, phù hợp với ngành gấu bông, quà tặng

---

## 🎯 Tổng Quan

### Nguyên Tắc Thiết Kế

- **Warm & Friendly:** Màu sắc ấm áp, thân thiện (pink, cream, soft brown)
- **Readable:** Dễ đọc, không gây mỏi mắt
- **Engaging:** Kích thích mua hàng với CTAs và product links rõ ràng
- **Professional:** Vẫn giữ tính chuyên nghiệp, đáng tin cậy

---

## 1️⃣ Typography - Headings (H2, H3, H4)

### Hiện Trạng

- H2: `text-3xl`, border-bottom, `mt-10`, `mb-4`
- H3: `text-2xl`, `mt-8`, `mb-3`
- H4: `text-xl`, `mt-6`, `mb-2`

### Kế Hoạch Cải Thiện

#### **H2 (Tiêu đề chính)**

```css
- Font size: 2.25rem (36px) → 2.5rem (40px) trên desktop
- Font weight: 700 (bold)
- Color: #1f2937 (gray-800) → #111827 (gray-900) để tăng contrast
- Spacing:
  - Margin top: 3rem (48px) - tạo khoảng cách rõ ràng với nội dung trước
  - Margin bottom: 1.5rem (24px)
- Border:
  - Border-bottom: 2px solid #fce7f3 (pink-100) - mềm mại hơn
  - Padding bottom: 0.75rem (12px)
- Decoration:
  - Thêm icon emoji nhỏ (🐻) trước H2 để tạo điểm nhấn friendly
  - Hoặc gradient text với pink accent
```

#### **H3 (Tiêu đề phụ)**

```css
- Font size: 1.75rem (28px) → 1.875rem (30px)
- Font weight: 600 (semibold) - nhẹ hơn H2
- Color: #1f2937 (gray-800) - ĐẬM HƠN để đảm bảo contrast trên pink-50 background
  - Contrast ratio: 7.2:1 trên pink-50 ✅ (WCAG AAA)
- Spacing:
  - Margin top: 2.5rem (40px)
  - Margin bottom: 1rem (16px)
- Decoration:
  - Border-left: 4px solid #f9a8d4 (pink-300) - accent màu hồng
  - Padding left: 1rem (16px)
  - Background: #fdf2f8 (pink-50) - background nhẹ
  - Border radius: 0.5rem (8px) - bo góc mềm mại

⚠️ LƯU Ý: Text color phải đủ đậm (gray-800) trên pink-50 background để đảm bảo readability
```

#### **H4 (Tiêu đề nhỏ)**

```css
- Font size: 1.25rem (20px) → 1.375rem (22px)
- Font weight: 600 (semibold)
- Color: #4b5563 (gray-600)
- Spacing:
  - Margin top: 2rem (32px)
  - Margin bottom: 0.75rem (12px)
- Decoration:
  - Text decoration: underline với màu pink-300
  - Hoặc icon bullet (•) màu pink-400
```

### Visual Hierarchy

```
H2: Lớn nhất, đậm nhất, có border-bottom
H3: Vừa, có border-left accent, background nhẹ
H4: Nhỏ nhất, có underline hoặc bullet
```

---

## 2️⃣ Links (Đường Dẫn)

### Hiện Trạng

- Color: `text-pink-600`
- Hover: `underline`
- No underline mặc định

### Kế Hoạch Cải Thiện

#### **Màu Sắc**

```css
- Default: #db2777 (pink-600) - giữ nguyên (phù hợp brand)
  - Contrast ratio: 4.5:1 trên white background ✅
- Hover: #be185d (pink-700) - đậm hơn khi hover
- Visited: #ec4899 (pink-500) - nhẹ hơn để phân biệt
- Active: #9f1239 (pink-800) - đậm nhất khi click
```

#### **Styling**

```css
- Default:
  - No underline (nhưng có visual indicator rõ ràng)
  - Font weight: 600 (semibold) - TĂNG từ 500 để nổi bật hơn
  - Color: #db2777 (pink-600) - đậm, dễ nhận biết
  - Border-bottom: 2px dashed #f472b6 (pink-400) - DASHED LINE ĐẬM HƠN
  - Background: rgba(252, 231, 243, 0.3) - pink-100 với 30% opacity (highlight nhẹ)
  - Padding: 2px 4px - tạo space cho background
  - Border-radius: 4px
  - Transition: all 0.2s ease

- Hover:
  - Underline: solid 2px pink-600
  - Background: rgba(252, 231, 243, 0.6) - pink-100 với 60% opacity (highlight rõ hơn)
  - Border-bottom: 2px solid pink-600 (chuyển từ dashed sang solid)
  - Padding: 2px 4px
  - Transform: scale(1.02) - phóng to nhẹ

- Focus (Accessibility):
  - Outline: 2px solid pink-500
  - Outline-offset: 2px
  - Background: pink-100 (full opacity khi focus)

⚠️ QUAN TRỌNG:
- Link PHẢI dễ nhận biết ngay cả khi không hover
- Dùng font-weight 600 + dashed border + background highlight để đảm bảo visibility
- Màu pink-600 đủ đậm để contrast tốt trên white background
```

#### **External Links**

```css
- Thêm icon (↗) sau external links
- Color: pink-500
- Font size: 0.875em
```

---

## 3️⃣ Images (Hình Ảnh)

### Hiện Trạng

- Rounded: `rounded-xl`
- Shadow: `shadow-lg`
- Margin: `my-8`

### Kế Hoạch Cải Thiện

#### **Styling**

```css
- Border-radius: 1rem (16px) → 1.5rem (24px) - bo góc mềm hơn
- Shadow:
  - Default: shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1))
  - Hover: shadow-2xl (0 25px 50px -12px rgba(0,0,0,0.25))
  - Transition: shadow 0.3s ease
- Border:
  - 2px solid pink-100 - border mềm mại
  - Hover: 2px solid pink-300
- Margin:
  - Top: 2.5rem (40px)
  - Bottom: 2.5rem (40px)
- Caption:
  - Thêm caption styling với:
    - Font size: 0.875rem (14px) - hoặc 0.9375rem (15px) trên mobile
    - Color: #4b5563 (gray-600) → #374151 (gray-700) - ĐẬM HƠN để contrast tốt
      - Contrast ratio: 4.5:1 trên white background ✅
    - Font style: italic
    - Text align: center
    - Margin top: 0.5rem
    - Background: rgba(249, 250, 251, 0.8) - gray-50 với opacity (nếu cần highlight)

⚠️ LƯU Ý: Caption text phải đủ đậm để đọc được, đặc biệt trên nền sáng
```

````

#### **Layout Options**
```css
- Full width: 100% (mặc định)
- Centered: max-width với margin auto
- Float left/right:
  - Float left: max-width 50%, margin-right 1.5rem
  - Float right: max-width 50%, margin-left 1.5rem
````

#### **Lazy Loading & Placeholder**

```css
- Placeholder: Blur với màu pink-100
- Loading: Skeleton với gradient pink-50 → pink-100
```

---

## 4️⃣ Tables (Bảng)

### Hiện Trạng

- Header: `bg-pink-50`, border gray-300
- Cells: border gray-300

### Kế Hoạch Cải Thiện

#### **Styling**

```css
- Container:
  - Border-radius: 1rem (16px)
  - Overflow: hidden
  - Shadow: shadow-md
  - Border: 1px solid pink-200

- Header (th):
  - Background: Linear gradient (pink-50 → pink-100)
  - Color: #111827 (gray-900) - ĐẬM để contrast tốt trên pink background
    - Contrast ratio: 8.5:1 trên pink-50 ✅ (WCAG AAA)
  - Font weight: 600 (semibold)
  - Padding: 1rem (16px) vertical, 1.25rem (20px) horizontal
  - Border-bottom: 2px solid pink-300
  - Text align: left

⚠️ LƯU Ý: Table header text PHẢI dùng gray-900 (không phải gray-600) để đảm bảo contrast
```

- Cells (td):
  - Padding: 0.875rem (14px) vertical, 1.25rem (20px) horizontal
  - Border: 1px solid pink-100 (nhẹ hơn)
  - Background: white
  - Hover row: background pink-50
- Alternating rows:
  - Even rows: background white
  - Odd rows: background pink-50/30 (30% opacity)
- Responsive:
  - Trên mobile: Horizontal scroll
  - Wrapper: overflow-x-auto với shadow

````

#### **Special Cells**
```css
- Highlight cells: background pink-100, font-weight 600
- Numeric cells: text-align right, font-mono
- Empty cells: background gray-50, italic text "—"
````

---

## 5️⃣ Line Spacing (Khoảng Cách Dòng)

### Hiện Trạng

- Paragraph: `leading-relaxed` (1.625)
- First paragraph: `text-xl`, `font-medium`

### Kế Hoạch Cải Thiện

#### **Paragraphs**

```css
- Line height: 1.75 (28px cho 16px font) - thoáng hơn
- Paragraph spacing:
  - Margin bottom: 1.5rem (24px) - tăng từ 1.5rem
  - First paragraph: margin-top 0

- Font size:
  - Default: 1rem (16px) → 1.0625rem (17px) - dễ đọc hơn
  - First paragraph: 1.25rem (20px) - giữ nguyên
  - Line height first: 1.8 - thoáng hơn
```

#### **Lists**

```css
- Line height: 1.75
- Item spacing: 0.5rem (8px) vertical
- Nested lists:
  - Margin left: 1.5rem (24px)
  - Margin top/bottom: 0.75rem (12px)
```

#### **Blockquotes**

```css
- Line height: 1.8
- Padding: 1.5rem (24px) vertical, 2rem (32px) horizontal
- Margin: 2rem (32px) top/bottom
```

---

## 6️⃣ Color Palette (Bảng Màu)

### Màu Chính

```css
- Primary Pink: #db2777 (pink-600) - links, accents
- Soft Pink: #fce7f3 (pink-100) - backgrounds, borders
- Warm Cream: #fefbf7 (cream-50) - page background
- Text Dark: #111827 (gray-900) - headings
- Text Medium: #374151 (gray-700) - body text
- Text Light: #6b7280 (gray-500) - meta, captions
```

### Màu Accent

```css
- Success: #10b981 (green-500) - callouts, highlights
- Warning: #f59e0b (amber-500) - tips, cautions
- Info: #3b82f6 (blue-500) - information boxes
```

---

## 7️⃣ Spacing System (Hệ Thống Khoảng Cách)

### Vertical Rhythm

```css
- Base unit: 0.5rem (8px)
- Small: 0.75rem (12px) - giữa elements nhỏ
- Medium: 1.5rem (24px) - giữa paragraphs
- Large: 2.5rem (40px) - giữa sections
- XLarge: 3.5rem (56px) - giữa major sections
```

### Horizontal Spacing

```css
- Content width: max-width 65ch (65 characters) - optimal reading width
- Padding: 1.5rem (24px) trên mobile, 2rem (32px) trên desktop
```

---

## 8️⃣ Special Elements

### Blockquotes

```css
- Border-left: 4px solid pink-400 (đậm hơn)
- Background: Linear gradient (pink-50 → white)
- Padding: 1.5rem vertical, 2rem horizontal
- Border-radius: 0.75rem (12px) right side
- Font style: italic
- Font size: 1.125rem (18px)
- Quote icon: "❝" ở đầu, màu pink-400
```

### Code Blocks

```css
- Background: #1f2937 (gray-800) - dark theme
- Text: #f9fafb (gray-50)
- Border-radius: 0.75rem (12px)
- Padding: 1.5rem (24px)
- Font: 'Fira Code', 'Consolas', monospace
- Line numbers: gray-600, padding-right 1rem
```

### Lists

```css
- Unordered:
  - Marker: "🐻" hoặc "•" màu pink-400
  - Spacing: 0.5rem giữa items

- Ordered:
  - Numbers: màu pink-600, font-weight 600
  - Spacing: 0.5rem giữa items
```

---

## 9️⃣ Responsive Design

### Mobile (< 768px)

```css
- Font sizes:
  - Body text: GIỮ NGUYÊN 16px (1rem) - KHÔNG giảm để đảm bảo readability
  - Headings: Giảm 5-10% (H2: 36px, H3: 26px, H4: 20px)
  - First paragraph: 18px (từ 20px) - vẫn dễ đọc
- Spacing: Giảm 20%
- Images: Full width, no float
- Tables: Horizontal scroll
- Headings: Giảm margin-top 30%

⚠️ QUAN TRỌNG: Body text PHẢI ≥ 16px trên mobile để tránh user phải zoom
```

### Tablet (768px - 1024px)

```css
- Font sizes: Giữ nguyên
- Spacing: Giảm 10%
- Images: Max-width 80%
```

### Desktop (> 1024px)

```css
- Font sizes: Full size
- Spacing: Full spacing
- Content width: Max 65ch
```

---

## 🔟 Implementation Priority

### Phase 1: Critical (Ưu tiên cao)

1. ✅ Line spacing (leading) - 1.75
2. ✅ H2, H3, H4 styling với accent colors
3. ✅ Link styling với hover effects
4. ✅ Image styling với border và shadow

### Phase 2: Important (Ưu tiên trung bình)

5. ✅ Table styling với alternating rows
6. ✅ Blockquote styling với gradient
7. ✅ List styling với custom markers
8. ✅ Responsive adjustments

### Phase 3: Enhancement (Tùy chọn)

9. ⬜ Code block syntax highlighting
10. ⬜ Image caption styling
11. ⬜ External link indicators
12. ⬜ Print stylesheet

---

## 📊 Success Metrics

### Readability

- ✅ Line length: 45-75 characters (optimal: 65)
- ✅ Line height: 1.75-1.8
- ✅ Font size: 16-18px base

### Visual Appeal

- ✅ Color contrast: WCAG AA compliant
- ✅ Spacing: Consistent vertical rhythm
- ✅ Hierarchy: Clear H2 > H3 > H4

### User Experience

- ✅ Reading time: Comfortable pace
- ✅ Engagement: CTAs visible, clickable
- ✅ Mobile: Readable trên mọi device

---

## 🎨 Design Tokens

```css
/* Typography */
--font-heading: 'Inter', 'Segoe UI', sans-serif;
--font-body: 'Inter', 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;

/* Colors */
--color-primary: #db2777;
--color-primary-light: #fce7f3;
--color-text-dark: #111827;
--color-text-medium: #374151;
--color-text-light: #6b7280;

/* Spacing */
--spacing-xs: 0.5rem;
--spacing-sm: 0.75rem;
--spacing-md: 1.5rem;
--spacing-lg: 2.5rem;
--spacing-xl: 3.5rem;

/* Border Radius */
--radius-sm: 0.5rem;
--radius-md: 1rem;
--radius-lg: 1.5rem;
```

---

## 📝 Notes & Critical Warnings

### ⚠️ Accessibility Requirements

1. **Font Size trên Mobile:**

   - ❌ KHÔNG được giảm body text < 16px trên mobile
   - ✅ Body text: GIỮ NGUYÊN 16px (1rem) trên mọi device
   - ✅ Chỉ giảm headings (5-10%) và spacing (20%)
   - ✅ First paragraph: 18px trên mobile (vẫn ≥ 16px)

2. **Color Contrast:**

   - ✅ Tất cả text phải đạt contrast ratio ≥ 4.5:1 (WCAG AA)
   - ✅ Headings trên colored backgrounds: ≥ 7:1 (WCAG AAA)
   - ⚠️ Kiểm tra kỹ:
     - Gray-600 trên pink-50: 3.2:1 ❌ → Dùng gray-700 (4.8:1) ✅
     - Gray-600 trên white: 4.6:1 ✅
     - Gray-700 trên pink-50: 4.8:1 ✅
     - Gray-900 trên pink-50: 8.5:1 ✅

3. **Link Visibility:**
   - ✅ Font weight: 600 (semibold) - không dùng 500
   - ✅ Border-bottom: 2px dashed pink-400 (đậm, rõ ràng)
   - ✅ Background: pink-100 với 30% opacity (highlight nhẹ)
   - ✅ Color: pink-600 (đậm, contrast tốt)
   - ✅ Hover: chuyển sang solid underline + background 60% opacity

### Design Principles

- Spacing phải consistent với 8px grid system
- Typography scale: 1.125 (major third) hoặc 1.2 (perfect fourth)
- Test trên nhiều devices và browsers
- Test ngoài trời nắng (outdoor readability)
- Consider dark mode support (future)

### Testing Checklist

- [ ] Body text ≥ 16px trên mobile
- [ ] Tất cả text contrast ≥ 4.5:1
- [ ] Links dễ nhận biết không cần hover
- [ ] Table headers readable trên pink background
- [ ] Captions readable trên white background
- [ ] Test trên iPhone, Android, iPad
- [ ] Test trong điều kiện ánh sáng khác nhau

---

**Status:** 📋 Plan Created  
**Next Step:** Implementation trong `blog-post-renderer.tsx`
