import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 路由守卫中间件
 * 保护需要认证的路由
 */
const protectedRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route) || pathname === route
  );

  if (isProtectedRoute) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 从 URL 提取 projectRef
    const projectRef = supabaseUrl.split('.')[0].split('://')[1];
    const accessTokenCookieName = `sb-${projectRef}-auth-token`;

    // 直接读取 access_token cookie
    const accessTokenCookie = request.cookies.get(accessTokenCookieName);

    if (!accessTokenCookie) {
      console.log('[Middleware] No auth token cookie, redirecting to login:', pathname);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 使用 access_token 验证用户
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessTokenCookie.value);

    if (error || !user) {
      console.log('[Middleware] Invalid token, redirecting to login:', pathname, 'error:', error?.message);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log('[Middleware] User authenticated:', user.id);

    // 检查用户角色
    const role = user.app_metadata?.role || user.user_metadata?.role || 'user';

    if (role !== 'admin' && pathname.startsWith('/admin')) {
      console.log('[Middleware] Non-admin access, redirecting:', user.id, 'role:', role);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// 配置中间件应用的路由
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
  ],
};
