'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { PostService } from '@/services/postService';
import type { Category, Post } from '@/lib/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取文章详情
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      // 尝试通过 ID 获取
      try {
        return await PostService.getPostById(postId);
      } catch (error) {
        // 如果失败，尝试通过 slug 获取（兼容旧数据）
        return await PostService.getPostBySlug(postId);
      }
    },
    enabled: !!postId,
  });

  // 获取分类列表
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await PostService.getCategories();
      setCategories(categories);
      return categories;
    }
  });

  // 当文章数据加载完成时填充表单
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content as string);
      setStatus(post.status as 'published' | 'draft');
      setCategoryId(post.category_id || '');
      setTags(post.tags || []);
      setIsLoading(false);
    }
  }, [post]);

  const generateSlug = () => {
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
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

  const updateMutation = useMutation({
    mutationFn: async (updatedPost: Partial<Post>) => {
      return await PostService.updatePost(postId, updatedPost);
    },
    onSuccess: () => {
      router.push('/admin/posts');
      router.refresh();
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      alert('更新文章失败');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('请填写必填字段');
      return;
    }

    setIsLoading(true);
    try {
      const updatedPost = {
        id: postId,
        title,
        slug,
        content,
        status,
        category_id: categoryId,
        tags,
        author_id: '1',
        view_count: post?.view_count || 0,
        created_at: post?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await updateMutation.mutateAsync(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('更新文章失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || postLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">编辑文章</h1>
          <p className="text-gray-500 mt-1">修改您的博客文章</p>
        </div>
        <Button asChild>
          <a href="/admin/posts">返回列表</a>
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
                    className="min-h-[300px] font-mono text-sm"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存文章'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
