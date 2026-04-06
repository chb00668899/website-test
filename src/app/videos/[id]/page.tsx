import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoService } from '@/services/videoService';
import type { Video } from '@/lib/types';

interface VideoPageProps {
  params: {
    id: string;
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  let video: Video | null = null;
  let relatedVideos: Video[] = [];

  try {
    video = await VideoService.getVideoById(params.id);
    
    // 获取相关视频（排除当前视频）
    const popularVideos = await VideoService.getPopularVideos(10);
    relatedVideos = popularVideos.filter(v => v.id !== params.id).slice(0, 3);
  } catch (error) {
    console.error('Error fetching video:', error);
    return notFound();
  }

  if (!video) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <VideoPlayer src={video.oss_url} title={video.title} />
          
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <p className="text-lg text-muted-foreground">{video.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>👁️ {video.view_count?.toLocaleString() || 0} 次播放</span>
              <span>⏱️ {video.duration || '00:00'}</span>
              <span>📅 {new Date(video.created_at || '').toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
          
          <div className="mt-6 rounded-lg border p-6">
            <h3 className="mb-3 text-lg font-semibold">视频简介</h3>
            <p className="text-muted-foreground">{video.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-semibold">关于作者</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                JD
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">全栈开发者</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              专注于 Web 开发和技术分享，热爱开源和新技术。
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-semibold">相关视频</h3>
            <div className="space-y-3">
              {relatedVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.id}`}
                  className="flex gap-3 rounded-md p-2 hover:bg-accent"
                >
                  <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={v.thumbnail_url || '/images/video-thumb-default.svg'}
                      alt={v.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="line-clamp-2 text-sm font-medium">
                      {v.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {v.duration || '00:00'} • {v.view_count?.toLocaleString() || 0} 次播放
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
