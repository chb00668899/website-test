import { test, expect } from '@playwright/test';

test('主页应该显示标题', async ({ page }) => {
  await page.goto('/');
  
  // 等待页面加载
  await page.waitForLoadState('networkidle');
  
  // 验证页面标题
  await expect(page).toHaveTitle(/网站/);
  
  // 验证主要标题存在
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});

test('导航栏应该包含链接', async ({ page }) => {
  await page.goto('/');
  
  // 验证导航栏存在（使用更具体的选择器避免 strict mode violation）
  const navbar = page.locator('header nav').first();
  await expect(navbar).toBeVisible();
  
  // 验证主要链接存在（使用 nth() 选择器避免 strict mode violation）
  const links = ['博客', '视频', '关于', '联系'];
  for (const link of links) {
    const linkElement = page.locator(`header nav a:has-text("${link}")`).first();
    await expect(linkElement).toBeVisible();
  }
});

test('应该可以访问博客页面', async ({ page }) => {
  await page.goto('/');
  
  // 点击博客链接
  await page.click('a:has-text("博客")');
  
  // 等待页面导航
  await page.waitForURL('/posts');
  await page.waitForLoadState('networkidle');
  
  // 验证博客页面标题
  await expect(page).toHaveTitle(/博客/);
});
