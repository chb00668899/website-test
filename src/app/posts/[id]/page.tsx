import { use } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LikeButton } from '@/components/blog/LikeButton';
import type { Post } from '@/lib/types';

async function getPost(id: string): Promise<Post | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const post = use((async () => await getPost(id))());

  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/posts" className="text-sm text-gray-500 hover:text-gray-900">
            ← 返回列表
          </Link>
        </div>

        {/* Post Header */}
        <article className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
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
            <LikeButton postId={post.id} initialLikeCount={post.view_count || 0} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none prose-lg">
            <div dangerouslySetInnerHTML={{ __html: typeof post.content === 'string' ? post.content : JSON.stringify(post.content) }} />
          </div>
        </article>

        {/* Author Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
              {post.author_id ? post.author_id.slice(0, 2).toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-lg">作者</h3>
              <p className="text-gray-600">这个作者很懒，什么都没留下...</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">评论</h2>
          <Card className="p-6">
            <p className="text-gray-500">评论功能暂未启用</p>
          </Card>
        </div>
      </div>
  );
}
