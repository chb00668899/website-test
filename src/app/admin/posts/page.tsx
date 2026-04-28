import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import DeletePostButton from '@/components/admin/DeletePostButton';
import type { Post } from '@/lib/types';

async function getPosts(status?: string): Promise<Post[]> {
  const params = new URLSearchParams({ limit: '100' });
  if (status) params.set('status', status);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = statusParam === 'published' || statusParam === 'draft' ? statusParam : 'all';

  let posts: Post[] = [];
  let error: Error | null = null;
  try {
    posts = await getPosts(statusFilter === 'all' ? undefined : statusFilter);
  } catch (e) {
    error = e as Error;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">已发布</Badge>;
      case 'draft':
        return <Badge variant="secondary">草稿</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">加载失败: {error.message}</p>
          <Button asChild className="mt-4">
            <Link href="/admin/posts">重试</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">博客管理</h1>
          <p className="text-gray-500 mt-1">管理您的博客文章</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">创建新文章</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 flex flex-wrap gap-4 items-center">
        {['all', 'published', 'draft'].map((filter) => {
          const label = filter === 'all' ? '全部状态' : filter === 'published' ? '已发布' : '草稿';
          const href = filter === 'all' ? '/admin/posts' : `/admin/posts?status=${filter}`;
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
          共 {posts.length} 篇文章
        </span>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">暂无文章</p>
          </Card>
        ) : (
          posts.map((post: Post) => (
            <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/admin/posts/${post.id}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.view_count} 阅读
                    </span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(post.status)}
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/posts/${post.id}`}>编辑</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/posts/${post.id}`} target="_blank">预览</Link>
                    </Button>
                    <DeletePostButton postId={post.id} />
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
