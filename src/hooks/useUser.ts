'use client';

import { useState, useEffect } from 'react';

interface ApiUser {
  id: string;
  email: string | null;
  role: string;
  created_at?: string;
}

export function useUser() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ⚠️ 关键：credentials: 'include' 才能发送 cookie！
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user || null);
      } catch (err) {
        console.error('[useUser] 获取用户失败:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refetch = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    error,
    refetch,
  };
}

export default useUser;
