-- ========================================
-- 完整数据库架构迁移
-- 包含表创建、函数、索引和 RLS 策略
-- ========================================

-- ========== 创建分类表 ==========
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 创建博客文章表 ==========
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category_id UUID,
  author_id UUID,
  tags TEXT[],
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加外键约束
ALTER TABLE posts ADD CONSTRAINT posts_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- ========== 创建评论表（使用 parent_comment_id 字段名）=========
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID,
  author_id UUID,
  parent_comment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加外键约束
ALTER TABLE comments ADD CONSTRAINT comments_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_parent_comment_id_fkey 
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE;

-- ========== 创建视频表 ==========
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  oss_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  author_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加外键约束
ALTER TABLE videos ADD CONSTRAINT videos_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ========== 创建文章点赞表（添加 is_liked 字段）=========
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  is_liked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 添加外键约束
ALTER TABLE post_likes ADD CONSTRAINT post_likes_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE post_likes ADD CONSTRAINT post_likes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ========== 创建索引 ==========
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);

-- ========== 启用 RLS ==========
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- ========== 删除现有策略（如果存在）==========
-- categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

-- posts
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Admin can manage all posts" ON posts;
DROP POLICY IF EXISTS "Service can manage posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

-- comments
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- videos
DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
DROP POLICY IF EXISTS "Anyone can view published videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can create videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

-- post_likes
DROP POLICY IF EXISTS "Authenticated users can create post_likes" ON post_likes;

-- ========== 创建 RLS 策略 ==========
-- categories
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- 保留管理员管理分类的策略（如果需要管理员功能，请在用户表中添加 role 字段）
CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- posts
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = posts.author_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = posts.author_id);

CREATE POLICY "Service can manage posts" ON posts
  FOR ALL USING (auth.role() = 'service_role');

-- comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = comments.author_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = comments.author_id);

-- videos
CREATE POLICY "Anyone can view published videos" ON videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own videos" ON videos
  FOR UPDATE USING (auth.uid() = videos.author_id);

CREATE POLICY "Users can delete own videos" ON videos
  FOR DELETE USING (auth.uid() = videos.author_id);


-- post_likes
CREATE POLICY "Authenticated users can create post_likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own likes" ON post_likes
  FOR DELETE USING (auth.uid() = post_likes.user_id);

-- ========================================
-- 函数
-- ========================================

-- 增加文章浏览次数的函数
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 增加视频浏览次数的函数
CREATE OR REPLACE FUNCTION increment_video_view_count(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET view_count = view_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- 增加文章点赞数的函数
CREATE OR REPLACE FUNCTION increment_like_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET like_count = like_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 减少文章点赞数的函数
CREATE OR REPLACE FUNCTION decrement_like_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET like_count = like_count - 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 增加文章分享次数的函数
CREATE OR REPLACE FUNCTION increment_share_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET share_count = share_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
