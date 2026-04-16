-- ========================================
-- 授予 service_role 对 public 模式的权限
-- 在 Supabase 仪表盘的 SQL 编辑器中运行此脚本
-- ========================================

-- 1. 授予 service_role 对 public 模式的使用权
GRANT USAGE ON SCHEMA public TO service_role;

-- 2. 授予对所有表的完全访问权限 (绕过 RLS 后，仍需表权限才能操作)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO service_role;

-- 3. 确保未来的表也有默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

-- 4. 授予对 auth.users 表的访问权限（用于获取用户信息）
GRANT SELECT ON auth.users TO service_role;
