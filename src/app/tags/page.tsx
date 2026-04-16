'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/seo/SEO';

// 标签类型
interface Tag {
  tag: string;
  count: number;
}

// 获取标签数据
async function fetchTags() {
  // 从 posts API 获取所有已发布的文章
  const response = await fetch('/api/posts?status=published');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  
  // 统计标签
  const tagCounts: Record<string, number> = {};
  data.posts.forEach((post: { tags: string[] }) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count,
  }));
}

export default function TagsPage() {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  if (isLoading) {
    return (
      <>
        <SEO title="标签列表" />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </>
    );
  }

  // 按使用频率排序
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <>
      <SEO title="标签列表" />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">所有标签</h1>
          <p className="text-gray-600">浏览网站的所有内容标签</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedTags.map((tag) => (
            <Link key={tag.tag} href={`/tags/${encodeURIComponent(tag.tag)}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600">#{tag.tag}</h2>
                  <p className="text-sm text-gray-500">{tag.count} 篇文章</p>
                </div>
                <Badge variant="secondary">{tag.count}</Badge>
              </Card>
            </Link>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无标签</p>
          </div>
        )}
      </div>
    </>
  );
}
