'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import type { Category, Post } from '@/lib/types';

export default function EditPostForm({ post, categories, postId }: { post: Post; categories: Category[]; postId: string }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content as string);
  const [status, setStatus] = useState<'published' | 'draft'>(post.status as 'published' | 'draft');
  const [categoryId, setCategoryId] = useState(post.category_id || '');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = () => {
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(slug);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('请填写必填字段');
      return;
    }

    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          status,
          category_id: categoryId || null,
          tags,
          author_id: post.author_id,
          view_count: post.view_count || 0,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '更新失败');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('更新文章失败');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">编辑文章</h1>
          <p className="text-gray-500 mt-1">修改您的博客文章</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts">返回列表</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">文章内容</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">标题</label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) {
                        generateSlug();
                      }
                    }}
                    placeholder="输入文章标题"
                    className="font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="输入文章 slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">内容</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="输入文章内容（支持 Markdown）"
                    className="min-h-75 font-mono text-sm"
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

                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="输入标签后按回车"
                      />
                      <Button type="button" onClick={addTag}>添加</Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
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
                  <strong>Slug:</strong> {slug || '未填写'}
                </div>
                <div>
                  <strong>状态:</strong> {status === 'published' ? '已发布' : '草稿'}
                </div>
                <div>
                  <strong>分类:</strong> {categories.find(c => c.id === categoryId)?.name || '未选择'}
                </div>
                <div>
                  <strong>标签:</strong> {tags.length > 0 ? tags.join(', ') : '无'}
                </div>
                <div>
                  <strong>字数:</strong> {content.length}
                </div>
              </div>
            </Card>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? '保存中...' : '保存文章'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
