'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '@/components/ui/Badge';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  category?: string;
  readTime?: string;
  image?: string;
}

export const BlogCard = ({
  id,
  title,
  slug,
  excerpt,
  content,
  date,
  category,
  readTime,
  image,
}: BlogCardProps) => {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取分类
  const cat = category || '未分类';

  // 获取摘要
  const getExcerptText = (text: string | unknown): string => {
    if (typeof text === 'string') {
      return text.slice(0, 100) + '...';
    }
    return '暂无摘要...';
  };

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{cat}</Badge>
          <span className="text-xs text-muted-foreground">{date ? formatDate(date) : ''}</span>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {getExcerptText(excerpt || content || '')}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link href={`/posts/${slug}`} className="text-sm font-medium text-primary hover:underline">
          阅读详情 →
        </Link>
      </CardContent>
    </Card>
  );
};
