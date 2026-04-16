-- ========================================
-- 数据库架构验证脚本
-- ========================================

-- ========== 1. 检查表是否存在 ==========

-- 检查 user_profiles 表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';

-- 检查 posts 表的字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name IN ('id', 'title', 'slug', 'content', 'category_id', 'author_id', 'tags', 'like_count', 'view_count', 'share_count', 'status', 'created_at', 'updated_at');

-- 检查 videos 表的字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'videos' 
AND column_name IN ('id', 'title', 'description', 'oss_url', 'thumbnail_url', 'duration', 'view_count', 'author_id', 'status', 'created_at', 'updated_at');

-- ========== 2. 检查 user_profiles 表数据 ==========

SELECT id, role, created_at 
FROM user_profiles 
LIMIT 5;

-- ========== 3. 检查 RLS 策略 ==========

-- 检查 posts 表的 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('posts', 'videos', 'user_profiles', 'comments', 'post_likes');

-- ========== 4. 检查索引 ==========

SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('posts', 'videos', 'comments', 'post_likes', 'user_profiles')
ORDER BY tablename;
