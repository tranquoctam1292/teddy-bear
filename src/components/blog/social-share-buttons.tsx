'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Link2, Check, Share2 } from 'lucide-react';
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
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      fullUrl
    )}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      fullUrl
    )}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handlePinterestShare = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      fullUrl
    )}&description=${encodeURIComponent(title)}`;
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      fullUrl
    )}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n\n${shareText}\n\n${fullUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
              onClick={handleTwitterShare}
              aria-label="Chia sẻ lên Twitter"
            >
              <Twitter className="w-4 h-4" />
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
    <div className={cn('flex items-center gap-4', className)}>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Chia sẻ</span>
      <div className="flex items-center gap-2">
        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="w-10 h-10 flex items-center justify-center bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors"
          aria-label="Chia sẻ lên Facebook"
        >
          <Facebook className="w-5 h-5" />
        </button>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="w-10 h-10 flex items-center justify-center bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white rounded-lg transition-colors"
          aria-label="Chia sẻ lên Twitter"
        >
          <Twitter className="w-5 h-5" />
        </button>

        {/* Pinterest */}
        <button
          onClick={handlePinterestShare}
          className="w-10 h-10 flex items-center justify-center bg-[#BD081C] hover:bg-[#A50718] text-white rounded-lg transition-colors"
          aria-label="Chia sẻ lên Pinterest"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="w-10 h-10 flex items-center justify-center bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-colors"
          aria-label="Chia sẻ lên LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </button>

        {/* Email */}
        <button
          onClick={handleEmailShare}
          className="w-10 h-10 flex items-center justify-center bg-[#EA4335] hover:bg-[#D33B2C] text-white rounded-lg transition-colors"
          aria-label="Chia sẻ qua Email"
        >
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
