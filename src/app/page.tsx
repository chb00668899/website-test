'use client';

import React from 'react';
import Link from 'next/link';
// Button component import removed - using Link with button styles instead
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { BlogCard } from '../components/blog/BlogCard';
import { VideoCard } from '../components/video/VideoCard';

const Home = () => {
  const recentPosts = [
    {
      id: '1',
      title: 'Next.js 14 完整教程',
      slug: 'nextjs-14-complete-guide',
      excerpt: '学习如何使用 Next.js 14 构建现代 Web 应用，包括 App Router、Server Components 等新特性。',
      date: '2024-01-15',
      category: '前端开发',
      readTime: '5 分钟',
      image: '/images/nextjs-cover.jpg',
    },
    {
      id: '2',
      title: 'TypeScript 类型系统详解',
      slug: 'typescript-type-system',
      excerpt: '深入理解 TypeScript 的类型系统，掌握高级类型操作。',
      date: '2024-01-10',
      category: 'TypeScript',
      readTime: '8 分钟',
      image: '/images/typescript-cover.jpg',
    },
    {
      id: '3',
      title: 'Docker 容器化部署实战',
      slug: 'docker-deployment-guide',
      excerpt: '学习如何使用 Docker 容器化部署你的 Web 应用。',
      date: '2024-01-05',
      category: 'DevOps',
      readTime: '6 分钟',
      image: '/images/docker-cover.jpg',
    },
  ];

  const recentVideos = [
    {
      id: '1',
      title: 'Next.js 性能优化技巧',
      description: '掌握 Next.js 的各种性能优化技巧，让你的网站速度飞快',
      thumbnail: '/images/video-thumb-1.svg',
      duration: '12:30',
      views: 1234,
    },
    {
      id: '2',
      title: 'Tailwind CSS 实战演练',
      description: '通过实际案例学习 Tailwind CSS 的各种实用技巧',
      thumbnail: '/images/video-thumb-2.svg',
      duration: '15:45',
      views: 987,
    },
    {
      id: '3',
      title: 'React Query 数据管理',
      description: '深入理解 React Query 的工作原理和最佳实践',
      thumbnail: '/images/video-thumb-3.svg',
      duration: '18:20',
      views: 765,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          分享技术与思考
          <br />
          记录成长与进步
        </h1>
        <p className="mb-8 max-w-2xl mx-auto text-xl text-muted-foreground">
          这是一个基于 Next.js 和 TypeScript 构建的个人博客网站，
          分享前端开发、TypeScript、Docker 等技术文章和视频教程。
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/posts" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md">
            浏览文章
          </Link>
          <Link href="/videos" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md">
            观看视频
          </Link>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Link href="/posts" className="text-sm font-medium text-primary hover:underline">
            查看更多
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      {/* Recent Videos Section */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新视频</h2>
          <Link href="/videos" className="text-sm font-medium text-primary hover:underline">
            查看更多
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>关于我</CardTitle>
            <CardDescription>
              一个热爱技术的开发者，专注于前端开发和技术分享
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              我是一名全栈开发者，专注于使用 Next.js、TypeScript 等现代技术构建高质量的 Web 应用。
              这个博客网站是我分享技术经验和学习心得的地方。
            </p>
            <p>
              在这里，你将找到关于前端开发、TypeScript、Docker 等技术的深入文章和视频教程。
              希望我的分享能帮助到你！
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
