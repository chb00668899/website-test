/**
 * 分段测试文章存入 Supabase 的代码
 *
 * 测试步骤:
 * 1. 检查 Supabase 连接
 * 2. 检查 posts 表是否存在
 * 3. 插入一篇测试文章
 * 4. 查询已插入的文章
 */

// 加载环境变量
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { supabaseAdmin } from './src/lib/supabaseAdmin';

async function testSupabaseConnection() {
  console.log('\n========== 步骤 1: 测试 Supabase 连接 ==========');

  try {
    // 尝试一个简单的查询，验证连接
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select('count')
      .limit(1);

    if (error) {
      console.error('[失败] Supabase 连接测试错误:', error.message);
      return false;
    }

    console.log('[成功] Supabase 连接正常');
    return true;
  } catch (err) {
    console.error('[失败] 连接异常:', err instanceof Error ? err.message : err);
    return false;
  }
}

async function checkPostsTableExists() {
  console.log('\n========== 步骤 2: 检查 posts 表结构 ==========');

  try {
    // 尝试读取文章
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select('*')
      .limit(1);

    if (error) {
      console.error('[失败] posts 表检查错误:', error.message);

      // 判断是否是表不存在
      if (error.message.includes('does not exist')) {
        console.log('\n⚠️  posts 表似乎不存在，请检查 Supabase 数据库是否已创建该表');
        console.log('\n建议在 Supabase 中执行以下 SQL 创建 posts 表:');
        console.log(`
        CREATE TABLE IF NOT EXISTS posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          content TEXT NOT NULL,
          category_id UUID REFERENCES categories(id),
          author_id UUID NOT NULL,
          tags TEXT[] DEFAULT '{}',
          view_count INTEGER DEFAULT 0,
          like_count INTEGER DEFAULT 0,
          share_count INTEGER DEFAULT 0,
          status TEXT CHECK (status IN ('draft', 'published')),
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
        CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
        `);
      }
      return false;
    }

    console.log('[成功] posts 表存在');

    // 如果表中已有数据，显示示例
    if (data && data.length > 0) {
      console.log(`[信息] posts 表共有 ${data.length} 篇文章`);
      console.log('示例数据:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('[信息] posts 表当前为空');
    }

    return true;
  } catch (err) {
    console.error('[失败] 检查表结构异常:', err instanceof Error ? err.message : err);
    return false;
  }
}

async function insertTestPost() {
  console.log('\n========== 步骤 3: 插入测试文章 ==========');

  try {
    // 生成 UUID（兼容 Node.js）
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const authorId = generateUUID();

    const testPost = {
      title: '测试文章 - Supabase 写入验证',
      slug: 'test-supabase-write-verification-' + Date.now(), // 添加时间戳确保唯一性
      content: '# 这是一篇测试文章\n\n这是用来验证 Supabase 写入功能的测试内容。\n\n本文档于 ' + new Date().toISOString() + ' 创建。',
      category_id: null,
      author_id: authorId, // UUID 格式
      tags: ['测试', 'supabase', '验证'],
      status: 'draft' as const,
      view_count: 0,
      like_count: 0,
      share_count: 0,
    };

    console.log('准备插入数据:', JSON.stringify(testPost, null, 2));

    // 使用 supabaseAdmin.createPost
    const result = await supabaseAdmin.createPost(testPost);

    console.log('[成功] 文章插入成功!');
    console.log('返回数据:', JSON.stringify(result, null, 2));

    return result;
  } catch (err) {
    console.error('[失败] 插入文章错误:', err instanceof Error ? err.message : err);

    // 检查是否是唯一键冲突
    const errorMsg = err instanceof Error ? err.message : '';
    if (errorMsg.includes('violates unique constraint') || errorMsg.includes('duplicate')) {
      console.log('\n⚠️  slug 重复，请删除测试文章或修改时间戳后重试');
    }

    return null;
  }
}

async function queryTestPost(testSlug?: string) {
  console.log('\n========== 步骤 4: 查询已插入的文章 ==========');

  try {
    const slug = testSlug || 'test-supabase-write-verification-' + Date.now();

    // 按 slug 查询
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('[失败] 查询文章错误:', error.message);

      // 如果是未找到，可能是时间戳不匹配
      if (error.message.includes('no rows')) {
        console.log('\n⚠️  未找到文章，可能是插入和查询的 slug 不一致');
        console.log('提示：请查看步骤 3 中的 slug 值');

        // 尝试列出最近的文章
        const recentData = await supabaseAdmin.client
          .from('posts')
          .select('id, title, slug, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!recentData.error && recentData.data) {
          console.log('\n最近 5 篇文章:');
          recentData.data.forEach((post, i) => {
            console.log(`  ${i + 1}. ${post.title} (${post.slug})`);
          });
        }
      }
      return null;
    }

    console.log('[成功] 文章查询成功!');
    console.log('数据:', JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    console.error('[失败] 查询异常:', err instanceof Error ? err.message : err);
    return null;
  }
}

async function cleanupTestPost() {
  console.log('\n========== 步骤 5: 清理测试文章 ==========');

  try {
    // 查找今天的测试文章
    const today = new Date().toISOString();
    const { data, error } = await supabaseAdmin.client
      .from('posts')
      .select('id, title, slug')
      .like('slug', 'test-supabase-write-verification-%');

    if (error) {
      console.error('[警告] 查找测试文章错误:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('[信息] 未找到测试文章，跳过清理');
      return;
    }

    console.log(`[信息] 找到 ${data.length} 篇测试文章，准备删除...`);

    // 删除所有测试文章
    for (const post of data) {
      const { error: deleteError } = await supabaseAdmin.client
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (deleteError) {
        console.error(`  [失败] 删除 "${post.title}" 失败:`, deleteError.message);
      } else {
        console.log(`  [成功] 删除 "${post.title}"`);
      }
    }

    console.log('[完成] 清理结束');
  } catch (err) {
    console.error('[失败] 清理异常:', err instanceof Error ? err.message : err);
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Supabase 文章写入分段测试                    ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('开始时间:', new Date().toISOString());

  let results = {
    connection: false,
    tableExists: false,
    insertSuccess: false,
    querySuccess: false,
  };

  // 步骤 1: 测试连接
  results.connection = await testSupabaseConnection();

  if (!results.connection) {
    console.log('\n❌ 连接测试失败，后续测试已中止');
    process.exit(1);
  }

  // 步骤 2: 检查表是否存在
  results.tableExists = await checkPostsTableExists();

  if (!results.tableExists) {
    console.log('\n❌ posts 表不存在，请先创建表结构');
    process.exit(1);
  }

  // 步骤 3: 插入测试文章
  const insertedPost = await insertTestPost();

  if (insertedPost) {
    results.insertSuccess = true;

    // 步骤 4: 查询文章
    results.querySuccess = await queryTestPost(insertedPost.slug);
  }

  // 步骤 5: 清理测试数据
  await cleanupTestPost();

  // 总结
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║                  测试结果总结                   ║');
  console.log('╚════════════════════════════════════════════════╝');

  const steps = [
    { name: 'Supabase 连接', success: results.connection },
    { name: 'posts 表存在性检查', success: results.tableExists },
    { name: '插入文章', success: results.insertSuccess },
    { name: '查询文章', success: results.querySuccess },
  ];

  let allPassed = true;
  steps.forEach(step => {
    const status = step.success ? '✅' : '❌';
    console.log(`${status} ${step.name}`);
    if (!step.success) allPassed = false;
  });

  console.log('\n完成时间:', new Date().toISOString());

  if (allPassed) {
    console.log('\n🎉 所有测试通过！文章写入功能正常。');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分测试未通过，请检查上述错误信息。');
    process.exit(1);
  }
}

main();
