// Video Showcase Section Component - Phase 9: Visual Storytelling
// Client Component displaying product showcase videos
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayCircle, X } from 'lucide-react';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { VideoContent } from '@/lib/mock-data';
import { VIDEO_CONTENT } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface VideoShowcaseProps {
  heading?: string;
  subheading?: string;
  limit?: number;
}

function VideoThumbnail({
  video,
  onClick,
  isMain = false,
}: {
  video: VideoContent;
  onClick: () => void;
  isMain?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg bg-gray-900 transition-all duration-300',
        isMain
          ? 'aspect-video w-full'
          : 'aspect-video w-full hover:scale-105 hover:shadow-xl'
      )}
      aria-label={`Phát video: ${video.title}`}
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        sizes={isMain ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white/90 p-4 group-hover:bg-white group-hover:scale-110 transition-all">
          <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-pink-600" fill="currentColor" />
        </div>
      </div>

      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-white/80 text-xs line-clamp-1">{video.description}</p>
        )}
        <p className="text-white/70 text-xs mt-1">{video.duration}</p>
      </div>
    </button>
  );
}

function VideoModal({
  video,
  isOpen,
  onClose,
}: {
  video: VideoContent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!video) return null;

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">{video.title}</DialogTitle>
          {video.description && (
            <DialogDescription className="text-sm text-gray-600">
              {video.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-gray-900">
          <iframe
            src={getYouTubeEmbedUrl(video.videoUrl)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VideoShowcase({
  heading = 'Khám Phá Sản Phẩm',
  subheading = 'Xem gấu bông trong cuộc sống thực tế',
  limit,
}: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videos = limit ? VIDEO_CONTENT.slice(0, limit) : VIDEO_CONTENT;

  if (videos.length === 0) {
    return (
      <Container variant="standard" padding="desktop">
        <p className="text-center text-muted-foreground py-12">
          Không có video nào
        </p>
      </Container>
    );
  }

  const mainVideo = videos[0];
  const otherVideos = videos.slice(1);

  const handleVideoClick = (video: VideoContent) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Container variant="standard" padding="desktop">
        {/* Section Header */}
        <SectionHeader
          heading={heading}
          subheading={subheading}
          alignment="center"
        />

        {/* Video Layout */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main Video (Left - Desktop) */}
          <div className="lg:col-span-2">
            <VideoThumbnail
              video={mainVideo}
              onClick={() => handleVideoClick(mainVideo)}
              isMain={true}
            />
          </div>

          {/* Other Videos (Right - Desktop) */}
          {otherVideos.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {otherVideos.map((video) => (
                <VideoThumbnail
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

