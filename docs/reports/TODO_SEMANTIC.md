# 🎯 TODO: Semantic HTML Refactoring

**Ngày tạo:** 04/12/2025  
**Mục tiêu:** Thay thế các `<div>` không có ý nghĩa ngữ nghĩa bằng thẻ semantic HTML  
**Scope:** 20 components chính trong `/src/components/admin`  
**Trạng thái:** Pending - Chưa thực hiện

---

## 📋 TẠI SAO CẦN SEMANTIC HTML?

### Lợi ích:
1. ✅ **SEO:** Search engines hiểu structure tốt hơn
2. ✅ **Accessibility:** Screen readers đọc content chính xác hơn
3. ✅ **Maintainability:** Code dễ đọc, dễ hiểu hơn
4. ✅ **Standards:** Follow HTML5 best practices

### Semantic Tags:
- `<header>` - Page/section headers, navigation
- `<nav>` - Navigation menus
- `<main>` - Main content area
- `<section>` - Thematic grouping of content
- `<article>` - Self-contained content (blog posts, products)
- `<aside>` - Sidebar content
- `<footer>` - Footer content
- `<figure>` + `<figcaption>` - Images with captions

---

## 🔍 RÀ SOÁT 20 COMPONENTS CHÍNH

### 1. ⭐ EditorLayout.tsx
**File:** `src/components/admin/EditorLayout.tsx`  
**Priority:** 🔴 HIGH (Used by all editors)

#### Changes needed:
```typescript
// Line 29 - ❌ TRƯỚC
<div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
  {/* Header */}
  <div className="flex items-start justify-between">

// ✅ SAU
<header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
  <div className="flex items-start justify-between">
```

```typescript
// Line 53 - ❌ TRƯỚC
<div className="max-w-screen-2xl mx-auto p-4 md:p-6 pb-20 lg:pb-6">
  <div className={`flex flex-col lg:flex-row gap-4 md:gap-6`}>
    {/* Main Content Area (75%) */}
    <div className={...}>

// ✅ SAU
<main className="max-w-screen-2xl mx-auto p-4 md:p-6 pb-20 lg:pb-6">
  <div className={`flex flex-col lg:flex-row gap-4 md:gap-6`}>
    {/* Main Content Area (75%) */}
    <section className={...}>
```

```typescript
// Line 62 - ❌ TRƯỚC
{!isFullscreen && (
  <aside className="hidden lg:block lg:w-1/4 lg:max-w-sm">  // ✅ này đã đúng

// Line 73 - ❌ TRƯỚC
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white...">

// ✅ SAU
<footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white...">
```

**Estimated Impact:** 4 divs → semantic tags  
**Files affected:** All editor components (PostEditorV3, ProductFormV3, etc.)

---

### 2. ⭐ AdminSidebarV2.tsx
**File:** `src/components/admin/AdminSidebarV2.tsx`  
**Priority:** 🔴 HIGH (Main navigation)

#### Changes needed:
```typescript
// Line 76 - ❌ TRƯỚC
{/* Header */}
<div className="p-6 border-b border-gray-700">

// ✅ SAU
<header className="p-6 border-b border-gray-700">
```

```typescript
// Line 91 - ✅ ĐÃ ĐÚNG
<nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
  {/* Already using <nav> ✅ */}
```

```typescript
// Line ~112 (Footer section - need to check)
<div className="border-t border-gray-700 p-4">  // User info & logout
  
// ✅ SAU
<footer className="border-t border-gray-700 p-4">
```

**Estimated Impact:** 2 divs → semantic tags  
**Note:** Navigation đã dùng `<nav>` ✅

---

### 3. MediaLibrary.tsx
**File:** `src/components/admin/MediaLibrary.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Modal dialog structure - mostly semantic already (using Dialog components)
// Potential improvements in filter bar:

// Line ~150 - Filter bar
<div className="flex items-center gap-2 mb-4">  // Filter controls
  
// ✅ SAU
<section className="flex items-center gap-2 mb-4" aria-label="Media filters">
```

**Estimated Impact:** 2-3 divs → sections  
**Note:** Dialog components đã semantic ✅

---

### 4. PostEditorV3.tsx
**File:** `src/components/admin/PostEditorV3.tsx`  
**Priority:** 🟡 MEDIUM (Uses EditorLayout)

#### Changes needed:
```typescript
// Line 256 - Main content wrapper
<div className="space-y-4">  // mainContent variable
  
// ✅ SAU
<section className="space-y-4">
```

```typescript
// Line 509 - Auto-save indicator (notification-like)
<div className="fixed bottom-4 left-4 z-50 bg-green-100...">
  <Check className="h-4 w-4" />
  Đã lưu lúc...
</div>

// ✅ SAU
<aside className="fixed bottom-4 left-4 z-50 bg-green-100..." role="status" aria-live="polite">
  <Check className="h-4 w-4" />
  Đã lưu lúc...
</aside>
```

```typescript
// Line 517 - Draft restoration modal
<div className="fixed inset-0 bg-black bg-opacity-50...">  // Modal backdrop
  <div className="bg-white rounded-lg...">  // Modal content
  
// ✅ SAU - Keep as div (modal overlay không cần semantic)
// Nhưng có thể thêm role="dialog"
```

**Estimated Impact:** 2 divs → semantic tags

---

### 5. ProductFormV3.tsx
**File:** `src/components/admin/ProductFormV3.tsx`  
**Priority:** 🟡 MEDIUM (Uses EditorLayout)

#### Changes needed:
```typescript
// Line ~150 - Main content wrapper
<div className="space-y-4">  // mainContent variable
  
// ✅ SAU
<section className="space-y-4">
```

```typescript
// Line ~415 - Mobile actions
<div className="flex gap-2">  // mobileActions variable
  
// ✅ SAU (có thể keep div - chỉ là button group)
<div className="flex gap-2" role="group" aria-label="Form actions">
```

**Estimated Impact:** 1-2 divs → semantic tags

---

### 6. CategoryManager.tsx
**File:** `src/components/admin/CategoryManager.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Line 44 - Container
<div className="space-y-6">
  
// ✅ SAU
<section className="space-y-6">
```

```typescript
// Line 45 - Title and action bar
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold">Danh mục sản phẩm</h3>
    
// ✅ SAU
<header className="flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold">Danh mục sản phẩm</h3>
```

```typescript
// Line 59 - Active categories section
<div>
  <h4 className="text-sm font-medium">Danh mục đang hoạt động</h4>
  <div className="space-y-2">
  
// ✅ SAU
<section aria-labelledby="active-categories">
  <h4 id="active-categories" className="text-sm font-medium">Danh mục đang hoạt động</h4>
  <div className="space-y-2">
```

**Estimated Impact:** 3-4 divs → semantic tags

---

### 7. UserManager.tsx
**File:** `src/components/admin/UserManager.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Line 48 - Container
<div className="space-y-6">
  
// ✅ SAU
<section className="space-y-6" aria-labelledby="user-manager-title">
```

```typescript
// Line 49 - Header
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold">Quản lý người dùng</h3>
    
// ✅ SAU
<header className="flex items-center justify-between">
  <div>
    <h3 id="user-manager-title" className="text-lg font-semibold">Quản lý người dùng</h3>
```

```typescript
// Line 63 - User list
<div className="space-y-3">
  {users.map((user) => (
  
// ✅ SAU
<section className="space-y-3" role="list" aria-label="User list">
  {users.map((user) => (
```

**Estimated Impact:** 3 divs → semantic tags

---

### 8. HomepageEditor.tsx
**File:** `src/components/admin/homepage/HomepageEditor.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Main container - mostly uses Card and Tabs components (already semantic)
// Potential improvements:

// Content sections within tabs
<div className="space-y-4">
  
// ✅ SAU
<section className="space-y-4">
```

**Estimated Impact:** 2-3 divs → sections

---

### 9. HomepageConfigTable.tsx
**File:** `src/components/admin/homepage/HomepageConfigTable.tsx`  
**Priority:** 🟢 LOW (Uses Table component - already semantic)

#### Changes needed:
```typescript
// Mostly uses semantic Table components ✅
// Minor improvements possible in loading/empty states
```

**Estimated Impact:** Minimal (already good)

---

### 10. WordPressToolbar.tsx
**File:** `src/components/admin/WordPressToolbar.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Line 158 - Toolbar container
<div className={`bg-white border border-gray-300 rounded-t-lg`}>
  
// ✅ SAU
<nav className={`bg-white border border-gray-300 rounded-t-lg`} role="toolbar" aria-label="Rich text editor toolbar">
```

```typescript
// Line 160 - Action buttons row
<div className="flex items-center gap-2 px-4 py-2 border-b">
  
// ✅ SAU
<section className="flex items-center gap-2 px-4 py-2 border-b" aria-label="Media actions">
```

```typescript
// Line 174 - Formatting row
<div className="flex items-center gap-0.5 px-2 py-2 border-b">
  
// ✅ SAU
<section className="flex items-center gap-0.5 px-2 py-2 border-b" aria-label="Text formatting">
```

**Estimated Impact:** 3-5 divs → nav/sections

---

### 11. MediaLibrary Dialog Content
**File:** `src/components/admin/MediaLibrary.tsx`  
**Priority:** 🟢 LOW (Already uses Dialog components)

#### Changes needed:
- Dialog components đã semantic ✅
- Minor improvements possible in grid layout

**Estimated Impact:** 1-2 divs → sections

---

### 12. AnalyticsDashboard.tsx
**File:** `src/components/admin/seo/AnalyticsDashboard.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Dashboard grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  
// ✅ SAU
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Analytics metrics">
```

**Estimated Impact:** 3-4 divs → sections

---

### 13. ReportGenerator.tsx
**File:** `src/components/admin/seo/ReportGenerator.tsx`  
**Priority:** 🟢 LOW (Mostly uses Card components)

#### Changes needed:
- Card structure is already semantic ✅
- Form elements could use `<form>` tag instead of div wrapper

**Estimated Impact:** 1-2 improvements

---

### 14. PostEditorModern.tsx
**File:** `src/components/admin/PostEditorModern.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Line 423 - 2-column layout
<div className={`grid ${isFullscreen ? 'grid-cols-1' : 'lg:grid-cols-[1fr_360px]'} gap-6`}>
  <div className="space-y-4">  // LEFT COLUMN
  
// ✅ SAU
<div className={`grid...`}>
  <section className="space-y-4" aria-label="Main content">
```

```typescript
// Line 455 - Toolbar
<div ref={toolbarRef} className="relative">
  
// ✅ SAU
<nav ref={toolbarRef} className="relative" role="toolbar" aria-label="Editor toolbar">
```

**Estimated Impact:** 3-4 divs → semantic tags

---

### 15. sidebar/PublishBox.tsx
**File:** `src/components/admin/sidebar/PublishBox.tsx`  
**Priority:** 🟢 LOW (Uses Card - already semantic)

#### Changes needed:
- Card structure is good ✅
- Keep as is

**Estimated Impact:** None (already optimal)

---

### 16. sidebar/CategoryBox.tsx, TagBox.tsx, etc.
**File:** `src/components/admin/sidebar/*Box.tsx`  
**Priority:** 🟢 LOW (Use Card components)

#### Changes needed:
- All sidebar boxes use Card components ✅
- Already semantic enough

**Estimated Impact:** None (already optimal)

---

### 17. homepage/ABTestingPanel.tsx
**File:** `src/components/admin/homepage/ABTestingPanel.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Panel structure
<div className="space-y-4">  // Main container
  
// ✅ SAU
<section className="space-y-4" aria-label="A/B Testing">
```

**Estimated Impact:** 2-3 divs → sections

---

### 18. homepage/VersionHistory.tsx
**File:** `src/components/admin/homepage/VersionHistory.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Version list container
<div className="space-y-3">
  {versions.map((version) => (
  
// ✅ SAU
<section className="space-y-3" role="list" aria-label="Version history">
  {versions.map((version) => (
```

**Estimated Impact:** 2 divs → sections

---

### 19. seo/AIGenerator.tsx
**File:** `src/components/admin/seo/AIGenerator.tsx`  
**Priority:** 🟢 LOW (Uses Card components)

#### Changes needed:
- Card structure is semantic ✅
- Minor improvements possible

**Estimated Impact:** 1-2 divs → sections

---

### 20. comments/CommentItem.tsx
**File:** `src/components/admin/comments/CommentItem.tsx`  
**Priority:** 🟡 MEDIUM

#### Changes needed:
```typescript
// Comment wrapper
<div className="border rounded-lg p-4">
  
// ✅ SAU
<article className="border rounded-lg p-4">
```

**Estimated Impact:** 1 div → article per comment

---

## 📊 TỔNG KẾT RÀ SOÁT

| Component | Priority | Divs to Replace | Effort | Impact |
|-----------|----------|-----------------|--------|---------|
| 1. EditorLayout.tsx | 🔴 HIGH | 4 | Medium | ⭐⭐⭐⭐⭐ |
| 2. AdminSidebarV2.tsx | 🔴 HIGH | 2 | Low | ⭐⭐⭐⭐ |
| 3. MediaLibrary.tsx | 🟡 MEDIUM | 2-3 | Low | ⭐⭐⭐ |
| 4. PostEditorV3.tsx | 🟡 MEDIUM | 2 | Low | ⭐⭐⭐ |
| 5. ProductFormV3.tsx | 🟡 MEDIUM | 1-2 | Low | ⭐⭐⭐ |
| 6. CategoryManager.tsx | 🟡 MEDIUM | 3-4 | Medium | ⭐⭐⭐ |
| 7. UserManager.tsx | 🟡 MEDIUM | 3 | Low | ⭐⭐⭐ |
| 8. HomepageEditor.tsx | 🟡 MEDIUM | 2-3 | Low | ⭐⭐ |
| 9. HomepageConfigTable.tsx | 🟢 LOW | 0 | None | ⭐ |
| 10. WordPressToolbar.tsx | 🟡 MEDIUM | 3-5 | Medium | ⭐⭐⭐ |
| 11. AnalyticsDashboard.tsx | 🟡 MEDIUM | 3-4 | Low | ⭐⭐ |
| 12. ReportGenerator.tsx | 🟢 LOW | 1-2 | Low | ⭐⭐ |
| 13. PostEditorModern.tsx | 🟡 MEDIUM | 3-4 | Medium | ⭐⭐⭐ |
| 14. sidebar/PublishBox.tsx | 🟢 LOW | 0 | None | ⭐ |
| 15. sidebar/*Box.tsx (5 files) | 🟢 LOW | 0 | None | ⭐ |
| 16. ABTestingPanel.tsx | 🟡 MEDIUM | 2-3 | Low | ⭐⭐ |
| 17. VersionHistory.tsx | 🟡 MEDIUM | 2 | Low | ⭐⭐ |
| 18. AIGenerator.tsx | 🟢 LOW | 1-2 | Low | ⭐⭐ |
| 19. CommentItem.tsx | 🟡 MEDIUM | 1+ | Low | ⭐⭐⭐ |
| 20. QuickEditModal.tsx | 🟢 LOW | 1 | Low | ⭐ |

**Total Estimated:** ~40-50 divs có thể thay bằng semantic tags

---

## 🎯 PHÂN LOẠI THEO THẺ SEMANTIC

### `<header>` - Headers (7-8 cases)
1. EditorLayout.tsx - Page header
2. AdminSidebarV2.tsx - Sidebar header
3. CategoryManager.tsx - Section header
4. UserManager.tsx - Section header
5. MediaLibrary.tsx - Dialog header
6. các Manager components khác

### `<nav>` - Navigation (3-4 cases)
1. AdminSidebarV2.tsx - ✅ Đã dùng
2. WordPressToolbar.tsx - Editor toolbar
3. Breadcrumb sections (if any)

### `<main>` - Main content (2 cases)
1. EditorLayout.tsx - Main content wrapper
2. Dashboard pages (if not using EditorLayout)

### `<section>` - Content sections (20-25 cases)
1. EditorLayout.tsx - Main content area
2. PostEditorV3.tsx - Form content
3. ProductFormV3.tsx - Form content
4. CategoryManager.tsx - Category groups
5. UserManager.tsx - User list
6. AnalyticsDashboard.tsx - Metric grids
7. All list/grid wrappers

### `<aside>` - Sidebars & notifications (3-5 cases)
1. EditorLayout.tsx - ✅ Đã dùng cho desktop sidebar
2. PostEditorV3.tsx - Auto-save indicator
3. Floating notifications

### `<footer>` - Footers (2-3 cases)
1. EditorLayout.tsx - Mobile actions bar
2. AdminSidebarV2.tsx - User info section
3. Modal footers (if any)

### `<article>` - Self-contained content (3-5 cases)
1. CommentItem.tsx - Individual comments
2. Product cards in grids
3. Post cards in lists

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: High Priority (Week 1)
**Mục tiêu:** Fix các components có impact cao nhất

1. ✅ **EditorLayout.tsx** (4 changes)
   - Replace header div → `<header>`
   - Replace main content div → `<main>`
   - Replace content area div → `<section>`
   - Replace mobile actions → `<footer>`

2. ✅ **AdminSidebarV2.tsx** (2 changes)
   - Replace header div → `<header>`
   - Replace footer div → `<footer>`

3. ✅ **WordPressToolbar.tsx** (3 changes)
   - Replace toolbar div → `<nav role="toolbar">`
   - Replace button groups → `<section>`

**Expected result:** ~9 divs fixed, affects most admin pages

---

### Phase 2: Medium Priority (Week 2)
**Mục tiêu:** Fix content management components

4. ✅ **CategoryManager.tsx** (3 changes)
5. ✅ **UserManager.tsx** (3 changes)
6. ✅ **PostEditorV3.tsx** (2 changes)
7. ✅ **ProductFormV3.tsx** (2 changes)
8. ✅ **PostEditorModern.tsx** (3 changes)
9. ✅ **MediaLibrary.tsx** (2 changes)

**Expected result:** ~15 divs fixed

---

### Phase 3: Low Priority (Week 3)
**Mục tiêu:** Polish remaining components

10. ✅ **AnalyticsDashboard.tsx** (3 changes)
11. ✅ **ABTestingPanel.tsx** (2 changes)
12. ✅ **VersionHistory.tsx** (2 changes)
13. ✅ **HomepageEditor.tsx** (2 changes)
14. ✅ **CommentItem.tsx** (1 change)
15. ✅ **Other minor components** (5 changes)

**Expected result:** ~15 divs fixed

---

## ✅ BEST PRACTICES

### 1. Khi nào dùng `<header>`?
✅ **Dùng khi:**
- Chứa page title, subtitle, breadcrumb
- Chứa navigation và logo
- Section heading với actions (Create, Edit buttons)

❌ **KHÔNG dùng khi:**
- Chỉ là heading text không có context
- Wrapper div cho layout (dùng div hoặc section thay thế)

---

### 2. Khi nào dùng `<nav>`?
✅ **Dùng khi:**
- Menu navigation (sidebar, topbar)
- Breadcrumbs
- Toolbar với nhiều actions
- Pagination controls

❌ **KHÔNG dùng khi:**
- Button group đơn giản (Save, Cancel)
- Tabs (dùng Tabs component)

---

### 3. Khi nào dùng `<main>`?
✅ **Dùng khi:**
- Primary content area của page
- Chỉ nên có 1 `<main>` per page
- Không nằm trong `<aside>` hoặc `<footer>`

❌ **KHÔNG dùng khi:**
- Nested content sections (dùng `<section>`)
- Sidebar content (dùng `<aside>`)

---

### 4. Khi nào dùng `<section>`?
✅ **Dùng khi:**
- Thematic grouping of content
- Content có heading riêng
- Grid/list wrappers với heading
- Form field groups

❌ **KHÔNG dùng khi:**
- Pure layout wrapper (dùng div)
- Single element wrapper (dùng div)
- Generic container (dùng div)

---

### 5. Khi nào dùng `<article>`?
✅ **Dùng khi:**
- Independent, self-contained content
- Blog posts, comments, product cards
- Có thể tái sử dụng độc lập

❌ **KHÔNG dùng khi:**
- Content phụ thuộc parent context
- Form sections

---

### 6. Khi nào dùng `<aside>`?
✅ **Dùng khi:**
- Sidebar content
- Related information
- Complementary content
- Notifications, alerts (floating)

❌ **KHÔNG dùng khi:**
- Main navigation (dùng `<nav>`)
- Primary content (dùng `<main>` hoặc `<section>`)

---

### 7. Khi nào dùng `<footer>`?
✅ **Dùng khi:**
- Page footer
- Section footer
- Modal footer với actions
- Fixed bottom bar với actions

❌ **KHÔNG dùng khi:**
- Random bottom element không có semantic meaning

---

## 🚀 QUICK WINS (Có thể làm ngay)

### Easiest Changes (< 5 phút mỗi file):

1. **EditorLayout.tsx**
   ```diff
   - <div className="bg-white border-b...">
   + <header className="bg-white border-b...">
   ```
   **Impact:** Affects all 10+ editor pages ⭐⭐⭐⭐⭐

2. **AdminSidebarV2.tsx**
   ```diff
   - <div className="p-6 border-b border-gray-700">
   + <header className="p-6 border-b border-gray-700">
   ```
   **Impact:** Main admin navigation ⭐⭐⭐⭐

3. **All Manager components (5 files)**
   ```diff
   - <div className="space-y-6">
   + <section className="space-y-6">
   
   - <div className="flex items-center justify-between">
   + <header className="flex items-center justify-between">
   ```
   **Impact:** Consistency across admin ⭐⭐⭐

---

## 📈 EXPECTED RESULTS

### Before:
```html
<div class="page">
  <div class="header">...</div>
  <div class="main">
    <div class="content">...</div>
    <div class="sidebar">...</div>
  </div>
  <div class="footer">...</div>
</div>
```

### After:
```html
<div class="page">
  <header>...</header>
  <main>
    <section class="content">...</section>
    <aside class="sidebar">...</aside>
  </main>
  <footer>...</footer>
</div>
```

### Benefits:
- ✅ Better SEO score
- ✅ Better accessibility (WCAG compliance)
- ✅ Cleaner code structure
- ✅ Easier to maintain

---

## ⚠️ CAUTIONS

### Khi KHÔNG nên thay `<div>`:

1. **Pure layout wrappers:**
   ```jsx
   <div className="flex gap-2">  // ✅ Keep as div
     <Button>Save</Button>
     <Button>Cancel</Button>
   </div>
   ```

2. **Animation/transition wrappers:**
   ```jsx
   <div className="animate-in fade-in">  // ✅ Keep as div
   ```

3. **Grid/flex containers without semantic meaning:**
   ```jsx
   <div className="grid grid-cols-3 gap-4">  // ✅ Keep as div if no heading
   ```

4. **Dialog overlays:**
   ```jsx
   <div className="fixed inset-0 bg-black opacity-50">  // ✅ Keep as div
   ```

---

## 🧪 TESTING CHECKLIST

Sau khi implement, cần verify:

- [ ] **Visual:** UI không thay đổi (CSS vẫn hoạt động)
- [ ] **Functionality:** All interactions vẫn hoạt động
- [ ] **Accessibility:** Screen reader test
- [ ] **Console:** Không có React warnings
- [ ] **Build:** TypeScript compile thành công
- [ ] **Lighthouse:** SEO score improvement

---

## 📝 NOTES

### Tools để hỗ trợ:
1. **Lighthouse Audit** - Kiểm tra semantic structure
2. **WAVE** - Accessibility testing
3. **axe DevTools** - Accessibility checker
4. **React DevTools** - Component structure

### Resources:
- [MDN: HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements)
- [W3C: Sections](https://www.w3.org/TR/html5/sections.html)
- [WebAIM: Semantic Structure](https://webaim.org/techniques/semanticstructure/)

---

## 🎯 PRIORITY RANKING

### Nếu chỉ có thời gian limited, fix theo thứ tự:

1. **EditorLayout.tsx** - Highest impact, affects 10+ pages
2. **AdminSidebarV2.tsx** - Main navigation, affects all admin pages
3. **WordPressToolbar.tsx** - Editor experience
4. **CategoryManager.tsx + UserManager.tsx** - Consistency
5. **All other components** - Polish

---

## ✅ SUCCESS CRITERIA

Project sẽ được coi là success khi:

- [ ] Top 5 high-priority components đã được refactor
- [ ] Không có regression bugs
- [ ] Lighthouse SEO score cải thiện
- [ ] Code review approved
- [ ] Documentation updated

---

**Status:** 📋 **TODO - Chưa bắt đầu implement**  
**Estimated Time:** 1-2 tuần (nếu làm từng phase)  
**Owner:** TBD  
**Created by:** AI Assistant - QA Pass Session

