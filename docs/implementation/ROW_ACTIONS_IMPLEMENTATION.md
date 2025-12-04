# 🎯 Row Actions - WordPress-style Quick Actions

> Hệ thống Quick Actions khi hover vào items trong danh sách

**Status:** ✅ In Progress  
**Date:** December 4, 2025

---

## 📋 Overview

Triển khai tính năng **Row Actions** (Quick Actions) giống WordPress - hiển thị các action links khi hover vào item trong list:

- **Chỉnh sửa** - Edit item
- **Sửa nhanh** - Quick edit inline
- **Xóa tạm** - Move to trash
- **Xem trước** - Preview (new tab)
- **Nhân đôi** - Duplicate item

---

## ✅ Đã hoàn thành

### 1. RowActions Component ✅

**File:** `src/components/admin/RowActions.tsx`

**Features:**
- Show/hide on hover
- Customizable actions
- Confirm dialogs
- Loading states
- Helper functions

**Helper Functions:**
```typescript
createEditAction(href)           // Chỉnh sửa
createQuickEditAction(onClick)   // Sửa nhanh  
createTrashAction(onClick)       // Xóa tạm (red)
createDeleteAction(onClick)      // Xóa vĩnh viễn (dark red)
createPreviewAction(href)        // Xem trước (new tab)
createDuplicateAction(onClick)   // Nhân đôi (green)
createRestoreAction(onClick)     // Khôi phục (green)
createViewAction(href)           // Xem (new tab)
```

### 2. Duplicate API ✅

**File:** `src/app/api/admin/posts/[id]/duplicate/route.ts`

**Features:**
- Duplicate post with "- Copy" suffix
- Auto-generate unique slug
- Set status to draft
- Clear publish date

### 3. Posts List Integration ✅

**File:** `src/app/admin/posts/page.tsx`

**Actions:**
- ✅ Chỉnh sửa → `/admin/posts/[id]/edit`
- ✅ Sửa nhanh → Quick edit modal
- ✅ Xóa tạm → Move to trash (status=archived)
- ✅ Xem trước → `/blog/[slug]` (new tab)
- ✅ Nhân đôi → Duplicate API → Edit copy

**For Trashed Posts:**
- ✅ Khôi phục → Restore to draft
- ✅ Xóa vĩnh viễn → Delete permanently

---

## 📝 Usage Example

### In List Page:

```typescript
import RowActions, {
  createEditAction,
  createQuickEditAction,
  createTrashAction,
  createPreviewAction,
  createDuplicateAction,
} from '@/components/admin/RowActions';

// In table row:
<TableCell>
  <RowActions
    title={post.title}
    titleHref={`/admin/posts/${post.id}/edit`}
    status="Bản nháp"
    actions={[
      createEditAction(`/admin/posts/${post.id}/edit`),
      createQuickEditAction(() => openQuickEdit(post)),
      createTrashAction(async () => {
        await moveToTrash(post.id);
      }, post.title),
      createPreviewAction(`/blog/${post.slug}`),
      createDuplicateAction(async () => {
        await duplicatePost(post.id);
      }),
    ]}
  />
</TableCell>
```

---

## 🎨 Visual Behavior

### Default State (No Hover):
```
Kinh nghiệm niềng răng cho trẻ... — Bản nháp
```

### On Hover:
```
Kinh nghiệm niềng răng cho trẻ... — Bản nháp
Chỉnh sửa | Sửa nhanh | Xóa tạm | Xem trước | Nhân đôi
  (blue)      (blue)     (RED)     (blue)     (green)
```

---

## 🔧 Pending Implementation

### Pages to Update:

- [x] Posts (`/admin/posts`)
- [ ] Pages (`/admin/pages`)
- [ ] Products (`/admin/products`)
- [ ] Media (`/admin/media`)
- [ ] Authors (`/admin/authors`)
- [ ] Comments (`/admin/comments`)
- [ ] Orders (`/admin/orders`)

### APIs to Create:

- [x] POST `/api/admin/posts/[id]/duplicate`
- [ ] POST `/api/admin/pages/[id]/duplicate`
- [ ] POST `/api/admin/products/[id]/duplicate`
- [ ] POST `/api/admin/media/[id]/duplicate`
- [ ] POST `/api/admin/authors/[id]/duplicate`

---

## 📋 Implementation Checklist

### For Each List Page:

1. **Import RowActions:**
   ```typescript
   import RowActions, { create*Action } from '@/components/admin/RowActions';
   ```

2. **Add State (if Quick Edit needed):**
   ```typescript
   const [quickEditItem, setQuickEditItem] = useState(null);
   ```

3. **Replace Title Cell:**
   ```typescript
   <TableCell>
     <RowActions
       title={item.title}
       titleHref={`/admin/items/${item.id}/edit`}
       status={item.status}
       actions={[...]}
     />
   </TableCell>
   ```

4. **Define Actions:**
   ```typescript
   actions={[
     createEditAction(editUrl),
     createQuickEditAction(handler),
     createTrashAction(handler, itemName),
     createPreviewAction(previewUrl),
     createDuplicateAction(handler),
   ]}
   ```

5. **Create Duplicate API:**
   ```typescript
   // /api/admin/[resource]/[id]/duplicate/route.ts
   POST handler to duplicate item
   ```

---

## 🎯 Next Steps

1. Apply to Pages list
2. Apply to Products list
3. Apply to Media list
4. Apply to Authors list
5. Create duplicate APIs for each

**Total Estimated Time:** 1-2 hours for all pages

---

**Status:** 🚧 In Progress  
**Completed:** Posts (1/7 pages)  
**Next:** Pages, Products, Media, etc.

