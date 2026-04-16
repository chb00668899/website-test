import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Post, Category, Tag, Comment, Video } from './types';

/**
 * Supabase 管理客户端
 * 用于服务器端的管理员操作，具有完整的数据库访问权限
 */
class SupabaseAdmin {
  private _client: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (!this._client) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '';

      // 检查配置
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('[SupabaseAdmin] Supabase 配置缺失:');
        console.error('  - SUPABASE_URL:', process.env.SUPABASE_URL ? '已设置' : '未设置');
        console.error('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置');
        console.error('  - SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '已设置' : '未设置');
        console.error('  - NEXT_PUBLIC_SUPABASE_SERVICE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY ? '已设置' : '未设置');
        throw new Error('Supabase 配置缺失');
      }

      console.log('[SupabaseAdmin] 创建客户端，URL:', supabaseUrl);
      // 创建 Supabase 管理客户端
      // 注意：Supabase 的服务端密钥会自动绕过 RLS，需要设置 auth 选项防止继承前端上下文
      this._client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      });
    }

    return this._client;
  }

  constructor() {
    // 延迟初始化客户端
  }

  /**
   * 获取所有文章（管理员功能）
   */
  async getPosts({ 
    limit = 10, 
    offset = 0,
    status = undefined 
  }: { 
    limit?: number; 
    offset?: number; 
    status?: 'draft' | 'published' | undefined 
  } = {}) {
    let query = this.client
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
        created_at,
        updated_at,
        users:name, email, avatar_url
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 如果指定了状态，则添加过滤条件
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[SupabaseAdmin] 获取文章列表失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 获取文章总数（管理员功能）
   */
  async getPostsCount(status?: 'draft' | 'published') {
    let query = this.client.from('posts').select('*', { count: 'exact', head: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;

    if (error) {
      console.error('[SupabaseAdmin] 获取文章总数失败:', error);
      throw new Error(error.message);
    }

    return count || 0;
  }

  /**
   * 根据 ID 获取单篇文章（管理员功能）
   */
  async getPostById(postId: string) {
    const { data, error } = await this.client
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
        created_at,
        updated_at
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 获取文章失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 创建新文章（管理员功能）
   */
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'view_count'>) {
    const { data, error } = await this.client
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 创建文章失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 更新文章（管理员功能）
   */
  async updatePost(postId: string, postData: Partial<Post>) {
    const { data, error } = await this.client
      .from('posts')
      .update(postData)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 更新文章失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 删除文章（管理员功能）
   */
  async deletePost(postId: string) {
    const { error } = await this.client
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('[SupabaseAdmin] 删除文章失败:', error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * 获取所有分类（管理员功能）
   */
  async getCategories() {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('[SupabaseAdmin] 获取分类列表失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 创建新分类（管理员功能）
   */
  async createCategory(categoryData: Omit<Category, 'id'>) {
    const { data, error } = await this.client
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 创建分类失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 更新分类（管理员功能）
   */
  async updateCategory(categoryId: string, categoryData: Partial<Category>) {
    const { data, error } = await this.client
      .from('categories')
      .update(categoryData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 更新分类失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 删除分类（管理员功能）
   */
  async deleteCategory(categoryId: string) {
    const { error } = await this.client
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('[SupabaseAdmin] 删除分类失败:', error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * 获取所有标签（管理员功能）
   */
  async getTags() {
    const { data, error } = await this.client
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('[SupabaseAdmin] 获取标签列表失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 创建新标签（管理员功能）
   */
  async createTag(tagData: Omit<Tag, 'id'>) {
    const { data, error } = await this.client
      .from('tags')
      .insert([tagData])
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 创建标签失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 删除标签（管理员功能）
   */
  async deleteTag(tagId: string) {
    const { error } = await this.client
      .from('tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      console.error('[SupabaseAdmin] 删除标签失败:', error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * 获取所有评论（管理员功能）
   */
  async getComments({ 
    limit = 10, 
    offset = 0 
  }: { 
    limit?: number; 
    offset?: number 
  } = {}) {
    const { data, error } = await this.client
      .from('comments')
      .select(`
        id,
        content,
        post_id,
        author_id,
        parent_id,
        created_at,
        updated_at,
        users:name, email, avatar_url,
        posts:title
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[SupabaseAdmin] 获取评论列表失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 获取评论总数（管理员功能）
   */
  async getCommentsCount() {
    const { count, error } = await this.client
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[SupabaseAdmin] 获取评论总数失败:', error);
      throw new Error(error.message);
    }

    return count || 0;
  }

  /**
   * 删除评论（管理员功能）
   */
  async deleteComment(commentId: string) {
    const { error } = await this.client
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('[SupabaseAdmin] 删除评论失败:', error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * 获取所有视频（管理员功能）
   */
  async getVideos({ 
    limit = 10, 
    offset = 0 
  }: { 
    limit?: number; 
    offset?: number 
  } = {}) {
    const { data, error } = await this.client
      .from('videos')
      .select(`
        id,
        title,
        description,
        oss_url,
        thumbnail_url,
        duration,
        view_count,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[SupabaseAdmin] 获取视频列表失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 获取视频总数（管理员功能）
   */
  async getVideosCount() {
    const { count, error } = await this.client
      .from('videos')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[SupabaseAdmin] 获取视频总数失败:', error);
      throw new Error(error.message);
    }

    return count || 0;
  }

  /**
   * 根据 ID 获取单个视频（管理员功能）
   */
  async getVideoById(videoId: string) {
    const { data, error } = await this.client
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 获取视频失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 创建新视频（管理员功能）
   */
  async createVideo(videoData: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'view_count'>) {
    const { data, error } = await this.client
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 创建视频失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 更新视频（管理员功能）
   */
  async updateVideo(videoId: string, videoData: Partial<Video>) {
    const { data, error } = await this.client
      .from('videos')
      .update(videoData)
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAdmin] 更新视频失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 删除视频（管理员功能）
   */
  async deleteVideo(videoId: string) {
    const { error } = await this.client
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      console.error('[SupabaseAdmin] 删除视频失败:', error);
      throw new Error(error.message);
    }

    return true;
  }
}

// 导出单例实例
export const supabaseAdmin = new SupabaseAdmin();

export default SupabaseAdmin;
