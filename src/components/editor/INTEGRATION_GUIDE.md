# Hướng dẫn tích hợp ImageEditDialog

## Tổng quan

`ImageEditDialog` là component modal cho phép chỉnh sửa chi tiết các thuộc tính của ảnh trong Tiptap Editor, tương tự như WordPress Classic Editor.

## Tích hợp vào Editor

### Bước 1: Đảm bảo CustomImage Extension được sử dụng

Thay thế `Image` extension bằng `CustomImage` trong editor configuration:

```tsx
import CustomImage from '@/components/editor/extensions/CustomImage';

const editor = useEditor({
  extensions: [
    StarterKit,
    CustomImage.configure({
      inline: true,
      allowBase64: true,
    }),
    // ... other extensions
  ],
});
```

### Bước 2: Thêm ImageBubbleMenu (đã tích hợp sẵn ImageEditDialog)

Component `ImageBubbleMenu` đã được tích hợp sẵn với `ImageEditDialog`. Chỉ cần thêm vào JSX:

```tsx
import ImageBubbleMenu from '@/components/editor/components/ImageBubbleMenu';

// Trong component render:
{
  editor && <ImageBubbleMenu editor={editor} />;
}
```

### Bước 3: (Tùy chọn) Thêm callback cho "Thay thế ảnh"

Nếu muốn mở Media Library khi bấm "Thay thế ảnh":

```tsx
const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

{
  editor && <ImageBubbleMenu editor={editor} onReplaceImage={() => setMediaLibraryOpen(true)} />;
}
```

## Các tính năng

### ImageEditDialog

- **Văn bản thay thế (Alt text)**: Input text cho accessibility
- **Chú thích (Caption)**: Textarea, map vào `title` attribute
- **Kích thước**: Input Width và Height (px)
- **Căn chỉnh**: Select (Trái, Giữa, Phải, Không)
- **Liên kết**: Input URL để ảnh có thể click vào
- **Xem trước**: Preview ảnh với các thay đổi real-time
- **Thông tin tệp**: Hiển thị filename và kích thước

### ImageBubbleMenu (Quick Actions)

- **Căn chỉnh nhanh**: Buttons Trái, Giữa, Phải
- **Chiều rộng nhanh**: Buttons 25%, 50%, 100%
- **Chỉnh sửa**: Mở ImageEditDialog
- **Xóa**: Xóa ảnh khỏi editor

## Customization

### Thay đổi default values

Trong `ImageEditDialog.tsx`, có thể điều chỉnh `defaultValues` trong `useForm`:

```tsx
defaultValues: {
  alt: '',
  caption: '',
  width: '',
  height: '',
  align: 'left' as const,
  href: '',
},
```

### Thay đổi validation

Chỉnh sửa schema trong `ImageEditDialog.tsx`:

```tsx
const imageEditSchema = z.object({
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
  // ... other fields
});
```

## Ví dụ sử dụng hoàn chỉnh

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

## Lưu ý

1. **CustomImage Extension**: Phải sử dụng `CustomImage` thay vì `Image` extension mặc định để có đầy đủ tính năng (align, width, height, href, title).

2. **Type Safety**: Component sử dụng TypeScript với type definitions đầy đủ. Đảm bảo import đúng types nếu cần customize.

3. **Responsive**: Dialog được thiết kế responsive nhưng ưu tiên desktop (min-width: 800px).

4. **Form Validation**: Sử dụng Zod schema validation. URL field chỉ validate khi có giá trị (optional).

