/**
 * 完整文章创建流程 API 测试
 * 使用 Supabase Admin SDK 列出用户并登录
 */

import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { createClient } from '@supabase/supabase-js';

async function testFullPostCreationFlow() {
  console.log('\n========== 阶段 5: 完整创建文章流程测试 ==========');
  console.log('开始时间:', new Date().toISOString());

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 使用 Admin SDK (service role)
  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1. 列出 Auth 用户
  console.log('\n[步骤 1] 获取 Supabase Auth 用户列表...');
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error('[失败] 列出用户错误:', listError.message);
    return false;
  }

  if (!users || users.users.length === 0) {
    console.log('[失败] 没有找到任何用户');
    console.log('\n请先在 Supabase Dashboard > Authentication > Users 中创建用户');
    return false;
  }

  console.log(`[成功] 找到 ${users.users.length} 个用户`);

  // 选择一个测试用户
  const testUser = users.users[0];
  const email = testUser.email!;
  const userId = testUser.id;

  console.log(`[选择用户] Email: ${email}, ID: ${userId}`);

  // 为了测试，我们需要知道密码才能登录
  // Supabase Admin SDK 不返回密码（安全原因）
  // 这里我们尝试一个常见测试密码或提示用户
  const testPassword = 'TestPassword123!';

  console.log('\n[步骤 2] 使用凭证登录...');
  console.log(`[注意] 尝试使用以下凭证:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${testPassword} (如果密码不正确，需要手动设置)`);

  // 创建普通客户端进行登录测试
  const supabaseClient = createClient(supabaseUrl, anonKey);

  const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password: testPassword,
  });

  if (loginError) {
    console.error('\n[失败] 登录认证错误:', loginError.message);
    console.log('\n--- 解决方案 ---');
    console.log('1. 在 Supabase Dashboard > Authentication > Users 中:');
    console.log('   - 点击该用户 -> Password -> 设置密码为：' + testPassword);
    console.log('2. 或者修改此脚本中的 testPassword 变量');
    console.log('3. 确认用户的 email_confirmed_at 不为 null (邮件已确认)');
    return false;
  }

  if (!loginData.session) {
    console.error('[失败] 登录成功但未返回 session');
    return false;
  }

  const accessToken = loginData.session.access_token;
  console.log(`[成功] 登录成功!`);
  console.log(`[信息] Token: ${accessToken.substring(0, 30)}...`);

  // 2. 调用创建文章 API (通过 REST endpoint)
  console.log('\n[步骤 3] 调用 POST /rest/v1/posts API...');

  const testPostData = {
    title: `集成测试 - ${new Date().toLocaleString()}`,
    slug: '', // API 会自动生成
    content: `# 集成测试文章\n\n本文档于 ${new Date().toISOString()} 创建，用于验证完整的文章创建流程。`,
    category_id: null,
    tags: ['测试', '集成测试'],
    status: 'draft',
  };

  console.log('[信息] 提交数据:', JSON.stringify({
    title: testPostData.title,
    contentLength: testPostData.content.length,
    tags: testPostData.tags,
    status: testPostData.status,
  }, null, 2));

  // 使用 Supabase REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'apikey': anonKey,
      'Prefer': 'return=representation', // 返回插入的数据
    },
    body: JSON.stringify(testPostData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error('[失败] API 响应错误:', response.status, response.statusText);
    console.error('[详情]', JSON.stringify(responseData, null, 2));

    if (response.status === 401 || response.status === 403) {
      console.log('\n⚠️  认证/授权失败!');
      console.log('可能原因:');
      console.log('  - RLS 策略阻止了写入操作');
      console.log('  - Token 无效或已过期');
    }

    return false;
  }

  console.log('[成功] 文章创建成功!');
  console.log('[信息] 返回数据:', JSON.stringify({
    id: responseData.id,
    title: responseData.title,
    slug: responseData.slug,
    status: responseData.status,
    author_id: responseData.author_id,
  }, null, 2));

  // 3. 验证数据库记录
  console.log('\n[步骤 4] 验证数据库记录...');
  const { data: verifiedPost, error: queryError } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('slug', responseData.slug)
    .single();

  if (queryError || !verifiedPost) {
    console.error('[失败] 查询验证文章失败:', queryError?.message);
    return false;
  }

  console.log('[成功] 数据库记录已创建并可查询');

  // 4. 清理测试数据
  console.log('\n[步骤 5] 清理测试数据...');
  const { error: deleteError } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', verifiedPost.id);

  if (deleteError) {
    console.error('[警告] 删除失败:', deleteError.message);
  } else {
    console.log('[成功] 测试文章已清理');
  }

  // 总结
  console.log('\n========== 测试结果 ==========');
  console.log('✅ Supabase Auth 用户列表查询 - PASS');
  console.log('✅ 用户登录认证 - PASS');
  console.log('✅ API POST /posts 调用 - PASS');
  console.log('✅ 数据库记录验证 - PASS');
  console.log('✅ 测试数据清理 - PASS\n');

  return true;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   完整文章创建 API 集成测试                      ║');
  console.log('╚════════════════════════════════════════════════╝');

  const success = await testFullPostCreationFlow();

  if (!success) {
    process.exit(1);
  }

  console.log('\n🎉 所有集成测试通过！\n');
  process.exit(0);
}

main();
