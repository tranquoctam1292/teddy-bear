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
        setUrl('');
        setText('');
        setError('');
        setOpenInNewTab(false);
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent | React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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

        <div className="space-y-4">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
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
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {hasExistingLink ? 'Cập nhật' : 'Chèn liên kết'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
