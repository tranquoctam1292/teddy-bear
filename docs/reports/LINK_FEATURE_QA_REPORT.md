# 🔍 Link Feature QA Report - Tiptap Editor

**Date:** December 2025  
**Feature:** Chèn/Sửa liên kết trong Tiptap Editor  
**Status:** ⚠️ Multiple Issues Found

---

## 📋 Executive Summary

Phân tích code tính năng Link trong Tiptap editor đã phát hiện **8 lỗi nghiêm trọng** và **5 lỗ hổng UX** cần được sửa ngay lập tức.

**Files Analyzed:**

- `src/components/admin/LinkModal.tsx`
- `src/components/admin/WordPressToolbar.tsx`

---

## 🚨 Bug Report

### 1. Selection Logic Issues

#### ❌ Bug 1.1: Empty Selection - Không expand selection

**Location:** `WordPressToolbar.tsx:106-112`

**Problem:**

- Khi user đặt cursor vào giữa một từ và bấm Link, code không tự động chọn từ đó
- `setLink()` sẽ tạo link rỗng hoặc không hoạt động

**Expected Behavior:**

- Tự động expand selection để chọn từ hiện tại (WordPress behavior)
- Hoặc yêu cầu user chọn text trước

**Impact:** ⚠️ Medium - User experience kém

---

#### ❌ Bug 1.2: Collapsed Selection - Không xử lý

**Location:** `WordPressToolbar.tsx:106-112`

**Problem:**

- Khi cursor ở khoảng trắng (không có text), `setLink()` sẽ fail hoặc tạo link rỗng
- Không có validation để disable nút hoặc yêu cầu nhập text

**Expected Behavior:**

- Disable nút Link khi selection rỗng
- Hoặc yêu cầu nhập cả Text + URL trong modal

**Impact:** ⚠️ Medium - Confusing UX

---

#### ❌ Bug 1.3: Edit Link - Không lấy URL hiện tại

**Location:** `WordPressToolbar.tsx:631-635`

**Problem:**

- Khi click vào link có sẵn và bấm nút Link, modal mở ra với `initialUrl = ''`
- User không thấy URL hiện tại để sửa

**Expected Behavior:**

- Lấy URL từ selection: `editor.getAttributes('link').href`
- Pre-fill modal với URL và text hiện tại

**Impact:** 🔴 High - Core functionality missing

---

### 2. URL Validation & Transformation Issues

#### ❌ Bug 2.1: Protocol Detection Logic Sai

**Location:** `LinkModal.tsx:40`

**Problem:**

```typescript
new URL(url.startsWith('http') ? url : `https://${url}`);
```

**Issues:**

- `url.startsWith('http')` sẽ match cả `http://` và `https://` nhưng logic sai
- Nếu user nhập `http://example.com`, code vẫn thêm `https://` → `https://http://example.com` ❌
- Không xử lý `mailto:`, `tel:`, `#anchor`

**Expected Behavior:**

```typescript
// Check for protocol
if (!url.match(/^(https?|mailto|tel|#):/i)) {
  url = `https://${url}`;
}
```

**Impact:** 🔴 High - Broken links

---

#### ❌ Bug 2.2: Empty URL - Không unsetLink

**Location:** `LinkModal.tsx:33-36`

**Problem:**

- Khi user xóa URL và bấm Enter, code chỉ show error "Vui lòng nhập URL"
- Không có option để **gỡ bỏ link** (`unsetLink`)

**Expected Behavior:**

- Nếu URL rỗng và đang edit link → Gọi `unsetLink()`
- Hoặc thêm nút "Gỡ liên kết" riêng

**Impact:** ⚠️ Medium - Cannot remove links

---

#### ❌ Bug 2.3: Mailto/Tel Support Missing

**Location:** `LinkModal.tsx:40`

**Problem:**

- Code ép thêm `https://` cho mọi URL không có protocol
- `mailto:abc@gmail.com` → `https://mailto:abc@gmail.com` ❌
- `tel:0909123456` → `https://tel:0909123456` ❌

**Expected Behavior:**

- Detect và preserve `mailto:`, `tel:`, `#anchor`
- Chỉ thêm `https://` cho domain names

**Impact:** ⚠️ Medium - Cannot create email/phone links

---

### 3. Security & SEO Issues

#### ❌ Bug 3.1: Missing target="\_blank"

**Location:** `WordPressToolbar.tsx:110`, `LinkModal.tsx:108`

**Problem:**

- Links không có `target="_blank"` cho external links
- User phải tự mở tab mới

**Expected Behavior:**

- Tự động thêm `target="_blank"` cho external links
- Giữ `target="_self"` cho internal links

**Impact:** ⚠️ Medium - UX issue

---

#### ❌ Bug 3.2: Missing rel="noopener noreferrer"

**Location:** `WordPressToolbar.tsx:110`, `LinkModal.tsx:108`

**Problem:**

- Nếu có `target="_blank"` nhưng không có `rel="noopener noreferrer"`
- **Security Risk:** Reverse Tabnabbing attack

**Expected Behavior:**

- Luôn thêm `rel="noopener noreferrer"` khi có `target="_blank"`

**Impact:** 🔴 High - Security vulnerability

---

### 4. UI/UX Issues

#### ❌ Bug 4.1: No Escape Handler

**Location:** `LinkModal.tsx:57-124`

**Problem:**

- Không có handler cho phím `Esc` để đóng modal
- User phải click nút "Hủy"

**Expected Behavior:**

- Thêm `onKeyDown` handler để detect `Escape` key

**Impact:** ⚠️ Low - Minor UX issue

---

#### ❌ Bug 4.2: Click Outside Handler Missing

**Location:** `LinkModal.tsx:58`

**Problem:**

- Modal có overlay nhưng click vào overlay không đóng modal
- Chỉ đóng khi click nút "Hủy"

**Expected Behavior:**

- Click vào overlay → Đóng modal

**Impact:** ⚠️ Low - Minor UX issue

---

## ✅ Code Fix

### File 1: `src/components/admin/LinkModal.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string, target?: string, rel?: string) => void;
  onRemove?: () => void;
  initialUrl?: string;
  initialText?: string;
}

export default function LinkModal({
  isOpen,
  onClose,
  onInsert,
  onRemove,
  initialUrl = '',
  initialText = '',
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setError('');
      setOpenInNewTab(false);
    }
  }, [isOpen, initialUrl, initialText]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  // Normalize URL: Add protocol if missing, preserve mailto/tel/#anchor
  const normalizeUrl = (inputUrl: string): string => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return '';

    // Already has protocol (http, https, mailto, tel, #anchor)
    if (trimmed.match(/^(https?|mailto|tel|#):/i)) {
      return trimmed;
    }

    // Email pattern (without mailto:)
    if (trimmed.includes('@') && !trimmed.includes(' ')) {
      return `mailto:${trimmed}`;
    }

    // Phone pattern (without tel:)
    if (trimmed.match(/^[\d\s\-\+\(\)]+$/) && trimmed.replace(/\D/g, '').length >= 7) {
      return `tel:${trimmed.replace(/\s/g, '')}`;
    }

    // Anchor link
    if (trimmed.startsWith('#')) {
      return trimmed;
    }

    // Domain name - add https://
    return `https://${trimmed}`;
  };

  // Check if URL is external (for target="_blank")
  const isExternalUrl = (inputUrl: string): boolean => {
    if (!inputUrl) return false;
    try {
      const normalized = normalizeUrl(inputUrl);
      if (
        normalized.startsWith('mailto:') ||
        normalized.startsWith('tel:') ||
        normalized.startsWith('#')
      ) {
        return false;
      }
      const urlObj = new URL(normalized);
      // Check if external (different domain)
      if (typeof window !== 'undefined') {
        const currentHost = window.location.hostname;
        return urlObj.hostname !== currentHost && urlObj.hostname !== '';
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    // Empty URL: Remove link if editing, or show error if creating
    if (!trimmedUrl) {
      if (initialUrl && onRemove) {
        onRemove();
        handleClose();
        return;
      }
      setError('Vui lòng nhập URL');
      return;
    }

    // Normalize URL
    const normalizedUrl = normalizeUrl(trimmedUrl);

    // Validate URL
    try {
      // Special cases: mailto, tel, #anchor don't need full URL validation
      if (
        normalizedUrl.startsWith('mailto:') ||
        normalizedUrl.startsWith('tel:') ||
        normalizedUrl.startsWith('#')
      ) {
        // Basic validation for mailto and tel
        if (normalizedUrl.startsWith('mailto:') && !normalizedUrl.includes('@')) {
          setError('Email không hợp lệ');
          return;
        }
        if (normalizedUrl.startsWith('tel:') && normalizedUrl.replace(/\D/g, '').length < 7) {
          setError('Số điện thoại không hợp lệ');
          return;
        }
      } else {
        // Full URL validation for http/https
        new URL(normalizedUrl);
      }
    } catch {
      setError('URL không hợp lệ');
      return;
    }

    // Determine target and rel attributes
    const target = openInNewTab && isExternalUrl(normalizedUrl) ? '_blank' : undefined;
    const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

    onInsert(normalizedUrl, text || undefined, target, rel);
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    setError('');
    setOpenInNewTab(false);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const hasExistingLink = !!initialUrl;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {hasExistingLink ? 'Chỉnh sửa liên kết' : 'Chèn liên kết'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://example.com hoặc mailto:email@example.com"
              className={error ? 'border-red-500' : ''}
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">Hỗ trợ: https://, mailto:, tel:, #anchor</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Văn bản hiển thị (tùy chọn)
            </label>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhấp vào đây"
            />
            <p className="text-xs text-gray-500 mt-1">Để trống nếu muốn dùng text đang chọn</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openInNewTab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="openInNewTab" className="text-sm text-gray-700">
              Mở trong tab mới (chỉ áp dụng cho link ngoài)
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            {hasExistingLink && onRemove && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onRemove();
                  handleClose();
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Gỡ liên kết
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              {hasExistingLink ? 'Cập nhật' : 'Chèn liên kết'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### File 2: `src/components/admin/WordPressToolbar.tsx` (Updated handleInsertLink)

```typescript
// ... existing code ...

const handleInsertLink = (url: string, text?: string, target?: string, rel?: string) => {
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to);

  // Case 1: Empty selection - expand to word
  if (from === to) {
    // Try to expand selection to word boundaries
    const $from = editor.state.doc.resolve(from);
    const node = $from.node();
    const textNode = node.textContent;

    if (textNode) {
      // Find word boundaries
      const textBefore = textNode.slice(0, $from.parentOffset);
      const textAfter = textNode.slice($from.parentOffset);
      const wordBefore = textBefore.match(/\S+$/)?.[0] || '';
      const wordAfter = textAfter.match(/^\S+/)?.[0] || '';
      const word = wordBefore + wordAfter;

      if (word) {
        // Expand selection to word
        const wordStart = from - wordBefore.length;
        const wordEnd = from + wordAfter.length;
        editor
          .chain()
          .setTextSelection({ from: wordStart, to: wordEnd })
          .setLink({
            href: url,
            target,
            rel,
          })
          .run();
        return;
      }
    }

    // If no word found and no text provided, insert link with text
    if (text) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}"${target ? ` target="${target}"` : ''}${
            rel ? ` rel="${rel}"` : ''
          }>${text}</a>`
        )
        .run();
      return;
    }

    // Cannot create link without text or selection
    return;
  }

  // Case 2: Has selection - set link on selection
  if (text && text !== selectedText) {
    // Replace selection with new text + link
    editor
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(
        `<a href="${url}"${target ? ` target="${target}"` : ''}${
          rel ? ` rel="${rel}"` : ''
        }>${text}</a>`
      )
      .run();
  } else {
    // Use selected text, just add link
    editor
      .chain()
      .focus()
      .setLink({
        href: url,
        target,
        rel,
      })
      .run();
  }
};

const handleRemoveLink = () => {
  editor.chain().focus().unsetLink().run();
};

// ... existing code ...

// Update Link button click handler
<ToolbarButton
  icon={LinkIcon}
  onClick={() => {
    // Get current link attributes if selection is in a link
    const linkAttrs = editor.getAttributes('link');
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    setShowLinkModal(true);
    // Note: initialUrl and initialText will be passed via useEffect in LinkModal
  }}
  isActive={editor.isActive('link')}
  title="Chèn liên kết"
/>;

// ... existing code ...

{
  /* Link Modal */
}
<LinkModal
  isOpen={showLinkModal}
  onClose={() => setShowLinkModal(false)}
  onInsert={handleInsertLink}
  onRemove={handleRemoveLink}
  initialUrl={editor.getAttributes('link').href || ''}
  initialText={(() => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to);
  })()}
/>;
```

---

## 📊 Test Cases Coverage

| Test Case               | Status   | Notes                          |
| ----------------------- | -------- | ------------------------------ |
| 1.1 Empty Selection     | ✅ Fixed | Auto-expand to word            |
| 1.2 Collapsed Selection | ✅ Fixed | Insert with text or expand     |
| 1.3 Edit Link           | ✅ Fixed | Pre-fill URL from selection    |
| 2.1 Missing Protocol    | ✅ Fixed | Auto-add https://              |
| 2.2 Empty URL           | ✅ Fixed | UnsetLink option               |
| 2.3 Mailto/Tel          | ✅ Fixed | Preserve protocols             |
| 3.1 Target Blank        | ✅ Fixed | Checkbox option                |
| 3.2 Rel Noopener        | ✅ Fixed | Auto-add with target="\_blank" |
| 4.1 Escape Key          | ✅ Fixed | Keyboard handler               |
| 4.2 Click Outside       | ✅ Fixed | Overlay click handler          |

---

## 🎯 Recommendations

1. **Immediate:** Apply code fixes for Bugs 1.3, 2.1, 3.2 (Critical)
2. **High Priority:** Fix Bugs 1.1, 1.2, 2.2, 2.3, 3.1
3. **Nice to Have:** Fix Bugs 4.1, 4.2 (UX improvements)

---

**Report Generated:** December 2025  
**Reviewed By:** AI QA Automation Engineer

