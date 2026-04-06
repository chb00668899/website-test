'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">MyBlog</h3>
            <p className="text-sm text-muted-foreground">
              一个基于 Next.js 和 TypeScript 的个人博客网站
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              栏目
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/posts" className="text-sm text-muted-foreground hover:text-primary">
                  博客文章
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-muted-foreground hover:text-primary">
                  视频专栏
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  关于我
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  联系我
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              连接
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              联系
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">邮箱: admin@myblog.com</li>
              <li className="text-sm text-muted-foreground">微信: myblog_official</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} MyBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
