# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-post-creation.spec.ts >> Form Validation Tests >> should generate slug from title
- Location: src\e2e\admin-post-creation.spec.ts:282:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: ""
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "MyBlog" [ref=e6]:
          - /url: /
        - navigation [ref=e7]:
          - link "博客" [ref=e8]:
            - /url: /posts
          - link "视频" [ref=e9]:
            - /url: /videos
          - link "关于" [ref=e10]:
            - /url: /about
          - link "联系" [ref=e11]:
            - /url: /contact
        - generic [ref=e12]:
          - button "登录" [ref=e13]
          - button "注册" [ref=e14]
    - navigation [ref=e15]:
      - generic [ref=e16]:
        - link "MyBlog" [ref=e17]:
          - /url: /
        - generic [ref=e18]:
          - link "博客" [ref=e19]:
            - /url: /posts
          - link "视频" [ref=e20]:
            - /url: /videos
          - link "关于" [ref=e21]:
            - /url: /about
          - link "联系" [ref=e22]:
            - /url: /contact
          - generic [ref=e23]:
            - button "登录" [ref=e24]
            - button "注册" [ref=e25]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - heading "创建新文章" [level=1] [ref=e30]
            - paragraph [ref=e31]: 撰写您的新博客文章
          - link "返回列表" [ref=e32]:
            - /url: /admin/posts
        - generic [ref=e34]:
          - generic [ref=e36]:
            - heading "文章内容" [level=2] [ref=e37]
            - generic [ref=e38]:
              - generic [ref=e39]:
                - generic [ref=e40]: 标题
                - textbox "输入文章标题" [active] [ref=e41]
              - generic [ref=e42]:
                - generic [ref=e43]: Slug
                - textbox "输入文章 slug" [ref=e44]
              - generic [ref=e45]:
                - generic [ref=e46]: 内容
                - textbox "输入文章内容（支持 Markdown）" [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - heading "设置" [level=2] [ref=e50]
              - generic [ref=e51]:
                - generic [ref=e52]:
                  - generic [ref=e53]: 状态
                  - generic [ref=e54]:
                    - generic [ref=e55]:
                      - radio "已发布" [ref=e56]
                      - text: 已发布
                    - generic [ref=e57]:
                      - radio "草稿" [checked] [ref=e58]
                      - text: 草稿
                - generic [ref=e59]:
                  - generic [ref=e60]: 分类
                  - combobox [ref=e61]
                - generic [ref=e62]:
                  - generic [ref=e63]: 标签
                  - generic [ref=e65]:
                    - textbox "输入标签后按回车" [ref=e66]
                    - button "添加" [ref=e67]
            - generic [ref=e68]:
              - heading "预览" [level=2] [ref=e69]
              - generic [ref=e70]:
                - generic [ref=e71]:
                  - strong [ref=e72]: "标题:"
                  - text: 未填写
                - generic [ref=e73]:
                  - strong [ref=e74]: "Slug:"
                  - text: 未填写
                - generic [ref=e75]:
                  - strong [ref=e76]: "状态:"
                  - text: 草稿
                - generic [ref=e77]:
                  - strong [ref=e78]: "分类:"
                  - text: 未选择
                - generic [ref=e79]:
                  - strong [ref=e80]: "标签:"
                  - text: 无
                - generic [ref=e81]:
                  - strong [ref=e82]: "字数:"
                  - text: "0"
            - button "发布文章" [ref=e83]
    - contentinfo [ref=e84]:
      - generic [ref=e85]:
        - generic [ref=e86]:
          - generic [ref=e87]:
            - heading "MyBlog" [level=3] [ref=e88]
            - paragraph [ref=e89]: 一个基于 Next.js 和 TypeScript 的个人博客网站
          - generic [ref=e90]:
            - heading "栏目" [level=3] [ref=e91]
            - list [ref=e92]:
              - listitem [ref=e93]:
                - link "博客文章" [ref=e94]:
                  - /url: /posts
              - listitem [ref=e95]:
                - link "视频专栏" [ref=e96]:
                  - /url: /videos
              - listitem [ref=e97]:
                - link "关于我" [ref=e98]:
                  - /url: /about
              - listitem [ref=e99]:
                - link "联系我" [ref=e100]:
                  - /url: /contact
          - generic [ref=e101]:
            - heading "连接" [level=3] [ref=e102]
            - list [ref=e103]:
              - listitem [ref=e104]:
                - link "GitHub" [ref=e105]:
                  - /url: https://github.com
              - listitem [ref=e106]:
                - link "Twitter" [ref=e107]:
                  - /url: https://twitter.com
              - listitem [ref=e108]:
                - link "LinkedIn" [ref=e109]:
                  - /url: https://linkedin.com
          - generic [ref=e110]:
            - heading "联系" [level=3] [ref=e111]
            - list [ref=e112]:
              - listitem [ref=e113]: "邮箱: admin@myblog.com"
              - listitem [ref=e114]: "微信: myblog_official"
        - paragraph [ref=e116]: © 2026 MyBlog. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e122] [cursor=pointer]:
    - img [ref=e123]
  - alert [ref=e128]
```

# Test source

```ts
  198 |     });
  199 | 
  200 |     // 在文章列表中查找刚创建的文章
  201 |     const articleTitle = testPost.title;
  202 | 
  203 |     // 方法 1: 通过表格内容搜索
  204 |     try {
  205 |       const tableContent = await page.locator('table tbody').first().textContent();
  206 | 
  207 |       if (tableContent && tableContent.includes(new URLSearchParams(testEmailSuffix.split('@')[0]).get('test') || 'test')) {
  208 |         console.log(`✅ Found post in article list`);
  209 |       }
  210 |     } catch (error) {
  211 |       console.log(`⚠️ Article list verification - checking alternative methods...`);
  212 |     }
  213 | 
  214 |     // 方法 2: 通过 API 验证（更可靠的方式）
  215 |     const apiResponse = await page.request.get('/api/posts');
  216 |     const posts = await apiResponse.json();
  217 | 
  218 |     if (Array.isArray(posts)) {
  219 |       const latestPost = posts.find((post: any) =>
  220 |         post.title?.includes('E2E Test Post') &&
  221 |         post.author_id // 验证有 author_id（说明是登录后创建的）
  222 |       );
  223 | 
  224 |       if (latestPost) {
  225 |         console.log(`✅ E2E test post verified in database:`);
  226 |         console.log(`   - ID: ${latestPost.id}`);
  227 |         console.log(`   - Title: ${latestPost.title}`);
  228 |         console.log(`   - Status: ${latestPost.status}`);
  229 |         console.log(`   - Author: ${latestPost.author_id?.slice(0, 8)}...`);
  230 | 
  231 |         // 验证关键字段存在
  232 |         expect(latestPost.title).toContain('E2E Test Post');
  233 |         expect(latestPost.content).toBeTruthy();
  234 |         expect(latestPost.tags).toBeTruthy();
  235 |       } else {
  236 |         console.log(`⚠️ Could not find E2E test post in database`);
  237 |       }
  238 |     }
  239 | 
  240 |     // 清理：删除刚创建的测试文章（可选）
  241 |     if (latestPost) {
  242 |       try {
  243 |         await page.request.delete(`/api/posts/${latestPost.id}`, {
  244 |           headers: {
  245 |             'Content-Type': 'application/json',
  246 |           },
  247 |         });
  248 |         console.log(`🧹 Cleanup: Deleted test post ${latestPost.id}`);
  249 |       } catch (error) {
  250 |         console.log(`⚠️ Could not delete test post: ${error}`);
  251 |       }
  252 |     }
  253 |   });
  254 | });
  255 | 
  256 | /**
  257 |  * 独立测试：表单验证和错误处理
  258 |  */
  259 | test.describe('Form Validation Tests', () => {
  260 |   test('should show validation errors for empty required fields', async ({ page }) => {
  261 |     console.log(`\n[Additional Test] Testing form validation`);
  262 | 
  263 |     await page.goto('/admin/posts/new');
  264 | 
  265 |     // 尝试提交空表单
  266 |     const submitButton = page.locator('button[type="submit"]');
  267 | 
  268 |     await Promise.all([
  269 |       page.waitForResponse('/api/posts', { timeout: 5000 }).catch(() => null),
  270 |       submitButton.click(),
  271 |     ]);
  272 | 
  273 |     // 验证是否有错误提示或表单未提交
  274 |     // 这取决于具体的实现，这里检查常见模式
  275 |     const hasError = await page.locator('[class*="error"], [role="alert"]').count() > 0;
  276 | 
  277 |     if (!hasError) {
  278 |       console.log(`✅ Form validation working (prevented empty submission)`);
  279 |     }
  280 |   });
  281 | 
  282 |   test('should generate slug from title', async ({ page }) => {
  283 |     console.log(`\n[Additional Test] Testing auto slug generation`);
  284 | 
  285 |     await page.goto('/admin/posts/new');
  286 | 
  287 |     const titleInput = page.locator('input[placeholder*="标题"]');
  288 |     const slugInput = page.locator('input[placeholder*="slug"]');
  289 | 
  290 |     const testTitle = 'Test Title With Special Chars!';
  291 | 
  292 |     await titleInput.fill(testTitle);
  293 |     await page.waitForTimeout(1000);
  294 | 
  295 |     const generatedSlug = await slugInput.inputValue();
  296 | 
  297 |     // 验证 slug 包含标题的关键部分
> 298 |     expect(generatedSlug).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
  299 |     expect(generatedSlug).toContain('test');
  300 | 
  301 |     console.log(`✅ Slug auto-generated: "${generatedSlug}"`);
  302 |   });
  303 | });
  304 | 
```