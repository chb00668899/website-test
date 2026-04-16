import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '../lib/utils';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ClientLayout } from '../components/layout/ClientLayout';
import { QueryProvider } from '../components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MyBlog - 个人博客网站',
  description: '一个基于 Next.js 和 TypeScript 的个人博客网站',
  keywords: ['博客', 'Next.js', 'TypeScript', '个人博客'],
  authors: [{ name: 'MyBlog' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'MyBlog - 个人博客网站',
    description: '一个基于 Next.js 和 TypeScript 的个人博客网站',
    siteName: 'MyBlog',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn('font-sans', inter.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <ClientLayout>
              <main className="flex-1">{children}</main>
            </ClientLayout>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
