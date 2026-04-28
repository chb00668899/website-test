import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

/**
 * 认证客户端
 * 提供统一的认证操作接口
 */
class AuthClient {
  private client;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // 检查配置
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[AuthClient] 缺少 Supabase 配置，认证功能将不可用');
    }

    // 创建 Supabase 客户端
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * 从 cookie 中获取模拟用户信息（开发模式 - 已弃用）
   */
  private getMockUserFromCookie(): User | null {
    if (typeof window === 'undefined') return null;

    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const mockSession = getCookie('mock-session');
    if (!mockSession) return null;

    try {
      const mockUser = JSON.parse(mockSession);
      return {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: mockUser.user_metadata || { role: mockUser.role || 'user' },
        app_metadata: { role: mockUser.role || 'user' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;
    } catch (error) {
      console.error('[AuthClient] 解析 mock-session cookie 失败:', error);
      return null;
    }
  }

  /**
   * 获取当前会话（优先使用真实 Supabase session cookie）
   */
  async getSession() {
    // 优先从真实的 Supabase session cookie 获取会话
    const { data, error } = await this.client.auth.getSession();

    if (error) {
      console.error('[AuthClient] 获取会话失败:', error);
      return null;
    }

    if (data?.session) {
      return data.session;
    }

    // 降级到 mock-session（仅用于开发调试）
    const mockUser = this.getMockUserFromCookie();
    if (mockUser) {
      return {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 604800,
        expires_at: Math.floor(Date.now() / 1000) + 604800,
        user: mockUser,
        token_type: 'bearer'
      } as Session;
    }

    return null;
  }

  /**
   * 获取当前用户（优先使用真实 Supabase session）
   */
  async getCurrentUser() {
    // 优先从真实的 Supabase session 获取用户
    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        console.error('[AuthClient] 获取用户失败:', error);
        return null;
      }

      if (data?.user) {
        return data.user;
      }
    } catch (error) {
      console.error('[AuthClient] 获取用户异常:', error);
    }

    // 降级到 mock-session（仅用于开发调试）
    const mockUser = this.getMockUserFromCookie();
    if (mockUser) {
      return mockUser;
    }

    return null;
  }

  /**
   * 用户注册
   */
  async signUp(email: string, password: string, options?: {
    emailRedirectTo?: string;
    data?: Record<string, unknown>;
  }) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.emailRedirectTo,
        data: options?.data,
      },
    });

    if (error) {
      console.error('[AuthClient] 注册失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 用户登录
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AuthClient] 登录失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 社交登录（GitHub）
   */
  async signInWithGitHub() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('[AuthClient] GitHub 登录失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 社交登录（Google）
   */
  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('[AuthClient] Google 登录失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 用户登出
   */
  async signOut() {
    const { error } = await this.client.auth.signOut();
    
    if (error) {
      console.error('[AuthClient] 登出失败:', error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * 更新用户信息
   */
  async updateProfile(data: {
    email?: string;
    password?: string;
    data?: Record<string, unknown>;
  }) {
    const { data: userData, error } = await this.client.auth.updateUser(data);

    if (error) {
      console.error('[AuthClient] 更新用户信息失败:', error);
      throw new Error(error.message);
    }

    return userData.user;
  }

  /**
   * 发送密码重置邮件
   */
  async resetPassword(email: string) {
    const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      console.error('[AuthClient] 发送密码重置邮件失败:', error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * 监听认证状态变化
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  /**
   * 检查用户是否已登录
   */
  async isLoggedIn() {
    const session = await this.getSession();
    return !!session;
  }

  /**
   * 获取用户角色（admin 或 user）
   */
  async getUserRole() {
    const user = await this.getCurrentUser();

    if (!user) {
      return 'anonymous';
    }

    // 从应用元数据或用户元数据中获取角色
    // app_metadata 包含系统级信息（如 Supabase admin 角色）
    // user_metadata 包含用户自定义的元数据
    const role = user.app_metadata?.role || user.user_metadata?.role || 'user';

    return role;
  }
}

// 导出单例实例
export const authClient = new AuthClient();

export default AuthClient;
