import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase 客户端配置
// 从环境变量中读取 Supabase 配置信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建 Supabase 客户端
// 始终使用真实的 Supabase API
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
const supabase = typeof window === 'undefined'
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    })
  : createClient(supabaseUrl, supabaseAnonKey);

// 导出 Supabase 客户端
export default supabase;

// 导出类型
export type { SupabaseClient };
