import supabase from '../lib/supabase';
import type { Post } from '../lib/types';

// 点赞服务层
export class LikeService {
  // 获取文章的点赞数
  static async getPostLikes(postId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('like_count', { count: 'exact', head: true })
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post likes:', error);
      throw new Error(error.message);
    }

    // 返回点赞数，如果没有则返回0
    return data?.like_count || 0;
  }

  // 获取用户对文章的点赞状态
  static async getUserLikeStatus(postId: string, userId: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return null;
    }

    const { data, error } = await supabase
      .from('post_likes')
      .select('id, is_liked')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error) {
      // 如果没有找到记录，返回空状态
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user like status:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 切换点赞状态
  static async toggleLike(postId: string, userId: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log(`[DEV] Toggle like for post: ${postId}, user: ${userId}`);
      const currentCount = Math.floor(Math.random() * 100);
      return { liked: true, likeCount: currentCount };
    }

    // 首先检查是否已经点过赞
    const { data: existingLike, error: fetchError } = await supabase
      .from('post_likes')
      .select('id, is_liked')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing like:', fetchError);
      throw new Error(fetchError.message);
    }

    if (existingLike) {
      // 如果已经点过赞，取消点赞
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        throw new Error(deleteError.message);
      }

      // 减少点赞数
      await this.decrementLikeCount(postId);

      return { liked: false, likeCount: await this.getPostLikes(postId) };
    } else {
      // 如果没点过赞，添加点赞
      const { data, error } = await supabase
        .from('post_likes')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            is_liked: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating like:', error);
        throw new Error(error.message);
      }

      // 增加点赞数
      await this.incrementLikeCount(postId);

      return { liked: true, likeCount: await this.getPostLikes(postId) };
    }
  }

  // 增加文章点赞数
  static async incrementLikeCount(postId: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log(`[DEV] Incrementing like count for post: ${postId}`);
      return;
    }

    const { error } = await supabase.rpc('increment_like_count', { post_id: postId });

    if (error) {
      console.error('Error incrementing like count:', error);
      throw new Error(error.message);
    }
  }

  // 减少文章点赞数
  static async decrementLikeCount(postId: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log(`[DEV] Decrementing like count for post: ${postId}`);
      return;
    }

    const { error } = await supabase.rpc('decrement_like_count', { post_id: postId });

    if (error) {
      console.error('Error decrementing like count:', error);
      throw new Error(error.message);
    }
  }
}

export default LikeService;
