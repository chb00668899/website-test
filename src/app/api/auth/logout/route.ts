import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 登出 API 端点
 * 处理用户登出请求
 */
export async function POST(request: NextRequest) {
  try {
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

    // 调用 Supabase 登出 API
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 清除所有认证相关的 cookie
    const response = NextResponse.json({ success: true });
    
    // 清除 Supabase 相关的 cookie
    response.cookies.set('sb-auth-token', '', { maxAge: 0 });
    response.cookies.set('sb-auth-refresh-token', '', { maxAge: 0 });
    response.cookies.set('sb-auth-exp', '', { maxAge: 0 });
    
    // 清除 mock-session cookie（如果存在）
    response.cookies.set('mock-session', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('[Logout API] 登出失败:', error);
    return NextResponse.json(
      { error: '登出失败，请稍后重试' },
      { status: 500 }
    );
  }
}
