'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            MyBlog
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/posts" className="text-sm font-medium hover:underline">
              博客
            </Link>
            <Link href="/videos" className="text-sm font-medium hover:underline">
              视频
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              关于
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              联系
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium hover:underline">
              登录
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              注册
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
