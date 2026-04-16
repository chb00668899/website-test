'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 子组件：处理登录逻辑
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        
        if (data.user) {
          // 已登录，重定向到目标页面
          router.push(redirect);
          router.refresh();
        }
      } catch (err) {
        console.error('检查登录状态失败:', err);
      }
    };

    checkAuthStatus();
  }, [router, redirect]);

  // 退出登录
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // 清除本地 cookie
        document.cookie = 'mock-session=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('登出失败:', err);
    }
  };

  // 密码登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '登录失败');
        return;
      }

      if (data.user) {
        // 登录成功，Supabase 会自动设置会话 cookie
        // 重定向到目标页面
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          data: {
            role: 'admin',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '注册失败');
        return;
      }

      // 注册成功，Supabase 会自动设置会话 cookie
      // 重定向到目标页面
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 密码重置
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '密码重置失败');
        return;
      }

      setError(data.message || '密码重置邮件已发送，请检查您的邮箱');
      setResetEmail('');
    } catch (err) {
      setError('密码重置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // GitHub 登录
  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'github',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'GitHub 登录失败');
        return;
      }

      // Supabase 会处理重定向
      window.location.href = data.url;
    } catch (err) {
      setError('GitHub 登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // Google 登录
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Google 登录失败');
        return;
      }

      // Supabase 会处理重定向
      window.location.href = data.url;
    } catch (err) {
      setError('Google 登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {isRegisterMode ? '注册新账户' : isResetMode ? '重置密码' : '登录到管理后台'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegisterMode
              ? '请输入您的邮箱和密码创建账户'
              : isResetMode
              ? '请输入您的邮箱接收密码重置链接'
              : '请输入您的凭据'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {/* 登出按钮（如果已登录） */}
          {isRegisterMode || isResetMode ? null : (
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full"
              >
                退出登录
              </Button>
            </div>
          )}

          {/* OAuth 登录按钮 */}
          {!isRegisterMode && !isResetMode && (
            <div className="mb-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="w-full"
              >
                GitHub 登录
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full"
              >
                Google 登录
              </Button>
            </div>
          )}

          {/* 错误消息 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* 切换模式按钮 */}
          <div className="mb-6 flex justify-center">
            <div className="flex gap-4 text-sm text-gray-600">
              {!isRegisterMode && !isResetMode && (
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  还没有账户？注册
                </button>
              )}
              {isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  已有账户？登录
                </button>
              )}
              {!isRegisterMode && !isResetMode && (
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  忘记密码？
                </button>
              )}
              {isResetMode && (
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  返回登录
                </button>
              )}
            </div>
          </div>

          {/* 注册表单 */}
          {isRegisterMode ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="请输入邮箱"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="请输入密码（至少 6 位）"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </form>
          ) : isResetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="请输入邮箱"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '发送中...' : '发送重置链接'}
              </Button>
            </form>
          ) : (
            /* 登录表单 */
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="请输入邮箱"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="请输入密码"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>使用邮箱和密码登录，或选择 OAuth 登录方式</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
