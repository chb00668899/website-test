import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth 登录 API 端点
 * 处理 GitHub/Google OAuth 登录请求
 */
export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json();

    // 验证输入
    if (!provider || !['github', 'google'].includes(provider)) {
      return NextResponse.json(
        { error: '无效的 OAuth 提供商' },
        { status: 400 }
      );
    }

    // 创建服务端 Supabase 客户端
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string }>) {
            cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    // 调用 Supabase OAuth 登录 API
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'github' | 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // 返回重定向 URL（Supabase 会处理重定向）
    return NextResponse.json({
      url: data.url,
    });
  } catch (error) {
    console.error('[OAuth API] OAuth 登录失败:', error);
    return NextResponse.json(
      { error: 'OAuth 登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
