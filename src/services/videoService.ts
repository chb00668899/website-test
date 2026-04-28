import supabase from '../lib/supabase';
import type { Video } from '../lib/types';

// 视频服务层
export class VideoService {
  // 获取所有视频（分页）
  static async getVideos({ 
    page = 1, 
    limit = 6
  }: { 
    page?: number; 
    limit?: number 
  } = {}) {
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching videos:', error);
      throw new Error(error.message);
    }

    // 获取总数
    const { count } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });

    return {
      videos: data,
      total: count || 0,
      page,
      limit,
    };
  }

  // 根据 ID 获取视频详情
  static async getVideoById(id: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching video by id:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 增加视频浏览次数
  static async incrementViewCount(videoId: string) {
    const { error } = await supabase
      .rpc('increment_video_view_count', { 
        video_id: videoId 
      });

    if (error) {
      console.error('Error incrementing video view count:', error);
    }
  }

  // 获取热门视频（前N个）
  static async getPopularVideos(limit: number = 5) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular videos:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 获取视频总数
  static async getVideosCount() {
    const { count, error } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting videos:', error);
      throw new Error(error.message);
    }

    return count || 0;
  }

  // 创建新视频
  static async createVideo(videoData: Partial<Video>) {
    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // 更新视频
  static async updateVideo(id: string, videoData: Partial<Video>) {
    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      throw new Error(error.message);
    }

    return data;
  }
}

export default VideoService;
