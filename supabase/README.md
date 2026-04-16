# Supabase 数据库迁移

## 数据库架构

### 表列表

1. **user_profiles** - 用户资料表
   - id (UUID, 主键, 引用 auth.users)
   - name (TEXT)
   - avatar_url (TEXT)
   - role (TEXT, 'user' 或 'admin')
   - bio (TEXT)
   - created_at, updated_at (TIMESTAMPTZ)

2. **categories** - 分类表
   - id (UUID, 主键)
   - name, slug (TEXT, 唯一)
   - description (TEXT)
   - created_at, updated_at (TIMESTAMPTZ)

3. **tags** - 标签表
   - id (UUID, 主键)
   - name, slug (TEXT, 唯一)
   - description (TEXT)
   - created_at, updated_at (TIMESTAMPTZ)

4. **posts** - 博客文章表
   - id (UUID, 主键)
   - title, slug (TEXT, 唯一)
   - content (TEXT)
   - category_id (UUID, 外键)
   - author_id (UUID, 外键)
   - tags (TEXT[])
   - view_count, like_count (INTEGER)
   - status (TEXT, 'draft' 或 'published')
   - created_at, updated_at (TIMESTAMPTZ)

5. **post_tags** - 文章-标签关联表
   - post_id, tag_id (UUID, 复合主键)

6. **comments** - 评论表
   - id (UUID, 主键)
   - content (TEXT)
   - post_id, author_id, parent_id (UUID, 外键)
   - created_at, updated_at (TIMESTAMPTZ)

7. **videos** - 视频表
   - id (UUID, 主键)
   - title, description (TEXT)
   - oss_url (TEXT)
   - thumbnail_url (TEXT)
   - duration, view_count (INTEGER)
   - created_at, updated_at (TIMESTAMPTZ)

8. **video_comments** - 视频评论表
   - id (UUID, 主键)
   - content (TEXT)
   - video_id, author_id, parent_id (UUID, 外键)
   - created_at, updated_at (TIMESTAMPTZ)

9. **post_likes** - 文章点赞表
   - id (UUID, 主键)
   - post_id, user_id (UUID, 外键)
   - created_at (TIMESTAMPTZ)

10. **post_views** - 文章浏览表
    - id (UUID, 主键)
    - post_id, user_id (UUID, 外键)
    - ip_address (INET)
    - user_agent (TEXT)
    - created_at (TIMESTAMPTZ)

11. **test_table** - 测试表
    - id (UUID, 主键)
    - name, description (TEXT)
    - created_at (TIMESTAMPTZ)

## 执行迁移

### 方法 1：使用 Supabase 控制台
