// Video Embed Section Component
'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface VideoEmbedContent {
  heading?: string;
  subheading?: string;
  videoUrl: string; // YouTube or Vimeo URL
  videoType?: 'youtube' | 'vimeo' | 'direct';
  thumbnail?: string; // Custom thumbnail
  autoplay?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  maxWidth?: string; // 'sm', 'md', 'lg', 'xl', 'full'
}

export function VideoEmbed({
  content,
  layout,
  isPreview,
}: SectionComponentProps<VideoEmbedContent>) {
  const [isPlaying, setIsPlaying] = useState(content.autoplay || false);

  const aspectRatio = content.aspectRatio || '16:9';
  const maxWidth = content.maxWidth || 'lg';
  
  // Extract video ID and generate embed URL
  const embedUrl = getEmbedUrl(content.videoUrl, content.videoType);

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center mb-8">
          {content.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Video Container */}
      <div className={cn('mx-auto', maxWidthClass)}>
        <div className={cn('relative rounded-lg overflow-hidden shadow-2xl', aspectRatioClass)}>
          {!isPlaying && content.thumbnail ? (
            // Custom Thumbnail with Play Button
            <div className="absolute inset-0 bg-gray-900">
              <img
                src={content.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="w-10 h-10 text-pink-600 ml-1" fill="currentColor" />
                </div>
              </button>
            </div>
          ) : (
            // Embedded Video
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={content.heading || 'Video'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Convert video URL to embed URL
function getEmbedUrl(url: string, type?: string): string {
  if (!url) return '';

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be') || type === 'youtube') {
    const videoId = extractYouTubeId(url);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Vimeo
  if (url.includes('vimeo.com') || type === 'vimeo') {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }

  // Direct video file
  return url;
}

// Helper: Extract YouTube video ID
function extractYouTubeId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : '';
}

