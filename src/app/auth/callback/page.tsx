'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/authClient';

/**
 * OAuth 回调页面
 * 处理 GitHub/Google OAuth 登录后的回调
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 获取会话
        const session = await authClient.getSession();
        
        if (!session) {
          console.error('[Auth Callback] 获取会话失败');
          router.push('/login');
          return;
        }

        // OAuth 登录成功，重定向到目标页面
        const redirect = searchParams.get('redirect') || '/admin';
        router.push(redirect);
        router.refresh();
      } catch (err) {
        console.error('[Auth Callback] 处理回调失败:', err);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">正在登录...</h2>
        <p className="mt-2 text-gray-600">请稍候，我们正在处理您的登录请求</p>
      </div>
    </div>
  );
}
