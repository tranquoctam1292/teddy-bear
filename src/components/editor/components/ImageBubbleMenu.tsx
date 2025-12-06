'use client';

import { useState, useCallback } from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { NodeSelection } from 'prosemirror-state';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ImageEditDialog, { type ImageAttributes } from './ImageEditDialog';

interface ImageBubbleMenuProps {
  editor: Editor;
  onReplaceImage?: () => void;
}

export default function ImageBubbleMenu({ editor, onReplaceImage }: ImageBubbleMenuProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<ImageAttributes | null>(null);
  // Helper to get current image node and position
  const getImageNode = () => {
    if (!editor) return null;

    const { state } = editor;
    const { selection } = state;

    // Check if selection is NodeSelection
    if (selection instanceof NodeSelection) {
      if (selection.node && selection.node.type.name === 'image') {
        return { node: selection.node, pos: selection.from };
      }
    }

    // Text selection, try to find image nearby
    const { $anchor } = selection;
    let imageNode = null;
    let imagePos = null;

    state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && pos <= $anchor.pos && pos + node.nodeSize >= $anchor.pos) {
        imageNode = node;
        imagePos = pos;
        return false;
      }
    });

    return imageNode && imagePos !== null ? { node: imageNode, pos: imagePos } : null;
  };

  const setImageAlign = (align: 'left' | 'center' | 'right') => {
    if (!editor) return;

    const imageData = getImageNode();
    if (imageData) {
      editor
        .chain()
        .focus()
        .setNodeSelection(imageData.pos)
        .updateAttributes('image', { align })
        .run();
    }
  };

  const setImageWidth = (width: '25%' | '50%' | '100%') => {
    if (!editor) return;

    const imageData = getImageNode();
    if (imageData) {
      editor
        .chain()
        .focus()
        .setNodeSelection(imageData.pos)
        .updateAttributes('image', { width })
        .run();
    }
  };

  const handleEdit = () => {
    const imageData = getImageNode();

    if (imageData) {
      const attrs = imageData.node.attrs;
      setCurrentImageData({
        src: attrs.src || '',
        alt: attrs.alt || undefined,
        title: attrs.title || undefined,
        width: attrs.width || undefined,
        height: attrs.height || undefined,
        align: attrs.align || 'left',
        href: attrs.href || undefined,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = () => {
    if (!editor) return;

    const imageData = getImageNode();
    if (imageData) {
      editor.chain().focus().setNodeSelection(imageData.pos).deleteSelection().run();
    }
  };

  const getCurrentAlign = (): 'left' | 'center' | 'right' => {
    const imageData = getImageNode();
    if (imageData) {
      return (imageData.node.attrs.align || 'left') as 'left' | 'center' | 'right';
    }
    return 'left';
  };

  const getCurrentWidth = (): '25%' | '50%' | '100%' => {
    const imageData = getImageNode();
    if (imageData) {
      const nodeWidth = imageData.node.attrs.width;
      if (nodeWidth === '25%' || nodeWidth === '50%' || nodeWidth === '100%') {
        return nodeWidth as '25%' | '50%' | '100%';
      } else if (nodeWidth) {
        // Try to match percentage
        const widthStr = String(nodeWidth);
        if (widthStr.includes('25')) return '25%';
        if (widthStr.includes('50')) return '50%';
        return '100%';
      }
    }
    return '100%';
  };

  // useCallback để đảm bảo shouldShow reactive với isEditDialogOpen
  // Phải đặt trước early return để tuân thủ Rules of Hooks
  const shouldShowBubbleMenu = useCallback(
    ({ state }: { state: { selection: any; doc: any } }) => {
      // KHÔNG hiển thị khi modal đang mở - check đầu tiên
      if (isEditDialogOpen) {
        return false;
      }

      const { selection } = state;

      // Check if selection is NodeSelection on image
      if (selection instanceof NodeSelection) {
        if (selection.node && selection.node.type.name === 'image') {
          return true;
        }
      }

      // Check if cursor is inside or near an image
      const { $anchor } = selection;
      let isImage = false;

      state.doc.nodesBetween(
        $anchor.pos - 1,
        $anchor.pos + 1,
        (node: { type: { name: string } }) => {
          if (node.type.name === 'image') {
            isImage = true;
            return false;
          }
        }
      );

      return isImage;
    },
    [isEditDialogOpen]
  );

  if (!editor) {
    return null;
  }

  const currentAlign = getCurrentAlign();
  const currentWidth = getCurrentWidth();

  return (
    <>
      {/* Luôn render BubbleMenu, chỉ ẩn bằng shouldShow để tránh lỗi unmount */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          placement: 'top',
          zIndex: 40, // Đảm bảo thấp hơn Dialog (z-50)
        }}
        shouldShow={shouldShowBubbleMenu}
      >
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          {/* Align Buttons */}
          <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
            <Button
              type="button"
              variant={currentAlign === 'left' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                currentAlign === 'left' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageAlign('left')}
              aria-label="Căn trái"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={currentAlign === 'center' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                currentAlign === 'center' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageAlign('center')}
              aria-label="Căn giữa"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={currentAlign === 'right' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                currentAlign === 'right' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageAlign('right')}
              aria-label="Căn phải"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Width Buttons */}
          <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
            <Button
              type="button"
              variant={currentWidth === '25%' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 px-2 text-xs',
                currentWidth === '25%' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageWidth('25%')}
              aria-label="Chiều rộng 25%"
            >
              25%
            </Button>
            <Button
              type="button"
              variant={currentWidth === '50%' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 px-2 text-xs',
                currentWidth === '50%' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageWidth('50%')}
              aria-label="Chiều rộng 50%"
            >
              50%
            </Button>
            <Button
              type="button"
              variant={currentWidth === '100%' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 px-2 text-xs',
                currentWidth === '100%' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => setImageWidth('100%')}
              aria-label="Chiều rộng 100%"
            >
              100%
            </Button>
          </div>

          {/* Edit Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleEdit}
            aria-label="Chỉnh sửa ảnh"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {/* Delete Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            aria-label="Xóa ảnh"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </BubbleMenu>

      {/* Image Edit Dialog */}
      {editor && (
        <ImageEditDialog
          editor={editor}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          currentData={currentImageData}
          onReplaceImage={onReplaceImage}
        />
      )}
    </>
  );
}
