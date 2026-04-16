'use client';

import { authClient } from './authClient';

/**
 * 权限检查工具类
 * 提供统一的权限验证接口
 */
export class PermissionChecker {
  /**
   * 检查用户是否已登录
   */
  static async isAuthenticated() {
    return await authClient.isLoggedIn();
  }

  /**
   * 检查用户是否是管理员
   */
  static async isAdmin() {
    const role = await authClient.getUserRole();
    return role === 'admin';
  }

  /**
   * 检查用户是否拥有特定权限
   */
  static async hasPermission(permission: string) {
    const role = await authClient.getUserRole();
    
    // 管理员拥有所有权限
    if (role === 'admin') {
      return true;
    }

    // 用户权限检查逻辑
    const userPermissions = await this.getUserPermissions(role);
    return userPermissions.includes(permission);
  }

  /**
   * 获取用户权限列表
   */
  private static async getUserPermissions(role: string): Promise<string[]> {
    // 从数据库或权限系统获取用户权限
    // 这里是示例逻辑，实际应根据业务需求调整
    const permissions: Record<string, string[]> = {
      user: ['read_posts', 'read_videos', 'comment', 'like'],
      admin: ['read_posts', 'read_videos', 'comment', 'like', 'create_posts', 'edit_posts', 'delete_posts', 'manage_users', 'manage_settings'],
    };

    return permissions[role] || [];
  }

  /**
   * 重定向到登录页面
   */
  static redirect_to_login() {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
    }
  }

  /**
   * 重定向到未授权页面
   */
  static redirect_to_unauthorized() {
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
  }
}

/**
 * 包装函数：检查权限并执行回调
 */
export async function withAuth<T>(
  callback: () => Promise<T> | T,
  options?: { requireAdmin?: boolean }
): Promise<T | null> {
  const isAuthenticated = await authClient.isLoggedIn();
  
  if (!isAuthenticated) {
    PermissionChecker.redirect_to_login();
    return null;
  }

  if (options?.requireAdmin) {
    const isAdmin = await PermissionChecker.isAdmin();
    if (!isAdmin) {
      PermissionChecker.redirect_to_unauthorized();
      return null;
    }
  }

  return await callback();
}

/**
 * 权限常量
 */
export const PERMISSIONS = {
  READ_POSTS: 'read_posts',
  CREATE_POSTS: 'create_posts',
  EDIT_POSTS: 'edit_posts',
  DELETE_POSTS: 'delete_posts',
  READ_VIDEOS: 'read_videos',
  CREATE_VIDEOS: 'create_videos',
  EDIT_VIDEOS: 'edit_videos',
  DELETE_VIDEOS: 'delete_videos',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  COMMENT: 'comment',
  LIKE: 'like',
};

export default PermissionChecker;
