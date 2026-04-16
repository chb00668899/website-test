import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 设置数据库表的 API 端点
 * 访问 /api/setup-db 创建测试表
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase 配置不完整',
        },
        { status: 400 }
      );
    }

    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 创建测试表
    const { error: createError } = await supabase
      .from('test_table')
      .select('');

    if (createError && createError.message.includes('does not exist')) {
      // 表不存在，返回错误信息
      return NextResponse.json({
        status: 'error',
        message: '表 test_table 不存在，请在 Supabase 控制台执行以下 SQL 创建表：',
        sql: `
-- 创建测试表
CREATE TABLE IF NOT EXISTS test_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入示例数据
INSERT INTO test_table (name, description) VALUES
  ('测试数据 1', '这是第一条测试数据'),
  ('测试数据 2', '这是第二条测试数据'),
  ('测试数据 3', '这是第三条测试数据')
ON CONFLICT DO NOTHING;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_test_table_name ON test_table(name);

-- 启用 RLS
ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Anyone can view test_table" ON test_table
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create test_table" ON test_table
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
        `,
      });
    }

    // 获取测试数据
    const { data: testData, error: testError } = await supabase
      .from('test_table')
      .select('*')
      .limit(10);

    if (testError) {
      return NextResponse.json(
        {
          status: 'error',
          message: testError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: '测试表已存在',
      table: testData,
    });
  } catch (error) {
    console.error('Setup DB error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
