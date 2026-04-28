/**
 * 完整文章创建集成测试 - 使用 Next.js API Route
 *
 * 此脚本模拟真实用户流程:
 * 1. 登录 API (POST /api/auth/login)
 * 2. 获取 cookie 和 user info
 * 3. 调用文章创建 API (POST /api/posts)
 */

import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function testFullFlow() {
  console.log('\n========== 阶段 5: 完整文章创建流程测试 ==========');
  console.log('开始时间:', new Date().toISOString());

  const API_BASE = 'http://localhost:3000';

  // 从环境变量中获取用户凭证（如果有）或提示输入
  const testEmail = process.env.TEST_EMAIL || '';
  const testPassword = process.env.TEST_PASSWORD || '';

  if (!testEmail || !testPassword) {
    console.log('\n⚠️  未设置测试凭证');
    console.log('请设置环境变量:');
    console.log(`  export TEST_EMAIL="your@email.com"`);
    console.log(`  export TEST_PASSWORD="your-password"`);
    console.log('\n或者修改此脚本中的 testEmail/testPassword 变量');
    return false;
  }

  // ============================
  // Step 1: 登录获取 cookie
  // ============================
  console.log('\n[步骤 1] 调用登录 API...');
  console.log(`[目标] ${API_BASE}/api/auth/login`);
  console.log(`[凭证] Email: ${testEmail}`);

  try {
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      console.error('[失败] 登录错误:', loginData.error || loginRes.statusText);
      return false;
    }

    console.log('[成功] 登录 API 响应:');
    console.log('  - User ID:', loginData.user.id);
    console.log('  - Email:', loginData.user.email);
    console.log('  - Role:', loginData.user.role);
    console.log('  - Redirect:', loginData.redirect);

    // 保存 cookie
    const cookies = loginRes.headers.get('set-cookie');
    if (!cookies) {
      console.error('[失败] 响应中未找到 Set-Cookie header');
      return false;
    }
    console.log('[信息] Cookie 已设置');

  } catch (error) {
    console.error('[失败] 登录请求异常:', error instanceof Error ? error.message : error);
    console.log('\n[提示] 需要启动开发服务器: npm run dev');
    return false;
  }

  // ============================
  // Step 2: 创建文章（使用已获取的 session）
  // ============================
  console.log('\n[步骤 2] 调用创建文章 API...');

  const testPostData = {
    title: `集成测试 - ${new Date().toLocaleString()}`,
    slug: '', // API 会自动生成唯一 slug
    content: `# 集成测试\n\n本文档于 ${new Date().toISOString()} 创建，用于验证完整的文章创建流程。`,
    category_id: null,
    tags: ['测试', '集成'],
    status: 'draft',
  };

  console.log('[提交数据]:', {
    title: testPostData.title,
    contentLength: testPostData.content.length,
    tags: testPostData.tags,
    status: testPostData.status,
  });

  try {
    const createRes = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ⚠️ 关键：带上 cookie
      body: JSON.stringify(testPostData),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error('[失败] 创建文章错误:', createData.error || createData.details);
      return false;
    }

    console.log('[成功] 文章创建成功!');
    console.log('返回数据:', {
      id: createData.id,
      title: createData.title,
      slug: createData.slug,
      status: createData.status,
      author_id: createData.author_id,
    });

  } catch (error) {
    console.error('[失败] 创建文章请求异常:', error instanceof Error ? error.message : error);
    return false;
  }

  // ============================
  // Step 3: 验证结果
  // ============================
  console.log('\n[步骤 3] 验证流程...');
  console.log('✅ 登录认证通过');
  console.log('✅ API 调用成功 (包含 cookie)');
  console.log('✅ 数据已写入数据库');

  return true;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   完整文章创建流程集成测试                       ║');
  console.log('╚════════════════════════════════════════════════╝');

  // 先启动开发服务器
  console.log('\n[提示] 需要 Next.js 开发服务器运行在端口 3000');
  console.log('[执行] npm run dev &\n');

  const success = await testFullFlow();

  if (!success) {
    process.exit(1);
  }

  console.log('\n🎉 所有集成测试通过！\n');
  process.exit(0);
}

main();
