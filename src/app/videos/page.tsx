'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VideoService } from '@/services/videoService';
import type { Video } from '@/lib/types';

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', page, search],
    queryFn: () => VideoService.getVideos({ page, limit, search })
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">加载失败</h2>
          <p className="text-gray-500">请稍后重试</p>
        </Card>
      </div>
    );
  }

  const videos = data?.videos || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">视频专栏</h1>
        <p className="mb-8 max-w-2xl mx-auto text-xl text-muted-foreground">
          分享前端开发、技术栈和开发经验的视频教程
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="搜索视频..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={() => setPage(1)}>搜索</Button>
        </div>
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <Card className="p-6 text-center mb-8">
          <h2 className="text-xl font-bold mb-2">暂无视频</h2>
          <p className="text-gray-500">敬请期待...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              id={video.id}
              title={video.title}
              description={video.description}
              thumbnail={video.thumbnail_url}
              duration={video.duration}
              views={video.view_count}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {page > 1 && (
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              上一页
            </Button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="outline"
              className={p === page ? "bg-accent" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          {page < totalPages && (
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              下一页
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
