import { supabaseAdmin } from '../lib/supabaseAdmin';
import type { Post, Category } from '../lib/types';

// 管理员博客文章服务层（仅在服务器端使用）
export class AdminPostService {
  // ========== 管理后台 API ==========

  // 获取所有文章（包括草稿和已发布）
  static async getAllPosts({ 
    limit = 10, 
    offset = 0,
    status = undefined
  }: { limit?: number; offset?: number; status?: string } = {}) {
    let query = supabaseAdmin.client
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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all posts:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 根据 ID 获取文章（用于编辑）
  static async getPostById(id: string) {
    const { data, error } = await supabaseAdmin.client
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
      .single();

    if (error) {
      console.error('Error fetching post by id:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 创建新文章
  static async createPost(postData: Partial<Post>) {
    console.log('[AdminPostService] Creating post with data:', postData);
    
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('[AdminPostService] Error creating post:', error);
      console.error('[AdminPostService] Error details:', JSON.stringify(error, null, 2));
      throw new Error(error.message);
    }

    console.log('[AdminPostService] Post created successfully:', data);
    return data;
  }

  // 更新文章
  static async updatePost(id: string, postData: Partial<Post>) {
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 删除文章
  static async deletePost(id: string) {
    const { error } = await supabaseAdmin.client
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      throw new Error(error.message);
    }
  }

  // 获取所有分类
  static async getAllCategories() {
    const { data, error } = await supabaseAdmin.client
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all categories:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 创建分类
  static async createCategory(categoryData: Partial<Category>) {
    const { data, error } = await supabaseAdmin.client
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 获取所有标签
  static async getAllTags() {
    // TODO: 从数据库获取标签
    return [];
  }

  // 获取最近文章（用于仪表板）
  static async getRecentPosts(limit: number = 10) {
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select(`
        id,
        title,
        view_count,
        like_count,
        created_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent posts:', error);
      throw new Error(error.message);
    }

    return data;
  }
}

export default AdminPostService;
