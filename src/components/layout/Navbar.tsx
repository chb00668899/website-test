'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          MyBlog
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/posts" className="text-sm font-medium transition-colors hover:text-primary">
            博客
          </Link>
          <Link href="/videos" className="text-sm font-medium transition-colors hover:text-primary">
            视频
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            关于
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            联系
          </Link>
          <div className="ml-4 flex items-center space-x-4">
            <button className="text-sm font-medium transition-colors hover:text-primary">
              登录
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              注册
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/posts"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              博客
            </Link>
            <Link
              href="/videos"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              视频
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              关于
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              联系
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <button className="w-full rounded-md border py-2 text-sm font-medium">
                登录
              </button>
              <button className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground">
                注册
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
