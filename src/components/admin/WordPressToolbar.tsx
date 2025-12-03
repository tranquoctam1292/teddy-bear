'use client';

// WordPress-Style Toolbar for Tiptap Editor
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Undo2,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Palette,
  Highlighter,
  Type,
  HelpCircle,
  MoreHorizontal,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  Video,
} from 'lucide-react';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { useState, useEffect, useRef } from 'react';
import LinkModal from './LinkModal';
import ColorPickerModal from './ColorPickerModal';

interface WordPressToolbarProps {
  editor: Editor;
  onAddMedia?: () => void;
  className?: string;
}

export default function WordPressToolbar({
  editor,
  onAddMedia,
  className = '',
}: WordPressToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (tableMenuRef.current && !tableMenuRef.current.contains(event.target as Node)) {
        setShowTableMenu(false);
      }
    };

    if (showColorPicker || showTableMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showTableMenu]);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    isActive = false,
    title,
    disabled = false,
  }: {
    icon: any;
    onClick: () => void;
    isActive?: boolean;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'hover:bg-gray-100 text-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const handleInsertLink = (url: string, text?: string) => {
    if (text) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const addYouTubeVideo = () => {
    const url = prompt('Nhập YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-t-lg ${className}`}>
      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddMedia}
          className="text-sm"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Thêm Media
        </Button>
      </div>

      {/* Row 1 - Primary Formatting */}
      <div className="flex items-center gap-0.5 px-2 py-2 border-b border-gray-200 flex-wrap">
        {/* Format Dropdown */}
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
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            } else if (value === 'h2') {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            } else if (value === 'h3') {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          className="px-3 py-1.5 border border-gray-300 rounded text-sm mr-2 bg-white"
        >
          <option value="paragraph">Đoạn văn</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        {/* Font Family Dropdown */}
        <select
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

        {/* Font Size Dropdown */}
        <select
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

        <ToolbarButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="In đậm (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="In nghiêng (Ctrl+I)"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Danh sách dấu đầu dòng"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Danh sách đánh số"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Trích dẫn"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Căn trái"
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Căn giữa"
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Căn phải"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={LinkIcon}
          onClick={() => setShowLinkModal(true)}
          isActive={editor.isActive('link')}
          title="Chèn liên kết"
        />
        <ToolbarButton
          icon={ImageIcon}
          onClick={onAddMedia}
          title="Thêm hình ảnh"
        />
        <ToolbarButton
          icon={Video}
          onClick={addYouTubeVideo}
          title="Nhúng video YouTube"
        />
        
        {/* Table Menu */}
        <div className="relative" ref={tableMenuRef}>
          <button
            type="button"
            onClick={() => setShowTableMenu(!showTableMenu)}
            className="p-2 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
            title="Bảng"
          >
            <Table className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>
          {showTableMenu && (
            <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[180px]">
              <button
                type="button"
                onClick={() => {
                  insertTable();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Chèn bảng 3x3
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  addRowBefore();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                disabled={!editor.can().addRowBefore()}
              >
                <Plus className="w-4 h-4" />
                Thêm dòng trên
              </button>
              <button
                type="button"
                onClick={() => {
                  addRowAfter();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                disabled={!editor.can().addRowAfter()}
              >
                <Plus className="w-4 h-4" />
                Thêm dòng dưới
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRow();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                disabled={!editor.can().deleteRow()}
              >
                <Minus className="w-4 h-4" />
                Xóa dòng
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  addColumnBefore();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                disabled={!editor.can().addColumnBefore()}
              >
                <Plus className="w-4 h-4" />
                Thêm cột trái
              </button>
              <button
                type="button"
                onClick={() => {
                  addColumnAfter();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                disabled={!editor.can().addColumnAfter()}
              >
                <Plus className="w-4 h-4" />
                Thêm cột phải
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteColumn();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                disabled={!editor.can().deleteColumn()}
              >
                <Minus className="w-4 h-4" />
                Xóa cột
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  deleteTable();
                  setShowTableMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                disabled={!editor.can().deleteTable()}
              >
                <Trash2 className="w-4 h-4" />
                Xóa toàn bộ bảng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 2 - Advanced Formatting */}
      <div className="flex items-center gap-0.5 px-2 py-2 flex-wrap">
        <ToolbarButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Gạch chân (Ctrl+U)"
        />
        <ToolbarButton
          icon={Strikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Gạch ngang"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Color */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
            title="Màu chữ"
            aria-label="Chọn màu chữ"
          >
            <Palette className="w-4 h-4" />
            <span className="text-xs">▼</span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-300 rounded shadow-lg z-50 w-64">
              {/* 48 Color Grid - 6 columns x 8 rows */}
              <div className="grid grid-cols-6 gap-1 mb-2">
                {[
                  // Row 1 - Dark colors
                  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC',
                  // Row 2 - Reds & Browns
                  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
                  // Row 3 - Blues & Cyans
                  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                  // Row 4 - Greens & Yellows
                  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
                  // Row 5 - Light Reds
                  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB',
                  // Row 6 - Light Blues
                  '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3',
                  // Row 7 - Light Yellows
                  '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC', '#D7CCC8', '#F5F5F5',
                  // Row 8 - Custom/Special
                  '#FFFFFF', '#EA4335', '#FBBC04', '#34A853', '#4285F4', '#FF6D00',
                ].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform hover:border-blue-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              
              {/* Custom Color Section */}
              <div className="border-t pt-2">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 mb-2 w-full text-left"
                  onClick={() => {
                    setShowColorPicker(false);
                    setShowColorPickerModal(true);
                  }}
                >
                  Tùy chỉnh...
                </button>
                
                {/* Custom Color Slots (placeholder) */}
                <div className="grid grid-cols-8 gap-1">
                  {Array(8).fill(null).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded border border-gray-300 bg-white"
                    />
                  ))}
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="mt-2 text-xs text-gray-600 hover:text-gray-900 w-full text-center border-t pt-2"
              >
                Xóa màu
              </button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <ToolbarButton
          icon={Highlighter}
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffff00' }).run()}
          isActive={editor.isActive('highlight')}
          title="Đánh dấu"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Clear Formatting */}
        <ToolbarButton
          icon={Type}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Xóa định dạng"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          icon={Undo2}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác (Ctrl+Z)"
        />
        <ToolbarButton
          icon={Redo2}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại (Ctrl+Y)"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={HelpCircle}
          onClick={() => alert('Phím tắt:\n\nCtrl+B: In đậm\nCtrl+I: In nghiêng\nCtrl+U: Gạch chân\nCtrl+Z: Hoàn tác\nCtrl+Y: Làm lại\nCtrl+K: Chèn liên kết')}
          title="Trợ giúp & Phím tắt"
        />
      </div>

      {/* Link Modal */}
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleInsertLink}
      />

      {/* Advanced Color Picker Modal */}
      <ColorPickerModal
        isOpen={showColorPickerModal}
        onClose={() => setShowColorPickerModal(false)}
        onSelect={(color) => {
          editor.chain().focus().setColor(color).run();
        }}
      />
    </div>
  );
}

