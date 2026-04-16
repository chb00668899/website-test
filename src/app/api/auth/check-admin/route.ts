import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 检查数据库中是否存在 admin 用户
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

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

    // 查询 admin 用户（从 user_profiles 表）
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, role, created_at')
      .eq('role', 'admin')
      .limit(1);

    if (error) {
      console.error('查询用户失败:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: '查询用户失败',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      hasAdmin: users && users.length > 0,
      adminUser: users ? users[0] : null,
    });
  } catch (error) {
    console.error('检查 admin 用户失败:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '检查 admin 用户失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
