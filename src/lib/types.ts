// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
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
  content: MarkdownBlock | string; // Markdown 内容
  category_id: string;
  tags: string[];
  status: 'draft' | 'published';
  author_id: string;
  view_count: number;
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
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// 评论类型
export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
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

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
