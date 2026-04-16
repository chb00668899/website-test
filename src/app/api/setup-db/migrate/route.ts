import { NextRequest, NextResponse } from 'next/server';

/**
 * 执行数据库迁移
 * 这是一个一次性脚本，用于创建数据库表和策略
 * 
 * 由于 Supabase 的 REST API 不支持直接执行 SQL，
 * 请在 Supabase 控制台的 SQL Editor 中执行以下 SQL：
 * 
 * 1. 打开 Supabase 控制台：https://mgsdwrgnlmothebvazwf.supabase.co
 * 2. 进入 **SQL Editor**
 * 3. 复制并执行 `supabase/migrations/20240101000008_create_tables_idempotent.sql` 文件中的 SQL 语句
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Supabase REST API 不支持直接执行 SQL。',
      instructions: '请在 Supabase 控制台的 SQL Editor 中执行 SQL 迁移文件。',
      sql_file: 'supabase/migrations/20240101000008_create_tables_idempotent.sql',
      control_panel_url: 'https://mgsdwrgnlmothebvazwf.supabase.co'
    },
    { status: 200 }
  );
}
