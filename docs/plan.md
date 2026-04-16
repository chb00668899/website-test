# 网站开发计划

## 项目概述
- **项目名称**：个人/专业博客网站
- **技术栈**：Next.js 14 + TypeScript + Tailwind CSS + Supabase + 阿里云OSS
- **架构策略**：动静分离 + 云端托管
- **部署方式**：Docker 容器化部署（阿里云轻量服务器）
- **开发模式**：渐进式开发，每个里程碑都有可运行的原型

---

## 里程碑 1：环境初始化与脚手架搭建

**目标**：快速搭建项目基础结构，验证开发环境，创建可运行的原型

### 验收标准
- [ ] 项目目录结构符合 plan.md 要求
- [ ] `npm run dev` 能正常启动，无报错
- [ ] `http://localhost:3000` 可访问，显示基础布局
- [ ] ESLint + Prettier 配置完成，代码格式化正常
- [ ] Docker 环境初始化完成
- [ ] 所有任务清单中的项已完成

### 任务清单
- [ ] 1.1 初始化 Next.js 14 项目
  - [ ] 1.1.1 创建项目目录 `website` (当前目录已存在)
  - [ ] 1.1.2 运行 `npx create-next-app@latest . --typescript --tailwind --app` 初始化项目
  - [ ] 1.1.3 验证开发服务器运行 `npm run dev`
- [ ] 1.2 Docker 环境初始化
  - [ ] 1.2.1 创建 `docker/Dockerfile`（应用镜像构建）
  - [ ] 1.2.2 创建 `docker/docker-compose.yml`（服务编排）
  - [ ] 1.2.3 创建 `docker/.dockerignore` 文件
  - [ ] 1.2.4 创建本地开发环境变量 `.env.local`（参考 `.env.local.example`）
  - [ ] 1.2.5 验证 Docker 容器启动 `docker-compose up --build`
- [ ] 1.2 配置开发环境
  - [ ] 1.2.1 创建 `.gitignore` 文件
  - [ ] 1.2.2 配置 ESLint（添加自定义规则）
  - [ ] 1.2.3 配置 Prettier（创建 `.prettierrc`）
  - [ ] 1.2.4 配置 EditorConfig（可选）
- [ ] 1.3 创建目录结构
  - [ ] 1.3.1 创建 `src/app/(public)` 目录（公开页面路由）
  - [ ] 1.3.2 创建 `src/app/(admin)` 目录（管理员路由）
  - [ ] 1.3.3 创建 `src/components/ui` 目录（基础UI组件）
  - [ ] 1.3.4 创建 `src/components/layout` 目录（布局组件）
  - [ ] 1.3.5 创建 `src/components/blog` 目录（博客相关组件）
  - [ ] 1.3.6 创建 `src/components/video` 目录（视频播放组件）
  - [ ] 1.3.7 创建 `src/lib` 目录（工具库）
  - [ ] 1.3.8 创建 `src/services` 目录（业务服务层）
  - [ ] 1.3.9 创建 `public/images` 目录（静态资源）
- [ ] 1.4 创建基础布局组件
  - [ ] 1.4.1 创建 `src/components/layout/Header.tsx`（网站头部）
  - [ ] 1.4.2 创建 `src/components/layout/Footer.tsx`（网站底部）
  - [ ] 1.4.3 创建 `src/components/layout/Navbar.tsx`（导航栏）
  - [ ] 1.4.4 创建 `src/components/layout/Container.tsx`（容器组件）
- [ ] 1.5 创建首页骨架页面
  - [ ] 1.5.1 创建 `src/app/page.tsx`（首页）
  - [ ] 1.5.2 在首页展示基础布局
  - [ ] 1.5.3 验证首页可访问 `http://localhost:3000`

---

## 里程碑 2：核心数据层搭建

**目标**：完成数据库和API对接，实现数据服务层

### 验收标准
- [ ] Supabase 项目创建完成，获取到 Project URL 和 API Key
- [ ] 数据库表（Posts、Categories、Tags、Comments、PostViews、PostLikes、Videos）创建完成
- [ ] Supabase 客户端工具类编写完成，类型定义完整
- [ ] 数据服务层（blogService、videoService）实现完成
- [ ] Server Actions（posts、comments、videos、likes、views API）实现完成
- [ ] Supabase 管理工具类（supabaseAdmin、authClient）编写完成
- [ ] 数据库初始化脚本编写完成，可执行

### 任务清单
- [ ] 2.1 创建 Supabase 项目
  - [ ] 2.1.1 访问 Supabase 官网注册账号
  - [ ] 2.1.2 创建新项目（项目名称：`blog-website`）
  - [ ] 2.1.3 获取 Project URL 和 API Key
  - [ ] 2.1.4 创建 `.env.local` 文件，添加 Supabase 配置
- [ ] 2.2 设计并创建数据库表
  - [ ] 2.2.1 创建 `Posts` 表（博客文章）
  - [ ] 2.2.2 创建 `Categories` 表（分类）
  - [ ] 2.2.3 创建 `Tags` 表（标签）
  - [ ] 2.2.4 创建 `Comments` 表（评论）
  - [ ] 2.2.5 创建 `PostViews` 表（浏览统计）
  - [ ] 2.2.6 创建 `PostLikes` 表（点赞统计）
  - [ ] 2.2.7 创建 `Videos` 表（视频）
- [ ] 2.3 编写 Supabase 客户端工具类
  - [ ] 2.3.1 创建 `src/lib/supabase.ts`（客户端初始化）
  - [ ] 2.3.2 创建 `src/lib/types.ts`（TypeScript 类型定义）
  - [ ] 2.3.3 创建 `src/lib/utils.ts`（工具函数）
- [ ] 2.4 实现数据服务层
  - [ ] 2.4.1 创建 `src/services/blogService.ts`（博客数据服务）
    - [ ] 2.4.1.1 实现 `getPosts()` - 获取博客列表
    - [ ] 2.4.1.2 实现 `getPostBySlug()` - 获取博客详情
    - [ ] 2.4.1.3 实现 `getCategories()` - 获取分类列表
    - [ ] 2.4.1.4 实现 `getTags()` - 获取标签列表
  - [ ] 2.4.2 创建 `src/services/videoService.ts`（视频数据服务）
    - [ ] 2.4.2.1 实现 `getVideos()` - 获取视频列表
    - [ ] 2.4.2.2 实现 `getVideoById()` - 获取视频详情
- [ ] 2.5 实现 Server Actions
  - [ ] 2.5.1 创建 `src/app/api/posts/route.ts`（博客 API）
  - [ ] 2.5.2 创建 `src/app/api/comments/route.ts`（评论 API）
  - [ ] 2.5.3 创建 `src/app/api/videos/route.ts`（视频 API）
  - [ ] 2.5.4 创建 `src/app/api/likes/route.ts`（点赞 API）
  - [ ] 2.5.5 创建 `src/app/api/views/route.ts`（浏览统计 API）
- [ ] 2.6 创建 Supabase 管理工具类
  - [ ] 2.6.1 创建 `src/lib/supabaseAdmin.ts`（管理客户端）
  - [ ] 2.6.2 创建 `src/lib/authClient.ts`（认证客户端）
- [ ] 2.7 编写数据库初始化脚本
  - [ ] 2.7.1 创建 `supabase/migrations/000001_create_tables.sql`
  - [ ] 2.7.2 创建 `supabase/migrations/000002_add_sample_data.sql`
  - [ ] 2.7.3 编写数据库种子脚本

---

## 里程碑 3：博客功能模块

**目标**：实现完整的博客展示和管理功能

### 验收标准
- [ ] 博客列表页面（/posts）可正常访问，显示博客卡片
- [ ] 博客详情页面（/posts/[slug]）可正常访问，支持 Markdown 渲染
- [ ] 评论功能可正常提交和显示
- [ ] 后台博客管理页面可正常访问（/admin/posts）
- [ ] 分类和标签管理页面可正常访问（/admin/categories、/admin/tags）
- [ ] 浏览和点赞统计功能正常工作

### 任务清单
- [ ] 3.1 创建博客列表页面
  - [ ] 3.1.1 创建 `src/app/(public)/posts/page.tsx`
  - [ ] 3.1.2 实现博客卡片组件 `src/components/blog/BlogCard.tsx`
  - [ ] 3.1.3 实现分页功能（加载更多/无限滚动）
- [ ] 3.1.4 实现分类筛选功能
- [ ] 3.2 创建博客详情页面
  - [ ] 3.2.1 创建 `src/app/(public)/posts/[slug]/page.tsx`
  - [ ] 3.2.2 创建 `src/components/blog/MarkdownRenderer.tsx`（Markdown渲染器）
  - [ ] 3.2.3 创建 `src/components/blog/PostMeta.tsx`（文章元信息）
  - [ ] 3.2.4 创建 `src/components/blog/PostNav.tsx`（上一篇/下一篇导航）
  - [ ] 3.2.5 集成代码高亮（react-syntax-highlighter）
  - [ ] 3.2.6 集成目录导航（tocbot）
- [ ] 3.3 创建评论功能
  - [ ] 3.3.1 创建 `src/components/blog/CommentList.tsx`（评论列表）
  - [ ] 3.3.2 创建 `src/components/blog/CommentForm.tsx`（评论表单）
  - [ ] 3.3.3 实现评论提交功能
  - [ ] 3.3.4 实现评论点赞功能
- [ ] 3.4 创建后台博客管理
  - [ ] 3.4.1 创建 `src/app/(admin)/posts/page.tsx`（博客列表管理）
  - [ ] 3.4.2 创建 `src/app/(admin)/posts/new/page.tsx`（新建博客）
  - [ ] 3.4.3 创建 `src/app/(admin)/posts/[id]/edit/page.tsx`（编辑博客）
  - [ ] 3.4.4 创建富文本/Markdown 编辑器组件
  - [ ] 3.4.5 实现图片上传功能（OSS）
  - [ ] 3.4.6 实现文章发布/草稿功能
- [ ] 3.5 创建分类和标签管理
  - [ ] 3.5.1 创建 `src/app/(admin)/categories/page.tsx`
  - [ ] 3.5.2 创建 `src/app/(admin)/tags/page.tsx`
  - [ ] 3.5.3 实现分类/标签的 CRUD 功能
- [ ] 3.6 实现浏览和点赞统计
  - [ ] 3.6.1 创建 `src/lib/analytics.ts`（统计工具类）
  - [ ] 3.6.2 实现浏览计数器组件
  - [ ] 3.6.3 实现点赞功能组件

---

## 里程碑 4：视频功能模块

**目标**：实现视频列表和播放功能

### 验收标准
- [ ] 阿里云 OSS SDK 集成完成，配置文件和工具类编写完成
- [ ] 视频列表页面（/videos）可正常访问，显示视频卡片
- [ ] 视频播放页面（/videos/[id]）可正常访问，播放器功能正常
- [ ] 后台视频管理页面可正常访问（/admin/videos）
- [ ] 视频上传功能可正常上传到 OSS

### 任务清单
- [ ] 4.1 集成阿里云 OSS SDK
  - [ ] 4.1.1 安装 `ali-oss` 包
  - [ ] 4.1.2 创建 OSS 配置文件 `src/config/oss.ts`
  - [ ] 4.1.3 创建 OSS 客户端工具类 `src/lib/ossClient.ts`
  - [ ] 4.1.4 实现前端直传 OSS 组件 `src/components/oss/OssUpload.tsx`
- [ ] 4.2 创建视频列表页面
  - [ ] 4.2.1 创建 `src/app/(public)/videos/page.tsx`
  - [ ] 4.2.2 创建视频卡片组件 `src/components/video/VideoCard.tsx`
  - [ ] 4.2.3 实现视频分类筛选功能
- [ ] 4.3 创建视频播放页面
  - [ ] 4.3.1 创建 `src/app/(public)/videos/[id]/page.tsx`
  - [ ] 4.3.2 创建视频播放器组件 `src/components/video/VideoPlayer.tsx`
  - [ ] 4.3.3 集成 HTML5 播放器（video.js 或原生播放器）
  - [ ] 4.3.4 实现倍速播放功能
  - [ ] 4.3.5 实现清晰度切换功能
  - [ ] 4.3.6 实现进度条和时间显示
- [ ] 4.4 创建后台视频管理
  - [ ] 4.4.1 创建 `src/app/(admin)/videos/page.tsx`（视频列表管理）
  - [ ] 4.4.2 创建 `src/app/(admin)/videos/new/page.tsx`（上传视频）
  - [ ] 4.4.3 创建 `src/app/(admin)/videos/[id]/edit/page.tsx`（编辑视频）
  - [ ] 4.4.4 实现视频封面图上传
  - [ ] 4.4.5 实现视频元数据管理
- [ ] 4.5 创建视频上传组件
  - [ ] 4.5.1 创建 `src/components/video/VideoUpload.tsx`
  - [ ] 4.5.2 实现分片上传功能
  - [ ] 4.5.3 实现上传进度显示
  - [ ] 4.5.4 实现上传取消功能

---

## 里程碑 5：认证与权限

**目标**：实现用户登录和权限控制

### 验收标准
- [ ] Supabase Auth 集成完成，登录/注册页面可正常访问
- [ ] 登录/登出功能正常工作，登录状态管理正常
- [ ] 管理员权限验证功能正常，未登录用户无法访问后台
- [ ] 管理员个人中心页面可正常访问，个人信息展示正常

### 任务清单
- [ ] 5.1 集成 Supabase Auth
  - [ ] 5.1.1 安装 `@supabase/auth-ui-react` 和 `@supabase/auth-ui-shared`
  - [ ] 5.1.2 创建 `src/lib/authClient.ts`（认证客户端）
  - [ ] 5.1.3 创建认证 UI 组件（登录/注册表单）
- [ ] 5.2 实现登录/登出功能
  - [ ] 5.2.1 创建 `src/app/(public)/login/page.tsx`（登录页）
  - [ ] 5.2.2 创建 `src/app/(public)/register/page.tsx`（注册页）
  - [ ] 5.2.3 创建 `src/components/auth/AuthForm.tsx`（认证表单）
  - [ ] 5.2.4 实现登录状态管理（Context）
  - [ ] 5.2.5 创建认证状态上下文 `src/contexts/AuthContext.tsx`
- [ ] 5.3 实现管理员权限验证
  - [ ] 5.3.1 创建中间件 `src/middleware.ts`（路由守卫）
  - [ ] 5.3.2 创建 `src/lib/permissions.ts`（权限检查工具）
  - [ ] 5.3.3 创建 `src/components/auth/ProtectedRoute.tsx`（保护路由组件）
- [ ] 5.4 创建管理员个人中心
  - [ ] 5.4.1 创建 `src/app/(admin)/profile/page.tsx`（个人中心）
  - [ ] 5.4.2 创建 `src/components/profile/ProfileInfo.tsx`（个人信息展示）
  - [ ] 5.4.3 创建 `src/components/profile/ProfileForm.tsx`（个人信息编辑）

---

## 里程碑 6：Docker 部署与优化

**目标**：完成 Docker 容器化部署，优化性能和SEO

### 验收标准
- [ ] Dockerfile 配置完成，可构建应用镜像
- [ ] docker-compose.yml 配置完成，可一键启动服务
- [ ] 阿里云 OSS 配置完成，可上传视频文件
- [ ] `.env.local` 配置完成，包含所有必要的环境变量
- [ ] 在阿里云轻量服务器上成功部署
- [ ] SEO 优化完成（meta标签、sitemap、robots.txt）
- [ ] 性能优化完成（代码分割、图片优化、懒加载）
- [ ] 监控和日志配置完成（Sentry、日志服务）

### 任务清单
- [ ] 6.1 Docker 环境配置
  - [ ] 6.1.1 优化 `docker/Dockerfile`（多阶段构建，减小镜像体积）
  - [ ] 6.1.2 优化 `docker/docker-compose.yml`（添加环境变量、卷挂载）
  - [ ] 6.1.3 配置 Docker 网络和端口映射
  - [ ] 6.1.4 创建 `docker/.env.example`（环境变量示例）
- [ ] 6.2 阿里云 OSS 配置
  - [ ] 6.2.1 开通阿里云 OSS 服务
  - [ ] 6.2.2 创建 OSS Bucket（建议开启公共读或配置 CDN）
  - [ ] 6.2.3 获取 AccessKey ID 和 AccessKey Secret
  - [ ] 6.2.4 配置 OSS 防盗链（可选）
  - [ ] 6.2.5 在 `.env.local` 中添加 OSS 配置
- [ ] 6.3 集成阿里云 OSS SDK
  - [ ] 6.3.1 安装 `ali-oss` 包
  - [ ] 6.3.2 创建 OSS 配置文件 `src/config/oss.ts`
  - [ ] 6.3.3 创建 OSS 客户端工具类 `src/lib/ossClient.ts`
  - [ ] 6.3.4 实现前端直传 OSS 组件 `src/components/oss/OssUpload.tsx`
- [ ] 6.4 部署到阿里云轻量服务器
  - [ ] 6.4.1 在阿里云服务器上安装 Docker 和 Docker Compose
  - [ ] 6.4.2 将项目上传到服务器（git clone 或 scp）
  - [ ] 6.4.3 在服务器上构建并启动 Docker 容器
  - [ ] 6.4.4 配置 Nginx 反向代理（可选）
  - [ ] 6.4.5 配置 HTTPS（使用 Let's Encrypt 证书）
  - [ ] 6.4.6 验证部署成功（访问公网 IP 或域名）
- [ ] 6.5 SEO 优化
  - [ ] 6.5.1 集成 `next-seo` 库
  - [ ] 6.5.2 创建 `src/components/seo/SEO.tsx`（SEO组件）
  - [ ] 6.5.3 生成 sitemap.xml
  - [ ] 6.5.4 生成 robots.txt
- [ ] 6.6 性能优化
  - [ ] 6.6.1 集成 `next/image`（图片优化）
  - [ ] 6.6.2 实现代码分割（动态导入）
  - [ ] 6.6.3 实现懒加载（图片、视频）
  - [ ] 6.6.4 优化 bundle 体积
- [ ] 6.7 监控和日志
  - [ ] 6.7.1 集成 Sentry（错误监控）
- [ ] 6.7.2 配置 Docker 日志驱动
  - [ ] 6.7.3 创建日志工具类 `src/lib/logger.ts`

---

## 里程碑 7：测试和部署

**目标**：实现完整的测试套件，完成 CI/CD 配置，准备生产部署

### 验收标准
- [ ] Vitest 配置完成，测试环境正常运行
- [ ] 单元测试覆盖核心功能模块
- [ ] 端到端测试覆盖主要用户流程
- [ ] CI/CD 流程配置完成（GitHub Actions）
- [ ] 部署文档编写完成

### 任务清单
- [ ] 7.1 测试配置
  - [ ] 7.1.1 安装测试依赖（Vitest, Testing Library）
  - [ ] 7.1.2 创建 Vitest 配置文件（vitest.config.ts）
  - [ ] 7.1.3 创建测试设置文件（src/test/setup.ts）
  - [ ] 7.1.4 配置测试环境变量
- [ ] 7.2 单元测试
  - [ ] 7.2.1 创建服务层测试（src/services/__tests__/）
    - [ ] 7.2.1.1 postService.test.ts
    - [ ] 7.2.1.2 videoService.test.ts
    - [ ] 7.2.1.3 commentService.test.ts
  - [ ] 7.2.2 创建组件测试（src/components/__tests__/）
    - [ ] 7.2.2.1 LikeButton.test.tsx
    - [ ] 7.2.2.2 CommentForm.test.tsx
    - [ ] 7.2.2.3 VideoPlayer.test.tsx
  - [ ] 7.2.3 创建工具函数测试（src/lib/__tests__/）
    - [ ] 7.2.3.1 utils.test.ts
    - [ ] 7.2.3.2 permissions.test.ts
- [ ] 7.3 端到端测试
  - [ ] 7.3.1 安装 Playwright 或 Cypress
  - [ ] 7.3.2 创建 E2E 测试配置
  - [ ] 7.3.3 编写主要用户流程测试
    - [ ] 7.3.3.1 首页浏览测试
    - [ ] 7.3.3.2 博客阅读测试
    - [ ] 7.3.3.3 评论提交测试
    - [ ] 7.3.3.4 登录/登出测试
- [ ] 7.4 CI/CD 配置
  - [ ] 7.4.1 创建 GitHub Actions 工作流（.github/workflows/ci.yml）
  - [ ] 7.4.2 配置自动测试运行
  - [ ] 7.4.3 配置代码质量检查（ESLint, TypeScript）
  - [ ] 7.4.4 配置自动部署（Docker Hub 推送）
- [ ] 7.5 部署准备
  - [ ] 7.5.1 创建部署文档（deployment.md）
  - [ ] 7.5.2 创建环境变量模板（.env.example）
  - [ ] 7.5.3 创建监控和日志配置
  - [ ] 7.5.4 创建备份和恢复脚本
