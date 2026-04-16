import { expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// 模拟 Supabase 客户端
const mockSupabase = {
  from: vi.fn().mockReturnThis,
  select: vi.fn().mockReturnThis,
  insert: vi.fn().mockReturnThis,
  update: vi.fn().mockReturnThis,
  delete: vi.fn().mockReturnThis,
  eq: vi.fn().mockReturnThis,
  filter: vi.fn().mockReturnThis,
  single: vi.fn().mockReturnThis,
  maybeSingle: vi.fn().mockReturnThis,
  execute: vi.fn().mockResolvedValue({ data: null, error: null }),
};

// 模拟 Supabase 客户端创建函数
const createClient = vi.fn(() => mockSupabase);

// 模拟 AuthClient
const mockAuthClient = {
  getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signOut: vi.fn().mockResolvedValue({ data: null, error: null }),
  getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  getCurrentUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signInWithOAuth: vi.fn().mockResolvedValue({ data: { url: '' }, error: null }),
  resetPasswordForEmail: vi.fn().mockResolvedValue({ data: null, error: null }),
  updateUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  onAuthStateChange: vi.fn().mockReturnValue({ subscription: { unsubscribe: vi.fn() } }),
};

// 模拟环境变量
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

// 清理测试后的 DOM
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
