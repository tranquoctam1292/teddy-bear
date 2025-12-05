'use client';

import { useState } from 'react';
import { Facebook, Link2, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function SocialShareButtons({
  url,
  title,
  description,
  className,
  variant = 'default',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url;
  const shareText = description || title;

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleZaloShare = () => {
    // Zalo Share API
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`;
    window.open(zaloUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  const isNativeShareSupported = typeof navigator !== 'undefined' && navigator.share;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {isNativeShareSupported ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="flex items-center gap-2"
            aria-label="Chia sẻ"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ</span>
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFacebookShare}
              aria-label="Chia sẻ lên Facebook"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZaloShare}
              aria-label="Chia sẻ lên Zalo"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.1 0-2.14-.23-3.1-.64l-.7-.2-1.5.44.44-1.5-.2-.7C6.23 14.14 6 13.1 6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              aria-label="Sao chép liên kết"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-sm font-semibold text-gray-700">Chia sẻ bài viết</h3>
      <div className="flex flex-wrap gap-2">
        {isNativeShareSupported ? (
          <Button
            variant="outline"
            onClick={handleNativeShare}
            className="flex items-center gap-2"
            aria-label="Chia sẻ"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ</span>
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleFacebookShare}
              className="flex items-center gap-2"
              aria-label="Chia sẻ lên Facebook"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleZaloShare}
              className="flex items-center gap-2"
              aria-label="Chia sẻ lên Zalo"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.1 0-2.14-.23-3.1-.64l-.7-.2-1.5.44.44-1.5-.2-.7C6.23 14.14 6 13.1 6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6z" />
              </svg>
              <span>Zalo</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
              aria-label="Sao chép liên kết"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Sao chép liên kết</span>
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

