import supabase from '../lib/supabase';
import type { Comment } from '../lib/types';

// 评论服务层
export class CommentService {
  // 获取文章的所有评论
  static async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        author_id,
        created_at
      `)
      .eq('post_id', postId)
      .eq('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw new Error(error.message);
    }

    // 获取回复
    const commentsWithReplies = await Promise.all(
      data.map(async (comment) => {
        const { data: replies, error: repliesError } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            author_id,
            created_at
          `)
          .eq('parent_comment_id', comment.id)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
          return comment;
        }

        return {
          ...comment,
          replies: replies || []
        };
      })
    );

    return commentsWithReplies;
  }

  // 创建评论
  static async createComment(commentData: {
    post_id: string;
    parent_comment_id?: string;
    content: string;
    author_id: string;
  }) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 删除评论
  static async deleteComment(commentId: string, userId: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', userId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw new Error(error.message);
    }

    return true;
  }

  // 更新评论
  static async updateComment(commentId: string, content: string, userId: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('author_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      throw new Error(error.message);
    }

    return data;
  }
}

export default CommentService;
