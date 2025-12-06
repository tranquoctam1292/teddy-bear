# Tiptap Editor Extensions & Components

## CustomImage Extension

Extension tùy chỉnh cho Tiptap hỗ trợ các thuộc tính mở rộng cho ảnh:

- `width`: Chiều rộng ảnh (px hoặc %)
- `height`: Chiều cao ảnh (px hoặc %)
- `align`: Căn chỉnh (left, center, right)
- `title`: Caption/title cho ảnh
- `alt`: Alt text cho accessibility

## ImageBubbleMenu Component

Bubble menu hiển thị khi chọn ảnh trong editor, cung cấp các tùy chọn:

- Căn chỉnh: Trái, Giữa, Phải
- Chiều rộng: 25%, 50%, 100%
- Chỉnh sửa: Mở dialog chỉnh sửa (TODO)
- Xóa: Xóa ảnh khỏi editor

## Cách sử dụng

### 1. Import extensions và components

```tsx
import CustomImage from '@/components/editor/extensions/CustomImage';
import ImageBubbleMenu from '@/components/editor/components/ImageBubbleMenu';
```

### 2. Thêm CustomImage vào editor extensions

```tsx
const editor = useEditor({
  extensions: [
    StarterKit,
    CustomImage.configure({
      inline: true,
      allowBase64: true,
    }),
    // ... other extensions
  ],
  // ... other config
});
```

### 3. Thêm ImageBubbleMenu vào JSX

```tsx
{
  editor && <ImageBubbleMenu editor={editor} />;
}
```

### Ví dụ hoàn chỉnh

```tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CustomImage from '@/components/editor/extensions/CustomImage';
import ImageBubbleMenu from '@/components/editor/components/ImageBubbleMenu';

export default function MyEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: '<p>Start typing...</p>',
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EditorContent editor={editor} />
      <ImageBubbleMenu editor={editor} />
    </div>
  );
}
```

