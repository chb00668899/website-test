import supabase from '../lib/supabase';
import type { Video } from '../lib/types';

// 开发模式假数据
const mockVideos: Video[] = [
  {
    id: '1',
    title: '欢迎观看我们的视频',
    description: '这是一个示例视频，用于演示视频功能。',
    oss_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://example.com/thumbnail1.jpg',
    duration: 120,
    view_count: 500,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Next.js 教程',
    description: '学习 Next.js 框架的完整教程。',
    oss_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://example.com/thumbnail2.jpg',
    duration: 300,
    view_count: 800,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'React 高级技巧',
    description: '深入学习 React 的高级技巧。',
    oss_url: 'https://example.com/video3.mp4',
    thumbnail_url: 'https://example.com/thumbnail3.jpg',
    duration: 180,
    view_count: 650,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// 视频服务层
export class VideoService {
  // 获取所有视频（分页）
  static async getVideos({ 
    page = 1, 
    limit = 6,
    search = '' 
  }: { 
    page?: number; 
    limit?: number; 
    search?: string 
  } = {}) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      let filteredVideos = [...mockVideos];
      
      // 搜索过滤
      if (search) {
        filteredVideos = filteredVideos.filter(video => 
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      const offset = (page - 1) * limit;
      const totalCount = filteredVideos.length;

      return {
        videos: filteredVideos.slice(offset, offset + limit),
        total: totalCount,
        page,
        limit,
      };
    }

    const offset = (page - 1) * limit;

    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 搜索过滤
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const video = mockVideos.find(v => v.id === id);
      if (video) {
        // 更新浏览次数
        await this.incrementViewCount(id);
        return video;
      }
      return null;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching video by id:', error);
      throw new Error(error.message);
    }

    // 更新浏览次数
    await this.incrementViewCount(id);

    return data;
  }

  // 增加视频浏览次数
  static async incrementViewCount(videoId: string) {
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log(`[DEV] Incrementing view count for video: ${videoId}`);
      return;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockVideos
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, limit);
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return mockVideos.length;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[DEV] Creating video:', videoData);
      // 返回一个假的视频对象
      return {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...videoData
      } as Video;
    }

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
    // 开发模式下使用假数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[DEV] Updating video:', id, videoData);
      return;
    }

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

export const videoService = new VideoService();

export default VideoService;
