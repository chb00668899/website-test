import { NextResponse } from 'next/server';
import { AdminPostService } from '@/services/adminPostService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Post } from '@/lib/types';

// 获取文章列表（管理后台）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;

    const result = await AdminPostService.getAllPosts({
      limit,
      offset: (page - 1) * limit,
      status
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// 辅助函数：从标题生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 生成唯一的 slug
function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// 获取所有现有的 slug
async function getAllExistingSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select('slug');
    
    if (error) {
      console.error('[API /posts] Error fetching existing slugs:', error);
      return [];
    }
    
    return data.map((item: { slug: string }) => item.slug);
  } catch (error) {
    console.error('[API /posts] Error fetching existing slugs:', error);
    return [];
  }
}

// 创建新文章
export async function POST(request: Request) {
  try {
    console.log('[API /posts] Received POST request');
    const body = await request.json();
    console.log('[API /posts] Request body:', body);
    const { title, slug, content, category_id, tags, status, author_id }: Partial<Post> = body;

    // 验证必要字段
    if (!title || !content) {
      console.log('[API /posts] Validation failed: missing title or content');
      return NextResponse.json({ error: '标题和内容是必需的' }, { status: 400 });
    }

    // 获取所有现有的 slug
    const existingSlugs = await getAllExistingSlugs();
    
    // 如果没有提供 slug，从标题生成唯一的 slug
    // 如果提供了 slug 但已存在，也生成唯一的 slug
    const finalSlug = generateUniqueSlug(title, existingSlugs);
    console.log('[API /posts] Using slug:', finalSlug);

    // 创建新文章
    console.log('[API /posts] Calling AdminPostService.createPost');
    const post = await AdminPostService.createPost({
      title,
      slug: finalSlug,
      content,
      category_id,
      tags,
      status: status || 'draft',
      author_id,
    });

    console.log('[API /posts] Post created successfully:', post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('[API /posts] Error creating post:', error);
    console.error('[API /posts] Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Failed to create post', details: (error as Error).message }, { status: 500 });
  }
}
