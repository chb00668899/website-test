'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { Video } from '@/lib/types';

export default function NewVideoPage() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ossUrl, setOssUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !ossUrl.trim()) {
      alert('请填写必填字段（标题和视频 URL）');
      return;
    }

    if (!user) {
      alert('请先登录');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const newVideo: Partial<Video> = {
        title,
        description,
        oss_url: ossUrl,
        thumbnail_url: thumbnailUrl || ossUrl,
        duration: duration ? parseInt(duration) : 0,
        status,
        author_id: user.id,
        view_count: 0,
      };

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '创建失败');
      }

      router.push('/admin/videos');
      router.refresh();
    } catch (error) {
      console.error('Error creating video:', error);
      alert('创建视频失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">上传新视频</h1>
          <p className="text-gray-500 mt-1">添加新的视频内容</p>
        </div>
        <Button asChild>
          <Link href="/admin/videos">返回列表</Link>
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
              {isLoading ? '发布中...' : '发布视频'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
