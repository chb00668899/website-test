import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VideoService } from '@/services/videoService';
import type { Video } from '@/lib/types';

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let video: Video | null = null;
  let relatedVideos: Video[] = [];

  try {
    video = await VideoService.getVideoById(id);
    // 获取相关视频（排除当前视频）
    const popularVideos = await VideoService.getPopularVideos(10);
    relatedVideos = popularVideos.filter(v => v.id !== id).slice(0, 3);
  } catch (error) {
    console.error('Error fetching video:', error);
    notFound();
  }

  if (!video) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="max-h-[60vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <video src={video.oss_url} controls className="max-w-full max-h-[60vh]" />
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <p className="text-lg text-muted-foreground">{video.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{video.view_count?.toLocaleString() || 0} 次播放</span>
              <span>{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '00:00'}</span>
              <span>{new Date(video.created_at || '').toLocaleDateString('zh-CN')}</span>
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
            <h3 className="mb-3 text-lg font-semibold">相关视频</h3>
            <div className="space-y-3">
              {relatedVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.id}`}
                  className="flex gap-3 rounded-md p-2 hover:bg-accent"
                >
                  <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-gray-100" />
                  <div className="flex flex-col justify-between">
                    <div className="line-clamp-2 text-sm font-medium">
                      {v.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {v.view_count?.toLocaleString() || 0} 次播放
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
