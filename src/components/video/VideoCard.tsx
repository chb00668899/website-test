'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

function isImageFile(url?: string): boolean {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|svg|bmp|avif)(\?|$)/i.test(url);
}

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: string;
  views: number;
}

export const VideoCard = ({
  id,
  title,
  description,
  thumbnail,
  duration,
  views,
}: VideoCardProps) => {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      {thumbnail && isImageFile(thumbnail) ? (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
            {duration}
          </div>
        </div>
      ) : (
        <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
            {duration}
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>👁️ {views.toLocaleString()} 次播放</span>
        <Link href={`/videos/${id}`} className="text-primary hover:underline">
          立即观看 →
        </Link>
      </CardContent>
    </Card>
  );
};
