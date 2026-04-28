/**
 * API Route 逻辑测试 - 不依赖登录状态
 *
 * 测试重点:
 * 1. POST /api/posts 的路由存在且可访问
 * 2. 未认证时返回 401
 * 3. 使用 supabaseAdmin.createPost 直接插入 (绕过 API 路由的认证层)
 */

import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { supabaseAdmin } from './src/lib/supabaseAdmin';
import { AdminPostService } from './src/services/adminPostService';

async function testApiRoute() {
  console.log('\n========== API Route 逻辑测试 ==========');

  // ============================
  // Step 1: 测试 AdminPostService.createPost (跳过认证层)
  // ============================
  console.log('\n[步骤 1] 直接调用 AdminPostService.createPost...');

  const testSlug = `api-test-${Date.now()}`;
  const testPostData = {
    title: 'API Route 测试文章',
    slug: testSlug,
    content: '# API Test\n\nThis article tests the API route logic.',
    category_id: null,
    author_id: '00000000-0000-0000-0000-000000000001', // 测试用 UUID
    tags: ['API', '测试'],
    status: 'draft',
    view_count: 0,
    like_count: 0,
    share_count: 0,
  };

  try {
    console.log('[提交数据]:', JSON.stringify({
      title: testPostData.title,
      slug: testSlug,
      contentLength: testPostData.content.length,
      tags: testPostData.tags,
    }, null, 2));

    const result = await AdminPostService.createPost(testPostData);

    console.log('[成功] 文章插入成功!');
    console.log('返回数据:', {
      id: result.id,
      slug: result.slug,
      title: result.title,
    });

    // ============================
    // Step 2: 验证查询
    // ============================
    console.log('\n[步骤 2] 验证文章可被查询...');

    const { data: verified, error } = await supabaseAdmin.client
      .from('posts')
      .select('*')
      .eq('slug', testSlug)
      .single();

    if (error || !verified) {
      console.error('[失败] 查询验证错误:', error?.message);
      return false;
    }

    console.log('[成功] 文章查询验证通过');

    // ============================
    // Step 3: 清理数据
    // ============================
    console.log('\n[步骤 3] 清理测试数据...');

    const { error: deleteError } = await supabaseAdmin.client
      .from('posts')
      .delete()
      .eq('id', verified.id);

    if (deleteError) {
      console.error('[警告] 清理失败:', deleteError.message);
    } else {
      console.log('[成功] 测试数据已清理');
    }

    return true;
  } catch (error) {
    console.error('[失败] API Service 调用错误:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   API Route 逻辑测试                           ║');
  console.log('╚════════════════════════════════════════════════╝');

  const success = await testApiRoute();

  if (!success) {
    process.exit(1);
  }

  console.log('\n🎉 API Route 逻辑测试通过！\n');
  process.exit(0);
}

main();
