import supabase from '../lib/supabase';
import type { Post, Category } from '../lib/types';

// 博客文章服务层（前端使用，受 RLS 保护）
export class PostService {
  // ========== 前端 API ==========

  // 获取所有已发布的文章列表
  static async getPublishedPosts({
    limit = 10, 
    offset = 0 
  }: { limit?: number; offset?: number } = {}) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching published posts:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 获取文章总数（用于分页）
  static async getPublishedPostsCount() {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (error) {
      console.error('Error counting published posts:', error);
      throw new Error(error.message);
    }

    return count || 0;
  }

  // 根据 ID 获取单篇文章
  static async getPostById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching post by id:', error);
      throw new Error(error.message);
    }

    // 更新浏览次数
    await this.incrementViewCount(data.id);

    return data;
  }

  // 根据 slug 获取单篇文章
  static async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching post by slug:', error);
      throw new Error(error.message);
    }

    // 更新浏览次数
    await this.incrementViewCount(data.id);

    return data;
  }

  // 增加文章浏览次数
  static async incrementViewCount(postId: string) {
    const { error } = await supabase
      .rpc('increment_view_count', { 
        post_id: postId 
      });

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // 获取文章分类
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 根据分类获取文章
  static async getPostsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by category:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 根据标签获取文章
  static async getPostsByTag(tag: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .contains('tags', [tag])
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by tag:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 分页获取文章列表（支持分类过滤）
  static async getPosts({ 
    page = 1, 
    limit = 10, 
    category 
  }: { 
    page?: number; 
    limit?: number; 
    category?: string | null;
  } = {}) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        category_id,
        tags,
        status,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 分类过滤
    if (category) {
      // 使用客户端过滤
      // 注意：如果需要服务端过滤，需要在数据库中添加外键约束
    }

    if (error) {
      console.error('Error fetching posts:', error);
      throw new Error(error.message);
    }

    // 获取总数
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // 如果有分类过滤，需要重新查询
    let filteredData = data;
    if (category) {
      filteredData = data.filter(post => post.category_id === category);
    }

    return {
      posts: filteredData,
      totalCount: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // 获取热门文章（浏览量前 N）
  static async getHotPosts(limit: number = 5) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        author_id,
        view_count,
        like_count,
        share_count,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching hot posts:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 增加文章分享次数
  static async incrementShareCount(postId: string) {
    const { error } = await supabase
      .rpc('increment_share_count', { 
        post_id: postId 
      });

    if (error) {
      console.error('Error incrementing share count:', error);
      throw new Error(error.message);
    }
  }
}

export default PostService;
