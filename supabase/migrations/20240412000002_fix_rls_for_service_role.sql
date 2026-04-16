-- ========================================
-- 修复 RLS 策略以允许服务端密钥访问
-- ========================================

-- ========== 删除现有策略（如果存在）==========
-- posts
DROP POLICY IF EXISTS "Service can manage posts" ON posts;

-- categories
DROP POLICY IF EXISTS "Service can manage categories" ON categories;

-- videos
DROP POLICY IF EXISTS "Service can manage videos" ON videos;

-- ========== 创建新的 RLS 策略 ==========
-- 允许服务端密钥绕过 RLS
CREATE POLICY "Service can manage posts" ON posts
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service can manage categories" ON categories
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service can manage videos" ON videos
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
