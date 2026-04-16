import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

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

    // 检查会话
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      // 如果没有会话，重定向到登录页面
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 检查用户角色
    const user = session.user;
    const role = user?.user_metadata?.role || 'user';
    
    if (role !== 'admin' && pathname.startsWith('/admin')) {
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
