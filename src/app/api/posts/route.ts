import { NextRequest, NextResponse } from 'next/server';
import { AdminPostService } from '@/services/adminPostService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Post } from '@/lib/types';

/**
 * 从请求 cookie 中获取当前登录用户信息
 * 注意：登录 API 设置了两个独立 cookie：
 *   sb-{projectRef}-auth-token (access_token)
 *   sb-{projectRef}-auth-refresh-token (refresh_token)
 * 所以需要直接读取这些 cookie，而不是通过 createServerClient
 */
async function getCurrentUser(request: NextRequest): Promise<{ id: string; email: string } | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    if (!supabaseUrl) {
      console.error('[getCurrentUser] Missing Supabase config');
      return null;
    }

    // 从 URL 提取 projectRef
    const projectRef = supabaseUrl.split('.')[0].split('://')[1];
    const accessTokenCookieName = `sb-${projectRef}-auth-token`;

    // 直接读取 access_token cookie
    const accessTokenCookie = request.cookies.get(accessTokenCookieName);
    if (!accessTokenCookie) {
      console.log('[getCurrentUser] No auth token cookie found. Expected:', accessTokenCookieName);
      const allCookies = request.cookies.getAll();
      console.log('[getCurrentUser] Available cookies:', allCookies.map(c => c.name));
      return null;
    }

    // 使用 access_token 获取用户信息
    const { data: { user }, error } = await supabaseAdmin.client.auth.getUser(accessTokenCookie.value);

    if (error || !user) {
      console.log('[getCurrentUser] Invalid/expired token:', error?.message);
      return null;
    }

    console.log('[getCurrentUser] User authenticated:', user.id, user.email);
    return { id: user.id, email: user.email || '' };
  } catch (error) {
    console.error('[getCurrentUser] Error getting user:', error);
    return null;
  }
}

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
    .replace(/[^\w一-龥-]+/g, '-')
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

    return data
      .map((item: { slug: string }) => item.slug)
      .filter(Boolean);
  } catch (error) {
    console.error('[API /posts] Error fetching existing slugs:', error);
    return [];
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    console.log('[API /posts] Received POST request');

    // 从 cookie 获取当前用户
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: '未登录，请先登录' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[API /posts] Request body:', body);
    const { title, slug, content, category_id, tags, status }: Partial<Post> = body;

    // 验证必要字段
    if (!title || !content) {
      console.log('[API /posts] Validation failed: missing title or content');
      return NextResponse.json({ error: '标题和内容是必需的' }, { status: 400 });
    }

    // 将空字符串转为 null，避免 UUID 格式错误
    const finalCategoryId = category_id === '' ? null : category_id;

    // 获取所有现有的 slug（用于确保 slug 唯一）
    const existingSlugs = await getAllExistingSlugs();

    // 如果没有提供 slug，从标题生成
    // 如果提供了 slug，也要检查是否已存在并添加后缀
    let finalSlug: string;
    if (slug) {
      finalSlug = generateUniqueSlug(slug, existingSlugs);
    } else {
      finalSlug = generateUniqueSlug(title, existingSlugs);
    }
    console.log('[API /posts] Slug determined:', finalSlug);

    // 创建新文章，使用当前用户 ID 作为 author_id
    console.log('[API /posts] Calling AdminPostService.createPost with user:', currentUser.id);
    const post = await AdminPostService.createPost({
      title,
      slug: finalSlug,
      content,
      category_id: finalCategoryId,
      tags,
      status: status || 'draft',
      author_id: currentUser.id, // 使用当前登录用户 ID
    });

    console.log('[API /posts] Post created successfully:', post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('[API /posts] Error creating post:', error);
    console.error('[API /posts] Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Failed to create post', details: (error as Error).message }, { status: 500 });
  }
}
