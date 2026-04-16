-- ========================================
-- 添加用户角色并更新 RLS 策略
-- ========================================

-- ========== 添加 role 字段到 users 表 ==========

-- 首先确保 auth.users 表中有 role 字段
-- 由于 Supabase 的 auth.users 表是受保护的，我们需要使用自定义用户配置文件表
-- 创建用户配置文件表（如果不存在）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON user_profiles;

-- 创建新策略
-- 任何人都可以查看自己的个人资料
CREATE POLICY "Anyone can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的个人资料
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 管理员可以管理所有个人资料
CREATE POLICY "Admin can manage all profiles" ON user_profiles
  FOR ALL USING (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'));

-- ========== 更新 posts 表的 RLS 策略 ==========

-- 删除现有策略
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Service can manage posts" ON posts;

-- 创建新策略
-- 任何人可以查看已发布的文章
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

-- 只有管理员可以创建文章
CREATE POLICY "Admin can create posts" ON posts
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 只有管理员可以更新所有文章
CREATE POLICY "Admin can update all posts" ON posts
  FOR UPDATE USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 作者可以更新自己的文章（用于管理员编辑自己的文章）
CREATE POLICY "Author can update own posts" ON posts
  FOR UPDATE USING (
    auth.uid() = posts.author_id 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 作者可以删除自己的文章
CREATE POLICY "Author can delete own posts" ON posts
  FOR DELETE USING (
    auth.uid() = posts.author_id 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 服务角色可以管理所有文章（用于后台操作）
CREATE POLICY "Service can manage posts" ON posts
  FOR ALL USING (auth.role() = 'service_role');

-- ========== 更新 videos 表的 RLS 策略 ==========

-- 删除现有策略
DROP POLICY IF EXISTS "Anyone can view published videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can create videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

-- 创建新策略
-- 任何人可以查看已发布的视频
CREATE POLICY "Anyone can view published videos" ON videos
  FOR SELECT USING (status = 'published');

-- 只有管理员可以创建视频
CREATE POLICY "Admin can create videos" ON videos
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 只有管理员可以更新所有视频
CREATE POLICY "Admin can update all videos" ON videos
  FOR UPDATE USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 作者可以更新自己的视频（用于管理员编辑自己的视频）
CREATE POLICY "Author can update own videos" ON videos
  FOR UPDATE USING (
    auth.uid() = videos.author_id 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 作者可以删除自己的视频
CREATE POLICY "Author can delete own videos" ON videos
  FOR DELETE USING (
    auth.uid() = videos.author_id 
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 更新 comments 表的 RLS 策略 ==========

-- 删除现有策略
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- 创建新策略
-- 任何人可以查看评论
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- 已认证用户可以创建评论
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 用户可以更新自己的评论
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = comments.author_id);

-- 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = comments.author_id);

-- ========== 更新 post_likes 表的 RLS 策略 ==========

-- 删除现有策略
DROP POLICY IF EXISTS "Authenticated users can create post_likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;

-- 创建新策略
-- 已认证用户可以创建点赞
CREATE POLICY "Authenticated users can create post_likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 用户可以删除自己的点赞
CREATE POLICY "Users can delete own likes" ON post_likes
  FOR DELETE USING (auth.uid() = post_likes.user_id);
