import { Card } from '@/components/ui/Card';
import EditVideoForm from '@/components/admin/EditVideoForm';
import type { Video } from '@/lib/types';

async function getVideoById(id: string): Promise<Video> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/videos/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch video');
  return res.json();
}

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: videoId } = await params;

  let video: Video | null = null;
  try {
    video = await getVideoById(videoId);
  } catch (e) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">加载失败: {(e as Error).message}</p>
        </Card>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-gray-500">视频不存在</p>
        </Card>
      </div>
    );
  }

  return <EditVideoForm video={video} videoId={videoId} />;
}
