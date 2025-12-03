'use client';

// Universal Rich Text Editor Component
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@/lib/tiptap-extensions/fontSize';
import Youtube from '@tiptap/extension-youtube';
import { useState } from 'react';
import WordPressToolbar from './WordPressToolbar';
import MediaLibrary from './MediaLibrary';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  showMediaLibrary?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Bắt đầu viết nội dung...',
  minHeight = '300px',
  className = '',
  showMediaLibrary = true,
}: RichTextEditorProps) {
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none p-6 ${className}`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <WordPressToolbar
        editor={editor}
        onAddMedia={showMediaLibrary ? () => setMediaLibraryOpen(true) : undefined}
      />
      
      <div className="border-t border-gray-200">
        <EditorContent editor={editor} />
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          isOpen={mediaLibraryOpen}
          onClose={() => setMediaLibraryOpen(false)}
          onSelect={(file) => {
            editor.chain().focus().setImage({ 
              src: file.url,
              alt: file.alt || file.filename,
            }).run();
            setMediaLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}

