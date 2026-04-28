import { NextRequest, NextResponse } from 'next/server';

/**
 * 登出 API 端点
 * 处理用户登出请求
 */
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const projectRef = supabaseUrl.split('.')[0].split('://')[1];
    const accessTokenCookieName = `sb-${projectRef}-auth-token`;
    const refreshTokenCookieName = `sb-${projectRef}-auth-refresh-token`;

    const response = NextResponse.json({ success: true });

    // Clear auth cookies with same names used during login
    response.cookies.set(accessTokenCookieName, '', { maxAge: 0, path: '/' });
    response.cookies.set(refreshTokenCookieName, '', { maxAge: 0, path: '/' });
    response.cookies.set('mock-session', '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    console.error('[Logout API] 登出失败:', error);
    return NextResponse.json(
      { error: '登出失败，请稍后重试' },
      { status: 500 }
    );
  }
}
