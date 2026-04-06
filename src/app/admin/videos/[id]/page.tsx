'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { VideoService } from '@/services/videoService';
import type { Video } from '@/lib/types';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ossUrl, setOssUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [isLoading, setIsLoading] = useState(true);

  // 获取视频详情
  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      return await VideoService.getVideoById(videoId);
    },
    enabled: !!videoId,
  });

  // 当视频数据加载完成时填充表单
  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || '');
      setOssUrl(video.oss_url);
      setThumbnailUrl(video.thumbnail_url);
      setDuration(video.duration ? video.duration.toString() : '');
      setStatus(video.status as 'published' | 'draft');
      setIsLoading(false);
    }
  }, [video]);

  const updateMutation = useMutation({
    mutationFn: async (updatedVideo: Partial<Video>) => {
      return await VideoService.updateVideo(videoId, updatedVideo);
    },
    onSuccess: () => {
      router.push('/admin/videos');
      router.refresh();
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      alert('更新视频失败');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !ossUrl.trim()) {
      alert('请填写必填字段（标题和视频 URL）');
      return;
    }

    setIsLoading(true);
    try {
      const updatedVideo: Partial<Video> = {
        id: videoId,
        title,
        description,
        oss_url: ossUrl,
        thumbnail_url: thumbnailUrl || ossUrl,
        duration: duration ? parseInt(duration) : 0,
        status,
        view_count: video?.view_count || 0,
        created_at: video?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await updateMutation.mutateAsync(updatedVideo);
    } catch (error) {
      console.error('Error updating video:', error);
      alert('更新视频失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || videoLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">编辑视频</h1>
          <p className="text-gray-500 mt-1">修改您的视频内容</p>
        </div>
        <Button asChild>
          <a href="/admin/videos">返回列表</a>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">视频信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">标题</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入视频标题"
                    className="font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">视频 URL</label>
                  <Input
                    value={ossUrl}
                    onChange={(e) => setOssUrl(e.target.value)}
                    placeholder="输入视频文件 URL（OSS 地址）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">封面 URL</label>
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="输入封面图片 URL（可选，默认使用视频第一帧）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">时长（秒）</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="输入视频时长（秒）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">描述</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="输入视频描述"
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">设置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">状态</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === 'published'}
                        onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      />
                      已发布
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === 'draft'}
                        onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      />
                      草稿
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">预览</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>标题:</strong> {title || '未填写'}
                </div>
                <div>
                  <strong>视频 URL:</strong> {ossUrl || '未填写'}
                </div>
                <div>
                  <strong>时长:</strong> {duration ? `${Math.floor(parseInt(duration) / 60)}:${(parseInt(duration) % 60).toString().padStart(2, '0')}` : '00:00'}
                </div>
                <div>
                  <strong>状态:</strong> {status === 'published' ? '已发布' : '草稿'}
                </div>
              </div>

              {ossUrl && (
                <div className="mt-4">
                  <strong className="text-sm">预览:</strong>
                  <div className="mt-2 rounded overflow-hidden">
                    <video
                      src={ossUrl}
                      controls
                      className="w-full rounded"
                    />
                  </div>
                </div>
              )}
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存视频'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
