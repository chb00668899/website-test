'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { postService, PostService } from '@/services/postService';
import { CommentService } from '@/services/commentService';
import type { Post } from '@/lib/types';
import { CommentList } from '@/components/blog/CommentList';
import { CommentForm } from '@/components/blog/CommentForm';

// 获取所有文章以生成导航链接
async function getAllPosts() {
  try {
    const posts = await postService.getPosts({ limit: 100, page: 1 });
    return posts.posts || [];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => PostService.getPostById(id)
  });

  // 获取评论
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => CommentService.getComments(post?.id || ''),
    enabled: !!post?.id
  });

  const { data: allPosts } = useQuery({
    queryKey: ['allPosts'],
    queryFn: getAllPosts,
    staleTime: 5 * 60 * 1000 // 5分钟缓存
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

  if (error || !post) {
    return notFound();
  }

  // 获取上一篇和下一篇
  const posts = allPosts || [];
  const currentPostIndex = posts.findIndex((p: Post) => p.id === id);
  const prevPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : null;
  const nextPost = currentPostIndex < posts.length - 1 ? posts[currentPostIndex + 1] : null;

  // 解析 Markdown 内容（简化版）
  const renderContent = (content: string | object) => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← 返回列表
        </Button>
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
          <div dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
        </div>
      </article>

      {/* Post Navigation */}
      {(prevPost || nextPost) && (
        <div className="flex justify-between items-center border-t pt-6 mb-12">
          {prevPost ? (
            <Link href={`/posts/${prevPost.id}`} className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">上一篇</span>
              <span className="font-semibold text-blue-600">{prevPost.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link href={`/posts/${nextPost.id}`} className="flex flex-col text-right">
              <span className="text-sm text-gray-500 mb-1">下一篇</span>
              <span className="font-semibold text-blue-600">{nextPost.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

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
        
        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm 
            postId={post.id} 
            onSubmit={async (content) => {
              try {
                await CommentService.createComment({
                  post_id: post.id,
                  content,
                  author_id: '1' // TODO: 从用户认证获取
                });
                // 刷新评论列表
                // TODO: 需要通过 React Query Context 获取 queryClient
              } catch (error) {
                console.error('Error creating comment:', error);
                alert('评论失败');
              }
            }}
            placeholder="发表你的看法..."
          />
        </div>

        {/* Comment List */}
        <Card className="p-6">
          <CommentList 
            postId={post.id}
            comments={comments?.map((comment: { id: string; content: string; author_id: string; users?: { name?: string; avatar_url?: string }[]; created_at: string; replies?: Array<{ id: string; content: string; author_id: string; users?: { name?: string; avatar_url?: string }[]; created_at: string }> }) => ({
              id: comment.id,
              content: comment.content,
              author_id: comment.author_id,
              author_name: comment.users?.[0]?.name,
              author_avatar: comment.users?.[0]?.avatar_url,
              created_at: comment.created_at,
              replies: comment.replies?.map((reply: { id: string; content: string; author_id: string; users?: { name?: string; avatar_url?: string }[]; created_at: string }) => ({
                id: reply.id,
                content: reply.content,
                author_id: reply.author_id,
                author_name: reply.users?.[0]?.name,
                author_avatar: reply.users?.[0]?.avatar_url,
                created_at: reply.created_at
              }))
            })) || []} 
            onReply={async (parentId, content) => {
              try {
                await CommentService.createComment({
                  post_id: post.id,
                  parent_comment_id: parentId,
                  content,
                  author_id: '1' // TODO: 从用户认证获取
                });
                // 刷新评论列表
                // TODO: 需要通过 React Query Context 获取 queryClient
              } catch (error) {
                console.error('Error creating reply:', error);
                alert('回复失败');
              }
            }}
          />
        </Card>
      </div>
    </div>
  );
}
