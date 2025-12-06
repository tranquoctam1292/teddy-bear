import { Extension } from '@tiptap/core';

export interface KeyboardShortcutsOptions {
  onOpenLinkModal?: () => void;
}

/**
 * Custom Extension để thêm Keyboard Shortcuts cho Tiptap Editor
 *
 * Hỗ trợ:
 * - Ctrl+K / Cmd+K: Mở Link Modal
 * - Ctrl+U / Cmd+U: Toggle Underline
 */
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
        // Try to call function from editor storage (set by WordPressToolbar)
        if ((this.editor as any).__openLinkModal) {
          (this.editor as any).__openLinkModal();
          return true; // Consume the event, prevent browser default
        }
        // Fallback to callback if available
        if (this.options.onOpenLinkModal) {
          this.options.onOpenLinkModal();
          return true;
        }
        return false;
      },

      // Ctrl+U / Cmd+U: Toggle Underline
      // Note: preventDefault() được xử lý tự động bởi Tiptap khi return true
      'Mod-u': () => {
        // Chỉ toggle underline nếu editor đang focus
        if (this.editor.isFocused) {
          return this.editor.chain().focus().toggleUnderline().run();
        }
        return false; // Không consume event nếu editor không focus
      },
    };
  },
});

