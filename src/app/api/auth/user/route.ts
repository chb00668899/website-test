import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 获取当前用户信息 API 端点
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }

    // 创建 Supabase Admin 客户端用于查询 user_profiles 和验证用户
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 从 cookie 获取 session - 支持新旧两种格式
    let authCookie = request.cookies.get('sb-auth-access-token')?.value;

    // 如果没有找到旧名称的 cookie，尝试新格式
    if (!authCookie) {
      const projectRef = supabaseUrl.split('.')[0].split('://')[1];
      const newCookieName = `sb-${projectRef}-auth-token`;
      authCookie = request.cookies.get(newCookieName)?.value;
      console.log(`[User API] 尝试读取 cookie: ${newCookieName}`);
    }

    if (!authCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 使用 service key 直接验证 token 并获取用户信息
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(authCookie);

    if (error || !user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // 尝试从 app_metadata 或 user_metadata 获取角色
    let role = user.app_metadata?.role || user.user_metadata?.role;

    // 如果 metadata 中没有角色，从 user_profiles 表查询
    if (!role) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && profile?.role) {
        role = profile.role;
      }
    }

    // 默认角色为 'user'
    role = role || 'user';

    // 返回用户信息
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('[User API] 获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
