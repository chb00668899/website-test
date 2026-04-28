'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, refetch } = useUser();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      refetch?.();
      window.location.href = '/';
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

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
            {isLoggedIn ? (
              <>
                <Link
                  href="/admin/posts"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  博客管理
                </Link>
                <Link
                  href="/admin/videos"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  视频管理
                </Link>
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button onClick={handleLogout} className="text-sm font-medium transition-colors hover:text-red-500">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
                  登录
                </Link>
                <Link href="/login?register=true" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  注册
                </Link>
              </>
            )}
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
            {isLoggedIn ? (
              <>
                <Link
                  href="/admin/posts"
                  className="text-sm font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  博客管理
                </Link>
                <Link
                  href="/admin/videos"
                  className="text-sm font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  视频管理
                </Link>
                <span className="text-sm text-gray-500 px-2">{user?.email}</span>
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                  className="text-left text-sm font-medium py-2 text-red-500"
                >
                  退出登录
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login" className="w-full rounded-md border py-2 text-center text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  登录
                </Link>
                <Link href="/login?register=true" className="w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground" onClick={() => setIsMenuOpen(false)}>
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
