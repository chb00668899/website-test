import { test, expect } from '@playwright/test';

test('博客列表页面应该显示文章列表', async ({ page }) => {
  await page.goto('/posts');
  await page.waitForLoadState('networkidle');
  
  // 验证页面标题
  await expect(page).toHaveTitle(/博客/);
  
  // 验证文章卡片存在（使用 Card 组件的类名）
  // 添加更长的超时时间等待数据加载
  const cards = page.locator('div.rounded-xl.border');
  await expect(cards.first()).toBeVisible({ timeout: 10000 });
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

test('应该可以访问单个博客文章', async ({ page }) => {
  await page.goto('/posts');
  await page.waitForLoadState('networkidle');
  
  // 获取第一篇文章的链接
  const firstPostLink = page.locator('div.rounded-xl.border a:has-text("阅读详情")').first();
  
  if (await firstPostLink.count() > 0) {
    const postUrl = await firstPostLink.getAttribute('href');
    
    if (postUrl) {
      await firstPostLink.click();
      await page.waitForURL(postUrl);
      await page.waitForLoadState('networkidle');
      
      // 验证文章详情页面标题
      await expect(page).toHaveTitle(/.*博客.*/);
    }
  }
});

test('博客页面应该有分页导航', async ({ page }) => {
  await page.goto('/posts');
  await page.waitForLoadState('networkidle');
  
  // 验证分页控件存在（使用按钮）
  const pagination = page.locator('div.flex.justify-center.items-center.gap-2 button, div.flex.justify-center.items-center.gap-2 span:text("第")');
  await expect(pagination.first()).toBeVisible({ timeout: 10000 });
});
