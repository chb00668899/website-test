'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
}

export const VideoPlayer = ({ src, title, poster }: VideoPlayerProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full bg-black">
        <video
          className="h-full w-full"
          controls
          poster={poster}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-white font-medium">
          {title}
        </div>
      </div>
    </Card>
  );
};
