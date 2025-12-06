# 🔍 WordPress Toolbar QA Audit Report

**Date:** December 2025  
**Feature:** WordPress-Style Toolbar trong Tiptap Editor  
**Status:** ⚠️ Multiple Issues Found

---

## 📋 Executive Summary

Phân tích code toolbar đã phát hiện **6 lỗi logic nghiêm trọng** và **8 vấn đề UX** cần được sửa.

**File Analyzed:**

- `src/components/admin/WordPressToolbar.tsx`

---

## 🚨 Bug Report

### 1. Text Formatting (Bold, Italic, Underline, Strike)

#### ✅ **Status: GOOD**

- **Logic Toggle:** Đúng, tất cả đều dùng `toggleMark` (toggleBold, toggleItalic, toggleUnderline, toggleStrike)
- **Active State:** Có check `editor.isActive()` để highlight nút
- **Edge Case:** Tiptap tự động xử lý mixed formatting - khi selection có cả bold và không bold, `toggleBold()` sẽ bold tất cả

**No Issues Found** ✅

---

### 2. Node Structuring (Headings & Lists)

#### ❌ **Bug 2.1: Heading Dropdown - Logic toggle không nhất quán**

**Location:** `WordPressToolbar.tsx:239-260`

**Problem:**

```typescript
<select
  value={
    editor.isActive('heading', { level: 1 })
      ? 'h1'
      : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'paragraph'
  }
  onChange={(e) => {
    const value = e.target.value;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (value === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run(); // ❌ SAI!
    }
  }}
>
```

**Issues:**

- Khi đang ở H2 và chọn H2 lại từ dropdown, `toggleHeading({ level: 2 })` sẽ toggle về paragraph
- Nhưng giá trị dropdown vẫn hiển thị "h2", gây confusing
- Logic không nhất quán: "paragraph" dùng `setParagraph()` nhưng H1/H2/H3 dùng `toggleHeading()`

**Expected Behavior:**

```typescript
// Nếu đã active heading đó rồi thì set về paragraph
if (value === 'h1') {
  if (editor.isActive('heading', { level: 1 })) {
    editor.chain().focus().setParagraph().run();
  } else {
    editor.chain().focus().setHeading({ level: 1 }).run(); // Dùng setHeading, không toggle
  }
}
```

**Impact:** ⚠️ Medium - Confusing UX

---

#### ❌ **Bug 2.2: List Switching - Không chuyển đổi giữa Bullet và Ordered**

**Location:** `WordPressToolbar.tsx:332-343`

**Problem:**

- Khi đang ở Bullet List, bấm Ordered List → Tạo nested list hoặc không hoạt động đúng
- Không có logic để chuyển đổi giữa 2 loại list

**Expected Behavior:**

```typescript
// Khi đang ở Bullet List và bấm Ordered List
if (editor.isActive('bulletList')) {
  editor.chain().focus().toggleBulletList().toggleOrderedList().run();
} else {
  editor.chain().focus().toggleOrderedList().run();
}
```

**Impact:** ⚠️ Medium - Cannot switch list types

---

#### ❌ **Bug 2.3: Heading trong List - Conflict không được xử lý**

**Location:** `WordPressToolbar.tsx:239-260`

**Problem:**

- Khi cursor đang ở trong List Item, bấm Heading (H1, H2, H3)
- Tiptap sẽ fail hoặc không hoạt động vì Heading và ListItem không tương thích

**Expected Behavior:**

- Thoát khỏi List trước khi set Heading:

```typescript
if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
  editor.chain().focus().liftListItem('listItem').setHeading({ level: 1 }).run();
}
```

**Impact:** ⚠️ Medium - Feature doesn't work in lists

---

#### ❌ **Bug 2.4: Missing List Indentation Controls**

**Location:** `WordPressToolbar.tsx:332-343`

**Problem:**

- Không có nút Indent/Outdent để thụt lề List Items
- User không thể tạo nested lists

**Expected Behavior:**

- Thêm nút Indent (sinkListItem) và Outdent (liftListItem)

**Impact:** ⚠️ Low - Missing feature

---

### 3. Alignment (Left, Center, Right)

#### ❌ **Bug 3.1: Alignment không toggle về default**

**Location:** `WordPressToolbar.tsx:356-373`

**Problem:**

```typescript
onClick={() => editor.chain().focus().setTextAlign('left').run()}
```

**Issues:**

- Khi đang ở "center" và bấm "center" lại, nó vẫn set center (không toggle về left/default)
- User không thể "tắt" alignment để về mặc định

**Expected Behavior:**

```typescript
onClick={() => {
  if (editor.isActive({ textAlign: 'left' })) {
    editor.chain().focus().unsetTextAlign().run(); // Hoặc set về 'left' mặc định
  } else {
    editor.chain().focus().setTextAlign('left').run();
  }
}}
```

**Impact:** ⚠️ Medium - Cannot reset alignment

---

#### ⚠️ **Warning 3.2: TextAlign chỉ hoạt động với Heading/Paragraph**

**Location:** `PostEditorModern.tsx:196-199` (TextAlign config)

**Problem:**

```typescript
TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right'],
});
```

- TextAlign không hỗ trợ Image (chỉ hỗ trợ heading, paragraph)
- Image alignment phải dùng CustomImage extension với attribute `align`

**Impact:** ⚠️ Low - Feature limitation (not a bug, but documentation needed)

---

#### ❌ **Bug 3.3: Missing Justify Alignment**

**Location:** `WordPressToolbar.tsx:356-373`

**Problem:**

- Chỉ có Left, Center, Right
- Thiếu Justify alignment

**Impact:** ⚠️ Low - Missing feature

---

### 4. Typography (Font Family, Font Size)

#### ❌ **Bug 4.1: Font Dropdown không hiển thị giá trị hiện tại**

**Location:** `WordPressToolbar.tsx:269-290, 292-315`

**Problem:**

```typescript
<select
  onChange={(e) => {
    if (e.target.value === 'default') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(e.target.value).run();
    }
  }}
  // ❌ KHÔNG CÓ value prop!
>
```

**Issues:**

- Dropdown luôn hiển thị option đầu tiên ("Font mặc định") ngay cả khi đang dùng Arial
- User không biết font hiện tại là gì

**Expected Behavior:**

```typescript
<select
  value={editor.getAttributes('textStyle').fontFamily || 'default'}
  onChange={...}
>
```

**Impact:** 🔴 High - Poor UX, user cannot see current font

---

#### ⚠️ **Warning 4.2: Font persistence**

**Status:** Behavior depends on Tiptap's mark system

- Font Family/Size là Marks, sẽ persist khi xuống dòng mới nếu mark vẫn active
- Đây là behavior đúng của Tiptap, không phải bug

**Impact:** ✅ Expected behavior

---

### 5. Clear Formatting (Tẩy định dạng)

#### ❌ **Bug 5.1: Clear Formatting quá mạnh - Xóa cả Heading/List**

**Location:** `WordPressToolbar.tsx:660-664`

**Problem:**

```typescript
onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
```

**Issues:**

- `clearNodes()` xóa Heading → chuyển về Paragraph (có thể OK)
- `clearNodes()` xóa List → chuyển về Paragraph (có thể không mong muốn)
- `unsetAllMarks()` xóa tất cả: Bold, Italic, Color, Font, Link, v.v. (OK)

**Expected Behavior:**

- Nên chỉ xóa Marks (Bold, Italic, Color, Font) nhưng giữ Node structure (Heading, List)
- Hoặc có 2 nút: "Xóa định dạng" (chỉ marks) và "Xóa tất cả" (marks + nodes)

**Impact:** ⚠️ Medium - Too aggressive, may remove desired structure

---

#### ❌ **Bug 5.2: Clear Formatting không xóa Highlight**

**Location:** `WordPressToolbar.tsx:660-664`

**Problem:**

- `unsetAllMarks()` có thể không xóa Highlight vì Highlight là mark riêng
- Cần thêm `unsetHighlight()` riêng

**Expected Behavior:**

```typescript
onClick={() => {
  editor.chain().focus()
    .unsetAllMarks()
    .unsetHighlight()
    .unsetColor()
    .run();
}}
```

**Impact:** ⚠️ Low - Minor issue

---

### 6. History (Undo/Redo)

#### ✅ **Status: GOOD**

- **Disabled State:** Có check `disabled={!editor.can().undo()}` và `disabled={!editor.can().redo()}`
- **Logic:** Đúng, dùng `undo()` và `redo()`

**No Issues Found** ✅

---

## ⚠️ UX Warnings

### 1. Missing Indent/Outdent Buttons

- Không có nút để thụt lề List Items
- User không thể tạo nested lists từ UI

### 2. Missing Justify Alignment

- Chỉ có Left, Center, Right
- Thiếu Justify (căn đều 2 bên)

### 3. Font Dropdown không show current value

- User không biết font hiện tại
- Đã được báo cáo ở Bug 4.1

### 4. Font Size Dropdown không show current value

- User không biết cỡ chữ hiện tại
- Đã được báo cáo ở Bug 4.1

### 5. Tooltip thiếu thông tin

- Các tooltip chỉ có tên chức năng, thiếu phím tắt (trừ một số nút)

### 6. Color Picker không hiển thị màu hiện tại

- Không có indicator để biết text đang dùng màu gì

### 7. Highlight chỉ có màu vàng cố định

- Không có option để chọn màu highlight khác
- Code: `toggleHighlight({ color: '#ffff00' })` - hardcoded yellow

### 8. YouTube Video - Dùng window.prompt (UX kém)

- Dòng 210: `const url = prompt('Nhập YouTube URL:');`
- Nên dùng Modal giống Link/Image

---

## ✅ Code Fixes

### Fix 1: Heading Dropdown - Logic nhất quán

```typescript
// Replace lines 239-267
<select
  value={
    editor.isActive('heading', { level: 1 })
      ? 'h1'
      : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'paragraph'
  }
  onChange={(e) => {
    const value = e.target.value;

    // Exit list if in list
    if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
      editor.chain().focus().liftListItem('listItem').run();
    }

    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace('h', '')) as 1 | 2 | 3;
      // Use setHeading instead of toggleHeading for consistent behavior
      if (editor.isActive('heading', { level })) {
        // If already this heading, toggle to paragraph
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().setHeading({ level }).run();
      }
    }
  }}
  className="px-3 py-1.5 border border-gray-300 rounded text-sm mr-2 bg-white"
>
  <option value="paragraph">Đoạn văn</option>
  <option value="h1">Heading 1</option>
  <option value="h2">Heading 2</option>
  <option value="h3">Heading 3</option>
</select>
```

### Fix 2: List Switching Logic

```typescript
// Replace lines 332-343
<ToolbarButton
  icon={List}
  onClick={() => {
    if (editor.isActive('orderedList')) {
      // Switch from ordered to bullet
      editor.chain().focus().toggleOrderedList().toggleBulletList().run();
    } else {
      editor.chain().focus().toggleBulletList().run();
    }
  }}
  isActive={editor.isActive('bulletList')}
  title="Danh sách dấu đầu dòng"
/>
<ToolbarButton
  icon={ListOrdered}
  onClick={() => {
    if (editor.isActive('bulletList')) {
      // Switch from bullet to ordered
      editor.chain().focus().toggleBulletList().toggleOrderedList().run();
    } else {
      editor.chain().focus().toggleOrderedList().run();
    }
  }}
  isActive={editor.isActive('orderedList')}
  title="Danh sách đánh số"
/>
```

### Fix 3: Alignment Toggle

```typescript
// Replace lines 356-373
<ToolbarButton
  icon={AlignLeft}
  onClick={() => {
    if (editor.isActive({ textAlign: 'left' })) {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      editor.chain().focus().setTextAlign('left').run();
    }
  }}
  isActive={editor.isActive({ textAlign: 'left' })}
  title="Căn trái"
/>
<ToolbarButton
  icon={AlignCenter}
  onClick={() => {
    if (editor.isActive({ textAlign: 'center' })) {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      editor.chain().focus().setTextAlign('center').run();
    }
  }}
  isActive={editor.isActive({ textAlign: 'center' })}
  title="Căn giữa"
/>
<ToolbarButton
  icon={AlignRight}
  onClick={() => {
    if (editor.isActive({ textAlign: 'right' })) {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      editor.chain().focus().setTextAlign('right').run();
    }
  }}
  isActive={editor.isActive({ textAlign: 'right' })}
  title="Căn phải"
/>
```

### Fix 4: Font Family Dropdown - Show Current Value

```typescript
// Replace lines 269-290
<select
  value={editor.getAttributes('textStyle').fontFamily || 'default'}
  onChange={(e) => {
    if (e.target.value === 'default') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(e.target.value).run();
    }
  }}
  className="px-3 py-1.5 border border-gray-300 rounded text-sm mr-2 bg-white"
  title="Font chữ"
>
  <option value="default">Font mặc định</option>
  <option value="Arial, sans-serif">Arial</option>
  <option value="'Times New Roman', serif">Times New Roman</option>
  <option value="'Courier New', monospace">Courier New</option>
  <option value="Georgia, serif">Georgia</option>
  <option value="Verdana, sans-serif">Verdana</option>
  <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
  <option value="Impact, fantasy">Impact</option>
  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
</select>
```

### Fix 5: Font Size Dropdown - Show Current Value

```typescript
// Replace lines 292-315
<select
  value={editor.getAttributes('textStyle').fontSize || 'default'}
  onChange={(e) => {
    if (e.target.value === 'default') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(e.target.value).run();
    }
  }}
  className="px-3 py-1.5 border border-gray-300 rounded text-sm mr-2 bg-white"
  title="Cỡ chữ"
>
  <option value="default">Cỡ chữ</option>
  <option value="12px">12px</option>
  <option value="14px">14px</option>
  <option value="16px">16px (Mặc định)</option>
  <option value="18px">18px</option>
  <option value="20px">20px</option>
  <option value="24px">24px</option>
  <option value="28px">28px</option>
  <option value="32px">32px</option>
  <option value="36px">36px</option>
  <option value="48px">48px</option>
</select>
```

### Fix 6: Clear Formatting - Less Aggressive

```typescript
// Replace line 662
<ToolbarButton
  icon={Type}
  onClick={() => {
    editor
      .chain()
      .focus()
      .unsetAllMarks() // Removes Bold, Italic, Color, Font, etc.
      .unsetHighlight()
      .unsetColor()
      .unsetFontFamily()
      .unsetFontSize()
      .unsetLink()
      .run();
    // Note: Keep clearNodes() only if you want to remove Heading/List structure
    // Otherwise, remove it to keep structure
  }}
  title="Xóa định dạng (chỉ xóa Bold, Italic, Màu, Font)"
/>
```

### Fix 7: Add List Indent/Outdent Buttons

```typescript
// Add after line 343 (after List buttons)
<ToolbarButton
  icon={Indent} // Need to import from lucide-react or use custom icon
  onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
  disabled={!editor.can().sinkListItem('listItem')}
  title="Thụt lề (Indent)"
/>
<ToolbarButton
  icon={Outdent} // Need to import or use custom
  onClick={() => editor.chain().focus().liftListItem('listItem').run()}
  disabled={!editor.can().liftListItem('listItem')}
  title="Giảm thụt lề (Outdent)"
/>
```

### Fix 8: Add Justify Alignment

```typescript
// Import AlignJustify from lucide-react
import { AlignJustify } from 'lucide-react';

// Add after AlignRight button (after line 373)
<ToolbarButton
  icon={AlignJustify}
  onClick={() => {
    if (editor.isActive({ textAlign: 'justify' })) {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      editor.chain().focus().setTextAlign('justify').run();
    }
  }}
  isActive={editor.isActive({ textAlign: 'justify' })}
  title="Căn đều (Justify)"
/>;
```

**Note:** Cần update TextAlign config để hỗ trợ 'justify':

```typescript
TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right', 'justify'], // Add 'justify'
});
```

---

## 📊 Test Cases Coverage

| Test Case                  | Status  | Notes                                |
| -------------------------- | ------- | ------------------------------------ |
| 1.1 Text Formatting Toggle | ✅ Pass | All use toggleMark correctly         |
| 1.2 Active State           | ✅ Pass | All buttons show active state        |
| 1.3 Mixed Formatting       | ✅ Pass | Tiptap handles correctly             |
| 2.1 Heading Toggle         | ❌ Fail | Bug 2.1 - toggleHeading inconsistent |
| 2.2 List Switching         | ❌ Fail | Bug 2.2 - Cannot switch types        |
| 2.3 Heading in List        | ❌ Fail | Bug 2.3 - Conflict not handled       |
| 2.4 List Indentation       | ❌ Fail | Bug 2.4 - Missing buttons            |
| 3.1 Alignment Toggle       | ❌ Fail | Bug 3.1 - Cannot reset               |
| 3.2 Image Alignment        | ⚠️ N/A  | Not supported (limitation)           |
| 3.3 Justify                | ❌ Fail | Bug 3.3 - Missing                    |
| 4.1 Font Current Value     | ❌ Fail | Bug 4.1 - Dropdown doesn't show      |
| 4.2 Font Persistence       | ✅ Pass | Expected behavior                    |
| 5.1 Clear Formatting       | ❌ Fail | Bug 5.1 - Too aggressive             |
| 5.2 Clear Highlight        | ❌ Fail | Bug 5.2 - Doesn't clear highlight    |
| 6.1 Undo/Redo              | ✅ Pass | Correct disabled state               |

---

## 🎯 Recommendations

### Immediate (Critical)

1. Fix Bug 4.1: Font dropdown không show current value (High UX impact)
2. Fix Bug 2.1: Heading dropdown logic không nhất quán

### High Priority

3. Fix Bug 2.2: List switching logic
4. Fix Bug 3.1: Alignment toggle
5. Fix Bug 5.1: Clear formatting quá mạnh

### Medium Priority

6. Fix Bug 2.3: Heading trong List conflict
7. Add Fix 7: List Indent/Outdent buttons
8. Add Fix 8: Justify alignment

### Low Priority (Nice to Have)

9. Improve YouTube video input (use Modal instead of prompt)
10. Add current color indicator
11. Add highlight color picker (not just yellow)

---

**Report Generated:** December 2025  
**Reviewed By:** AI QA Automation Engineer
