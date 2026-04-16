'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/seo/SEO';
import { format } from 'date-fns';

// 分类类型
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

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

// 获取分类数据
async function fetchCategoryData(slug: string) {
  // 获取分类信息
  const categoryResponse = await fetch(`/api/categories?slug=${slug}`);
  const categoryData = await categoryResponse.json();
  const category = categoryData.categories?.[0] as Category;

  if (!category) {
    return { category: null, posts: [] };
  }

  // 获取该分类下的文章
  const postsResponse = await fetch(`/api/posts?category_id=${category.id}&status=published`);
  const postsData = await postsResponse.json();
  const posts = postsData.posts as Post[];

  return { category, posts };
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryData(slug),
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

  const { category, posts } = data || {};

  if (!category) {
    return (
      <>
        <SEO title="分类不存在" />
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
            <Link href="/categories" className="text-blue-600 hover:underline">
              返回分类列表
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${category.name} - 分类`}
        description={category.description || `浏览${category.name}分类下的所有内容`}
      />
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/categories" className="flex items-center text-sm text-gray-500 hover:text-blue-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回分类列表
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 text-lg">{category.description || '暂无描述'}</p>
          <div className="mt-4">
            <Badge variant="secondary">{category.slug}</Badge>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">文章列表</h2>

          {posts && posts.length > 0 ? (
            posts.map((post) => (
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
                    {post.tags && post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无文章
            </div>
          )}
        </div>
      </div>
    </>
  );
}
