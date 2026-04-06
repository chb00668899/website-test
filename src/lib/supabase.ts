import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase 客户端配置
// 从环境变量中读取 Supabase 配置信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查是否使用假数据（开发模式）
const isMock = 
  process.env.NODE_ENV === 'development' && 
  (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder'));

// 假数据
const mockData = {
  posts: [
    {
      id: '1',
      title: '欢迎来到我的博客',
      slug: 'welcome-to-my-blog',
      content: '这是一篇示例博客文章。',
      category_id: '1',
      tags: ['示例', '欢迎'],
      status: 'published' as const,
      author_id: '1',
      view_count: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Next.js 14 入门指南',
      slug: 'nextjs-14-getting-started',
      content: '本文介绍 Next.js 14 的基本使用方法。',
      category_id: '1',
      tags: ['Next.js', 'React', '教程'],
      status: 'published' as const,
      author_id: '1',
      view_count: 250,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'TypeScript 高级教程',
      slug: 'typescript-advanced-tutorial',
      content: '深入理解 TypeScript 的高级特性。',
      category_id: '1',
      tags: ['TypeScript', 'JavaScript', '教程'],
      status: 'published' as const,
      author_id: '1',
      view_count: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  videos: [
    {
      id: '1',
      title: '欢迎观看视频',
      description: '这是一篇示例视频介绍。',
      oss_url: 'https://example.com/video.mp4',
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      duration: 120,
      view_count: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'TypeScript 高级教程',
      description: '深入理解 TypeScript 的高级特性。',
      oss_url: 'https://example.com/ts-video.mp4',
      thumbnail_url: 'https://example.com/ts-thumbnail.jpg',
      duration: 300,
      view_count: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  categories: [
    { id: '1', name: '技术', slug: 'tech', description: '技术相关文章' },
    { id: '2', name: '生活', slug: 'life', description: '生活相关文章' },
  ],
};

// 创建 Supabase 客户端
// 如果是开发模式且配置为假值，则使用假数据模拟
const createMockClient = (): SupabaseClient => {
  console.log('[Supabase] Using mock data for development');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockClient: any = {
    from: (table: string) => ({
      select: (_columns: string) => ({
        order: (_column: string, _options?: { ascending?: boolean }) => ({
          range: (start: number, end: number) => ({
            eq: (_column: string, _value: unknown) => ({
              single: async () => {
                const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
                const item = data.find((i) => i[table as keyof typeof mockData] === _value);
                return { data: item || null, error: null };
              },
            }),
            then: (resolve: (value: unknown) => unknown, _reject?: (reason: unknown) => unknown) => {
              const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
              return resolve({ data: data.slice(start, end + 1), error: null });
            },
          }),
          then: (resolve: (value: unknown) => unknown, _reject?: (reason: unknown) => unknown) => {
            const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
            return resolve({ data, error: null });
          },
        }),
        then: (resolve: (value: unknown) => unknown, _reject?: (reason: unknown) => unknown) => {
          const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
          return resolve({ data, error: null });
        },
      }),
      eq: (_column: string, _value: unknown) => ({
        single: async () => {
          const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
          const item = data.find((i) => i[table as keyof typeof mockData] === _value);
          return { data: item || null, error: null };
        },
        then: (resolve: (value: unknown) => unknown, _reject?: (reason: unknown) => unknown) => {
          const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
          const item = data.find((i) => i[table as keyof typeof mockData] === _value);
          return resolve({ data: item || null, error: null });
        },
      }),
      then: (resolve: (value: unknown) => unknown, _reject?: (reason: unknown) => unknown) => {
        const data = mockData[table as keyof typeof mockData] as Array<Record<string, unknown>> || [];
        return resolve({ data, error: null });
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rpc: async (_fn: string, _payload?: Record<string, unknown>): Promise<any> => {
      console.log(`[Supabase RPC] ${_fn}`, _payload);
      return { data: null, error: null };
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  };

  return mockClient as SupabaseClient;
};

// 创建 Supabase 客户端
// 如果是开发模式且配置为假值，则使用假数据模拟
const supabase = isMock ? createMockClient() : 
  typeof window === 'undefined' 
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY || '')
    : createClient(supabaseUrl, supabaseAnonKey);

// 导出 Supabase 客户端
export default supabase;

// 导出类型
export type { SupabaseClient };
