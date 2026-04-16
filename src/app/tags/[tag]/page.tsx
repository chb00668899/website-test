'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/seo/SEO';
import { format } from 'date-fns';

// 文章类型
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published';
  author_id: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// 获取标签数据
async function fetchTagData(tag: string) {
  // 获取所有已发布的文章
  const response = await fetch('/api/posts?status=published');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  
  // 过滤包含该标签的文章
  const posts = data.posts.filter((post: { tags: string[] }) => 
    post.tags && post.tags.includes(tag)
  );
  
  return { tag, posts };
}

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['tag', tag],
    queryFn: () => fetchTagData(tag),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  if (isLoading) {
    return (
      <>
        <SEO title="加载中..." />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </>
    );
  }

  const { posts } = data || {};

  return (
    <>
      <SEO
        title={`#${tag} - 标签`}
        description={`浏览使用#${tag}标签的所有内容`}
      />
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/tags" className="flex items-center text-sm text-gray-500 hover:text-blue-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回标签列表
          </Link>
        </div>

        {/* Tag Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-blue-600">#{tag}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            共 {posts?.length || 0} 篇文章
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post: Post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">{post.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(post.created_at), 'yyyy-MM-dd')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.view_count} 阅读
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无使用此标签的文章
            </div>
          )}
        </div>
      </div>
    </>
  );
}
