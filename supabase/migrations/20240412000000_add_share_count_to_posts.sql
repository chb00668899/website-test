-- 添加文章分享计数字段
ALTER TABLE posts ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_share_count ON posts(share_count DESC);
