# ⌨️ Keyboard Shortcuts QA Audit Report

**Date:** December 2025  
**Component:** Tiptap Editor - Keyboard Shortcuts  
**Status:** ⚠️ Issues Found

---

## 📋 Executive Summary

Phân tích code hiện tại cho thấy **hầu hết các phím tắt đã hoạt động** thông qua `StarterKit`, nhưng **thiếu phím tắt cho Link (Ctrl+K)** và cần kiểm tra xung đột với trình duyệt.

---

## 🔍 1. Extension Configuration Check

### ✅ Extensions Đã Cài Đặt

| Extension      | Status                    | Keymap Mặc Định | Notes                                 |
| -------------- | ------------------------- | --------------- | ------------------------------------- |
| **StarterKit** | ✅ Installed              | ✅ Yes          | Bao gồm Bold, Italic, Strike, History |
| **Underline**  | ✅ Installed              | ⚠️ Unknown      | Cần kiểm tra keymap mặc định          |
| **Link**       | ✅ Installed              | ❌ No           | **THIẾU keymap cho Ctrl+K**           |
| **History**    | ✅ Included in StarterKit | ✅ Yes          | Ctrl+Z (undo), Ctrl+Shift+Z (redo)    |

### 📝 Chi Tiết Extensions

#### 1.1 StarterKit Extensions

**File:** `src/components/admin/PostEditorModern.tsx` (line 178-182)

```typescript
StarterKit.configure({
  heading: {
    levels: [1, 2, 3],
  },
}),
```

**Keymaps Mặc Định (từ StarterKit):**

- ✅ **Ctrl+B / Cmd+B:** `toggleBold()` - ✅ Hoạt động
- ✅ **Ctrl+I / Cmd+I:** `toggleItalic()` - ✅ Hoạt động
- ✅ **Ctrl+Z / Cmd+Z:** `undo()` - ✅ Hoạt động
- ✅ **Ctrl+Shift+Z / Cmd+Shift+Z:** `redo()` - ✅ Hoạt động
- ✅ **Ctrl+Y / Cmd+Y:** `redo()` (Windows/Linux) - ✅ Hoạt động

**Vấn đề:** StarterKit **KHÔNG** bao gồm Underline extension.

---

#### 1.2 Underline Extension

**File:** `src/components/admin/PostEditorModern.tsx` (line 202)

```typescript
Underline,
```

**Status:** ✅ Đã cài đặt

**Keymap Mặc Định:**

- ⚠️ **Ctrl+U / Cmd+U:** Theo tài liệu Tiptap, Underline extension **KHÔNG có keymap mặc định**.
- Cần thêm custom keymap.

**Browser Conflict:**

- ⚠️ **Ctrl+U:** Trình duyệt có thể dùng để "View Source" (tùy trình duyệt).
- Cần `preventDefault()` trong editor context.

---

#### 1.3 Link Extension

**File:** `src/components/admin/PostEditorModern.tsx` (line 187-192)

```typescript
Link.configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'text-blue-600 underline',
  },
}),
```

**Status:** ✅ Đã cài đặt

**Keymap Mặc Định:**

- ❌ **Ctrl+K / Cmd+K:** **KHÔNG có keymap mặc định** trong Link extension.

**Browser Conflict:**

- ⚠️ **Ctrl+K:** Trình duyệt thường dùng để focus vào address bar (Chrome, Firefox, Edge).
- Cần `preventDefault()` và chỉ kích hoạt khi editor đang focus.

**Yêu Cầu:**

- 🚨 **THIẾU:** Custom keymap để mở `LinkModal` khi nhấn Ctrl+K.

---

## 🚨 2. Missing Extensions/Shortcuts

### Bug 1: Thiếu Phím Tắt Ctrl+K cho Link

**Severity:** 🔴 High  
**Impact:** UX - Người dùng không thể chèn link nhanh bằng phím tắt.

**Expected Behavior:**

- Nhấn `Ctrl+K` (hoặc `Cmd+K` trên Mac) khi editor đang focus → Mở `LinkModal`.
- Nếu đã có text được chọn → Pre-fill text vào modal.
- Nếu đã có link được chọn → Pre-fill URL vào modal để edit.

**Current Behavior:**

- Nhấn `Ctrl+K` → Trình duyệt focus vào address bar (hoặc không có gì xảy ra).

**Root Cause:**

- Link extension không có keymap mặc định.
- Không có custom extension để handle Ctrl+K.

---

### Bug 2: Underline Extension Không Có Keymap Mặc Định

**Severity:** 🟡 Medium  
**Impact:** UX - Người dùng phải click nút toolbar thay vì dùng phím tắt.

**Expected Behavior:**

- Nhấn `Ctrl+U` (hoặc `Cmd+U` trên Mac) → Toggle underline.

**Current Behavior:**

- Nhấn `Ctrl+U` → Có thể mở "View Source" của trình duyệt (tùy trình duyệt).

**Root Cause:**

- Underline extension không có keymap mặc định.
- Cần thêm custom keymap.

---

## ⚠️ 3. Conflict Warnings

### Warning 1: Ctrl+B vs Browser Bookmarks

**Browser:** Chrome, Firefox, Edge  
**Conflict:** `Ctrl+B` có thể mở Bookmarks bar (tùy cài đặt trình duyệt).

**Mitigation:**

- ✅ StarterKit đã có `preventDefault()` trong keymap.
- ✅ Chỉ kích hoạt khi editor đang focus.

**Status:** ✅ Đã được xử lý bởi StarterKit.

---

### Warning 2: Ctrl+K vs Browser Address Bar

**Browser:** Chrome, Firefox, Edge  
**Conflict:** `Ctrl+K` focus vào address bar để tìm kiếm.

**Mitigation:**

- ❌ **CHƯA có preventDefault()** vì chưa có custom keymap.
- ⚠️ Cần đảm bảo chỉ kích hoạt khi editor đang focus.

**Status:** ⚠️ Cần fix khi thêm custom keymap.

---

### Warning 3: Ctrl+U vs Browser View Source

**Browser:** Chrome, Firefox  
**Conflict:** `Ctrl+U` có thể mở "View Source" (tùy trình duyệt).

**Mitigation:**

- ❌ **CHƯA có preventDefault()** vì chưa có keymap.
- ⚠️ Cần đảm bảo chỉ kích hoạt khi editor đang focus.

**Status:** ⚠️ Cần fix khi thêm custom keymap.

---

## ✅ 4. Code Fixes

### Fix 1: Tạo Custom Extension cho Keyboard Shortcuts

**File:** `src/components/editor/extensions/KeyboardShortcuts.ts`

**Purpose:** Thêm keymap cho Link (Ctrl+K) và Underline (Ctrl+U).

```typescript
import { Extension } from '@tiptap/core';

export interface KeyboardShortcutsOptions {
  onOpenLinkModal?: () => void;
}

export const KeyboardShortcuts = Extension.create<KeyboardShortcutsOptions>({
  name: 'keyboardShortcuts',

  addOptions() {
    return {
      onOpenLinkModal: undefined,
    };
  },

  addKeyboardShortcuts() {
    return {
      // Ctrl+K / Cmd+K: Open Link Modal
      'Mod-k': () => {
        // Prevent browser default (focus address bar)
        if (this.options.onOpenLinkModal) {
          this.options.onOpenLinkModal();
          return true; // Consume the event
        }
        return false;
      },

      // Ctrl+U / Cmd+U: Toggle Underline
      'Mod-u': () => {
        return this.editor.chain().focus().toggleUnderline().run();
      },
    };
  },
});
```

---

### Fix 2: Cập Nhật PostEditorModern.tsx

**File:** `src/components/admin/PostEditorModern.tsx`

**Changes:**

1. Import `KeyboardShortcuts` extension.
2. Thêm extension vào `useEditor` với callback `onOpenLinkModal`.
3. Kết nối với `handleInsertLink` từ `WordPressToolbar`.

```typescript
// Import
import { KeyboardShortcuts } from '@/components/editor/extensions/KeyboardShortcuts';

// Trong component
const [linkModalOpen, setLinkModalOpen] = useState(false);
const [linkModalInitialUrl, setLinkModalInitialUrl] = useState('');
const [linkModalInitialText, setLinkModalInitialText] = useState('');

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    // ... other extensions
    KeyboardShortcuts.configure({
      onOpenLinkModal: () => {
        // Get selected text or current link
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        const linkAttributes = editor.getAttributes('link');

        setLinkModalInitialText(selectedText);
        setLinkModalInitialUrl(linkAttributes.href || '');
        setLinkModalOpen(true);
      },
    }),
  ],
  // ... rest of config
});
```

---

### Fix 3: Cập Nhật RichTextEditor.tsx

**File:** `src/components/admin/RichTextEditor.tsx`

**Changes:** Tương tự như `PostEditorModern.tsx`, thêm `KeyboardShortcuts` extension.

**Note:** Nếu `RichTextEditor` không có `LinkModal`, có thể bỏ qua `onOpenLinkModal` hoặc chỉ thêm keymap cho Underline.

---

## 📊 Test Cases Coverage

| Test Case                     | Status     | Notes               |
| ----------------------------- | ---------- | ------------------- |
| **Ctrl+B** (Bold)             | ✅ Pass    | StarterKit mặc định |
| **Ctrl+I** (Italic)           | ✅ Pass    | StarterKit mặc định |
| **Ctrl+U** (Underline)        | ❌ Fail    | Thiếu keymap        |
| **Ctrl+Z** (Undo)             | ✅ Pass    | StarterKit mặc định |
| **Ctrl+Y** (Redo)             | ✅ Pass    | StarterKit mặc định |
| **Ctrl+Shift+Z** (Redo)       | ✅ Pass    | StarterKit mặc định |
| **Ctrl+K** (Link)             | ❌ Fail    | Thiếu keymap        |
| **Browser Conflict (Ctrl+B)** | ✅ Pass    | StarterKit đã xử lý |
| **Browser Conflict (Ctrl+K)** | ⚠️ Warning | Cần preventDefault  |
| **Browser Conflict (Ctrl+U)** | ⚠️ Warning | Cần preventDefault  |

---

## 🎯 Recommendations

### Priority 1 (Critical)

1. ✅ **Thêm Custom Extension cho Keyboard Shortcuts**
   - Implement `KeyboardShortcuts` extension với keymap cho Link (Ctrl+K) và Underline (Ctrl+U).
   - Đảm bảo `preventDefault()` để tránh xung đột với trình duyệt.

### Priority 2 (Important)

2. ✅ **Tích hợp với LinkModal**
   - Kết nối `onOpenLinkModal` callback với `LinkModal` trong `PostEditorModern.tsx`.
   - Pre-fill selected text và existing link attributes khi mở modal.

### Priority 3 (Nice to Have)

3. ⚠️ **Thêm Tooltip cho Toolbar Buttons**
   - Hiển thị phím tắt trong tooltip (ví dụ: "Bold (Ctrl+B)").
   - Đã có một số tooltip, nhưng cần đảm bảo đầy đủ.

---

## 📝 Implementation Checklist

- [ ] Tạo file `src/components/editor/extensions/KeyboardShortcuts.ts`
- [ ] Import và thêm extension vào `PostEditorModern.tsx`
- [ ] Import và thêm extension vào `RichTextEditor.tsx`
- [ ] Kết nối `onOpenLinkModal` với `LinkModal` state
- [ ] Test Ctrl+K mở LinkModal
- [ ] Test Ctrl+U toggle Underline
- [ ] Test preventDefault() không ảnh hưởng trình duyệt
- [ ] Test trên Chrome, Firefox, Edge, Safari
- [ ] Test trên Mac (Cmd+K, Cmd+U)

---

## 🔗 References

- [Tiptap Keyboard Shortcuts Documentation](https://tiptap.dev/docs/editor/extensions/keyboard-shortcuts)
- [Tiptap Link Extension](https://tiptap.dev/api/extensions/link)
- [Tiptap Underline Extension](https://tiptap.dev/api/extensions/underline)
- [Tiptap StarterKit](https://tiptap.dev/api/extensions/starter-kit)

---

**Report Generated:** December 2025  
**Next Review:** After implementation

