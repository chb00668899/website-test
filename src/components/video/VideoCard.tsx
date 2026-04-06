'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

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
      {thumbnail && (
        <div className="relative h-48 w-full overflow-hidden">
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
