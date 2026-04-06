'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/authClient';
import type { User, Session } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 初始化获取当前用户
    const initUser = async () => {
      try {
        const currentSession = await authClient.getSession();
        const currentUser = await authClient.getCurrentUser();
        
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        console.error('[useUser] 初始化失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();

    // 监听认证状态变化
    const { data: authListener } = authClient.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    isLoggedIn: !!user,
  };
}

export default useUser;
