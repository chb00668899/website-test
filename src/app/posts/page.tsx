'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PostService } from '@/services/postService';
import type { Post } from '@/lib/types';

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page, category],
    queryFn: () => PostService.getPosts({ page, limit, category })
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">加载失败</h2>
          <p className="text-gray-500">请稍后重试</p>
        </Card>
      </div>
    );
  }

  const posts = data?.posts || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">博客文章</h1>
        <p className="text-gray-600">分享技术心得与生活感悟</p>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value || null)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">全部分类</option>
          <option value="technology">技术分享</option>
          <option value="life">生活感悟</option>
        </select>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">暂无文章</h2>
          <p className="text-gray-500">敬请期待...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard 
              key={post.id} 
              id={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.content && typeof post.content === 'string' ? post.content : ''}
              date={post.created_at}
              category={post.category_id || ''}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="text-gray-600">
            第 {page} / {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
