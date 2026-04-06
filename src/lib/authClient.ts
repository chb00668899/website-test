import { createClient } from '@supabase/supabase-js';
import type { User, AuthResponse, Session } from '@supabase/supabase-js';

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
   * 获取当前会话
   */
  async getSession() {
    const { data, error } = await this.client.auth.getSession();
    
    if (error) {
      console.error('[AuthClient] 获取会话失败:', error);
      return null;
    }

    return data.session;
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser() {
    const { data, error } = await this.client.auth.getUser();
    
    if (error) {
      console.error('[AuthClient] 获取用户失败:', error);
      return null;
    }

    return data.user;
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

    // 从用户元数据中获取角色
    const role = user.user_metadata?.role || 'user';
    
    return role;
  }
}

// 导出单例实例
export const authClient = new AuthClient();

export default AuthClient;
