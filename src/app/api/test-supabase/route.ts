import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 测试 Supabase 连接的 API 端点
 * 访问 /api/test-supabase 查看连接状态和示例数据
 */
export async function GET() {
  try {
    // 1. 检查环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    // 创建使用服务端密钥的 Supabase 客户端
    // 在 Supabase 中，使用服务端密钥时会自动绕过 RLS
    const supabaseAdmin = createClient(
      supabaseUrl || '', 
      supabaseServiceKey || ''
    );
    
    // 2. 测试 Supabase 连接
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    // 3. 获取示例数据
    const { data: postsData, error: postsError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .limit(5);

    // 4. 获取分类数据
    const { data: categoriesData, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(5);

    // 5. 获取标签数据
    const { data: tagsData, error: tagsError } = await supabaseAdmin
      .from('posts')
      .select('tags')
      .limit(10);

    // 6. 获取用户数据（Supabase 用户在 auth.users 表中）
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .limit(5);

    return NextResponse.json({
      status: 'success',
      environment: {
        urlProvided: !!supabaseUrl,
        url: supabaseUrl || 'Not set',
        keyProvided: !!supabaseServiceKey,
        keyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 10)}...` : 'Not set',
      },
      connection: {
        connected: !error,
        error: error ? error.message : null,
      },
      sampleData: {
        posts: postsError ? null : postsData,
        postsError: postsError?.message || null,
        categories: categoriesError ? null : categoriesData,
        categoriesError: categoriesError?.message || null,
        tags: tagsError ? null : tagsData,
        tagsError: tagsError?.message || null,
        users: usersError ? null : usersData,
        usersError: usersError?.message || null,
      },
      message: 'Supabase 连接测试完成',
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
