// Social Feed Section Component
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  image?: string;
  caption?: string;
  author: string;
  authorAvatar?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  url?: string;
}

interface SocialFeedContent {
  heading?: string;
  subheading?: string;
  posts: SocialPost[];
  layout: 'grid' | 'carousel';
  columns?: number;
  showCaption?: boolean;
  showStats?: boolean;
  showPlatform?: boolean;
}

const PLATFORM_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

const PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
};

export function SocialFeed({
  content,
  layout,
  isPreview,
}: SectionComponentProps<SocialFeedContent>) {
  const posts = content.posts || [];
  const layoutType = content.layout || 'grid';
  const columns = content.columns || 4;
  const showCaption = content.showCaption !== false;
  const showStats = content.showStats !== false;
  const showPlatform = content.showPlatform !== false;

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No social posts configured</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center mb-12">
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

      {/* Posts Grid */}
      <div
        className={cn(
          'grid gap-4',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          columns === 5 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        )}
      >
        {posts.map((post) => (
          <SocialPostCard
            key={post.id}
            post={post}
            showCaption={showCaption}
            showStats={showStats}
            showPlatform={showPlatform}
          />
        ))}
      </div>
    </div>
  );
}

// Social Post Card Component
function SocialPostCard({
  post,
  showCaption,
  showStats,
  showPlatform,
}: {
  post: SocialPost;
  showCaption: boolean;
  showStats: boolean;
  showPlatform: boolean;
}) {
  const PlatformIcon = PLATFORM_ICONS[post.platform];
  const platformColor = PLATFORM_COLORS[post.platform];

  const CardContent = (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-shadow">
      {/* Image */}
      {post.image && (
        <Image
          src={post.image}
          alt={post.caption || 'Social post'}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      )}

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top: Platform Icon */}
          {showPlatform && (
            <div className="flex justify-end">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: platformColor }}
              >
                <PlatformIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Bottom: Caption and Stats */}
          <div>
            {showCaption && post.caption && (
              <p className="text-white text-sm mb-2 line-clamp-3">
                {post.caption}
              </p>
            )}

            {showStats && (post.likes || post.comments) && (
              <div className="flex items-center gap-4 text-white text-sm">
                {post.likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                )}
                {post.comments !== undefined && (
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* External Link Icon */}
        {post.url && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  if (post.url) {
    return (
      <Link href={post.url} target="_blank" rel="noopener noreferrer">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

