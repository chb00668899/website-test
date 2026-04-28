import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import DeleteVideoButton from '@/components/admin/DeleteVideoButton';
import type { Video } from '@/lib/types';

async function getVideos(status?: string): Promise<{ videos: Video[]; count: number }> {
  const params = new URLSearchParams({ page: '1', limit: '100' });
  if (status) params.set('status', status);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/videos?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = statusParam === 'published' || statusParam === 'draft' ? statusParam : 'all';

  let result: { videos: Video[]; count: number } | null = null;
  let error: Error | null = null;
  try {
    result = await getVideos(statusFilter === 'all' ? undefined : statusFilter);
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">加载失败: {error.message}</p>
          <Button asChild className="mt-4">
            <Link href="/admin/videos">重试</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const videos = result?.videos || [];

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">视频管理</h1>
          <p className="text-gray-500 mt-1">管理您的视频内容</p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">上传新视频</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 flex flex-wrap gap-4 items-center">
        {['all', 'published', 'draft'].map((filter) => {
          const label = filter === 'all' ? '全部状态' : filter === 'published' ? '已发布' : '草稿';
          const href = filter === 'all' ? '/admin/videos' : `/admin/videos?status=${filter}`;
          const isActive = statusFilter === filter;
          return (
            <Link
              key={filter}
              href={href}
              className={`px-3 py-2 border rounded-md text-sm ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-background hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          );
        })}
        <span className="text-sm text-gray-500">
          共 {videos.length} 个视频
        </span>
      </Card>

      {/* Videos List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">暂无视频</p>
          </Card>
        ) : (
          videos.map((video: Video) => (
            <Card key={video.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/admin/videos/${video.id}`} className="hover:text-blue-600">
                      {video.title}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(video.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {video.view_count || 0} 次播放
                    </span>
                    {video.duration != null && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(video.duration)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/videos/${video.id}`}>编辑</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/videos/${video.id}`} target="_blank">预览</Link>
                    </Button>
                    <DeleteVideoButton videoId={video.id} />
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
