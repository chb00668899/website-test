import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import EditPostForm from '@/components/admin/EditPostForm';
import type { Category, Post } from '@/lib/types';

async function getPostById(id: string): Promise<Post> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.categories;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;

  let post: Post | null = null;
  let categories: Category[] = [];
  try {
    [post, categories] = await Promise.all([
      getPostById(postId),
      getCategories(),
    ]);
  } catch (e) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">加载失败: {(e as Error).message}</p>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-gray-500">文章不存在</p>
        </Card>
      </div>
    );
  }

  return <EditPostForm post={post} categories={categories} postId={postId} />;
}
