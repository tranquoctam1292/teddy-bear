'use client';

/**
 * Social Share Component
 * Các nút chia sẻ Facebook, Zalo, Copy link
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Link2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  productName: string;
  productSlug: string;
  productImage?: string;
  className?: string;
}

export default function SocialShare({
  productName,
  productSlug,
  productImage,
  className = '',
}: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${productSlug}`
      : '';

  // Share on Facebook
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Share on Zalo
  const handleZaloShare = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(productName)}`;
    window.open(zaloUrl, '_blank', 'width=600,height=400');
  };

  // Copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast({
        title: 'Đã sao chép',
        description: 'Link sản phẩm đã được sao chép vào clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể sao chép link',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
        className="flex items-center gap-2"
        aria-label="Chia sẻ lên Facebook"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
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
          <path d="M12 0C5.373 0 0 4.925 0 11c0 1.842.473 3.568 1.303 5.08L0 24l8.437-1.18C9.743 23.53 10.842 23.8 12 23.8c6.627 0 12-4.925 12-11S18.627 0 12 0zm.14 19.375c-1.582 0-3.06-.42-4.342-1.156l-.303-.18-3.12.872.89-3.028-.21-.315C3.92 14.43 3.2 12.8 3.2 11c0-4.584 3.582-8.3 8-8.3s8 3.716 8 8.3-3.582 8.3-8 8.3c-.84 0-1.658-.12-2.44-.35l-1.42-.41.3 1.38c.22 1.02.84 1.92 1.72 2.56.88.64 1.96 1 3.08 1 1.12 0 2.2-.36 3.08-1 .88-.64 1.5-1.54 1.72-2.56l.3-1.38-1.42.41c-.78.23-1.6.35-2.44.35z" />
        </svg>
        <span className="hidden sm:inline">Zalo</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center gap-2"
        aria-label="Sao chép link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="hidden sm:inline">Đã sao chép</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Sao chép link</span>
          </>
        )}
      </Button>
    </div>
  );
}




