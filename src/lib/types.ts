// 用户类型（对应 auth.users 表）
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// 用户角色类型
export type UserRole = 'admin' | 'user';

// 用户资料类型（对应 user_profiles 表）
export interface UserProfile {
  id: string;
  name: string;
  avatar_url: string;
  role: UserRole;
  bio: string;
  created_at: string;
  updated_at: string;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

// Markdown 内容块类型
export interface MarkdownBlock {
  type: string;
  content?: string;
  children?: MarkdownBlock[];
  [key: string]: unknown;
}

// 博客文章类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | MarkdownBlock; // Markdown 内容
  category_id: string | null;
  author_id: string;
  tags: string[]; // 文章标签
  view_count: number;
  like_count: number;
  share_count: number;
  status: 'draft' | 'published';
  description?: string;
  created_at: string;
  updated_at: string;
}

// 博客文章-标签关联类型
export interface PostTag {
  post_id: string;
  tag_id: string;
}

// 评论类型
export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// 视频类型
export interface Video {
  id: string;
  title: string;
  description: string;
  oss_url: string;
  thumbnail_url: string;
  duration: number;
  view_count: number;
  author_id: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// 视频评论类型
export interface VideoComment {
  id: string;
  content: string;
  video_id: string;
  author_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// 文章点赞类型
export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// 文章浏览类型
export interface PostView {
  id: string;
  post_id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// 测试表类型
export interface TestTable {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

// OSS 相关类型
export interface OssUploadOptions {
  fileName: string;
  mimeType?: string;
  meta?: Record<string, string>;
}

export interface OssUploadResult {
  success: boolean;
  url: string;
  filename: string;
  message?: string;
}

export interface PresignedUrlResult {
  success: boolean;
  url: string;
  message?: string;
}
