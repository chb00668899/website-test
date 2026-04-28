import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 登录 API 端点
 * 处理用户登录请求
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }

    // 创建 Supabase Admin 客户端用于数据库查询
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 使用 anon key 进行登录（通过 HTTP 请求）
    const loginResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      return NextResponse.json({ error: errorData.message || '登录失败' }, { status: 401 });
    }

    const authData = await loginResponse.json();

    if (!authData.access_token || !authData.refresh_token) {
      return NextResponse.json({ error: '登录失败' }, { status: 401 });
    }

    // 使用 access_token 获取用户信息
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authData.access_token);

    if (userError || !user) {
      return NextResponse.json({ error: '登录失败' }, { status: 401 });
    }

    // 获取角色
    let role = user.app_metadata?.role || user.user_metadata?.role;
    if (!role) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!profileError && profile?.role) {
        role = profile.role;
        console.log(`[Login API] 从 user_profiles 获取角色：${role}`);
      }
    }
    role = role || 'user';

    console.log(`[Login API] 登录成功，用户：${user.id}, 角色:${role}`);

    // ⚠️ 关键：设置 Set-Cookie header
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, role },
      redirect: '/admin',
    });

    // ⚠️ 使用 Supabase SSR 标准的 cookie 名称格式
    // 从 URL 提取 projectRef: https://mgsdwrgnlmothebvazwf.supabase.co -> mgsdwrgnlmothebvazwf
    const projectRef = supabaseUrl.split('.')[0].split('://')[1];
    const accessTokenCookieName = `sb-${projectRef}-auth-token`;
    const refreshTokenCookieName = `sb-${projectRef}-auth-refresh-token`;

    // 设置 access token cookie
    response.cookies.set({
      name: accessTokenCookieName,
      value: authData.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: authData.expires_in,
    });

    // 设置 refresh token cookie
    response.cookies.set({
      name: refreshTokenCookieName,
      value: authData.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });

    console.log(`[Login API] 设置 cookie: ${accessTokenCookieName}, ${refreshTokenCookieName}`);
    console.log(`[Login API] Cookie details: httpOnly=${true}, secure=${process.env.NODE_ENV === 'production'}, sameSite=lax, path=/`);

    return response;
  } catch (error) {
    console.error('[Login API] 登录失败:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
