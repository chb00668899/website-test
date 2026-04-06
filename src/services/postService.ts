import supabase from '../lib/supabase';
import type { Post, Category } from '../lib/types';

// 开发模式假数据
const mockPosts: (Post & { content: string })[] = [
  {
    id: '1',
    title: '欢迎来到我的博客',
    slug: 'welcome-to-my-blog',
    content: '这是一篇示例博客文章。',
    category_id: '1',
    tags: ['示例', '欢迎'],
    status: 'published',
    author_id: '1',
    view_count: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Next.js 14 入门指南',
    slug: 'nextjs-14-getting-started',
    content: '本文介绍 Next.js 14 的基本使用方法。',
    category_id: '1',
    tags: ['Next.js', 'React', '教程'],
    status: 'published',
    author_id: '1',
    view_count: 250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'TypeScript 高级教程',
    slug: 'typescript-advanced-tutorial',
    content: '深入理解 TypeScript 的高级特性。',
    category_id: '1',
    tags: ['TypeScript', 'JavaScript', '教程'],
    status: 'published',
    author_id: '1',
    view_count: 180,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockCategories: Category[] = [
  { id: '1', name: '技术', slug: 'tech', description: '技术相关文章' },
  { id: '2', name: '生活', slug: 'life', description: '生活相关文章' },
];

// 博客文章服务层
export class PostService {
  // ========== 管理后台 API ==========

  // 获取所有文章（包括草稿和已发布）
  static async getAllPosts({ 
    limit = 10, 
    offset = 0,
    status = undefined
  }: { limit?: number; offset?: number; status?: string } = {}) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const allPosts = mockPosts;
      const filteredPosts = status ? allPosts.filter(post => post.status === status) : allPosts;
      return filteredPosts.slice(offset, offset + limit);
    }

    let query = supabase
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
        users:name, avatar_url
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const post = mockPosts.find(p => p.id === id);
      return post || null;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[DEV] Creating post:', postData);
      return postData as Post;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 更新文章
  static async updatePost(id: string, postData: Partial<Post>) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[DEV] Updating post:', id, postData);
      return postData as Post;
    }

    const { data, error } = await supabase
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[DEV] Deleting post:', id);
      return;
    }

    const { error } = await supabase
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockCategories;
    }

    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const allTags = new Set<string>();
      mockPosts.forEach(post => post.tags?.forEach(tag => allTags.add(tag)));
      return Array.from(allTags);
    }

    // TODO: 从数据库获取标签
    return [];
  }

  // ========== 前端 API ==========

  // 获取所有已发布的文章列表
  static async getPublishedPosts({
    limit = 10, 
    offset = 0 
  }: { limit?: number; offset?: number } = {}) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const publishedPosts = mockPosts.filter(post => post.status === 'published');
      return publishedPosts.slice(offset, offset + limit);
    }

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
        created_at,
        updated_at,
        users:name, avatar_url
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockPosts.filter(post => post.status === 'published').length;
    }

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

  // 根据 slug 获取单篇文章
  static async getPostBySlug(slug: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const post = mockPosts.find(p => p.slug === slug);
      if (post) {
        // 更新浏览次数
        await this.incrementViewCount(post.id);
        return post;
      }
      return null;
    }

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
        created_at,
        updated_at,
        users:name, avatar_url
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log(`[DEV] Incrementing view count for post: ${postId}`);
      return;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockCategories;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockPosts.filter(post => post.category_id === categoryId);
    }

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
        created_at,
        updated_at,
        users:name, avatar_url
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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockPosts.filter(post => post.tags.includes(tag));
    }

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
        created_at,
        updated_at,
        users:name, avatar_url
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

  // 分页获取文章列表（支持搜索和分类过滤）
  async getPosts({ 
    page = 1, 
    limit = 10, 
    search = '', 
    category 
  }: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string | null;
  } = {}) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      let filteredPosts = mockPosts.filter(post => post.status === 'published');
      
      // 搜索过滤
      if (search) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
        );
      }

      // 分类过滤
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category_id === category);
      }

      const offset = (page - 1) * limit;
      const totalCount = filteredPosts.length;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        posts: filteredPosts.slice(offset, offset + limit),
        totalCount,
        page,
        limit,
        totalPages
      };
    }

    const offset = (page - 1) * limit;
    
    let query = supabase
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
        users:name, avatar_url
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 搜索过滤
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 分类过滤
    if (category) {
      query = query.eq('category_id', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      throw new Error(error.message);
    }

    // 获取总数
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    return {
      posts: data,
      totalCount: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // 获取热门文章（浏览量前 N）
  static async getHotPosts(limit: number = 5) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, limit);
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        author_id,
        view_count,
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
}

export const postService = new PostService();

export default PostService;
