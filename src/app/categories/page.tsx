'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/seo/SEO';

// 分类类型
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// 获取分类数据
async function fetchCategories() {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data.categories as Category[];
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  if (isLoading) {
    return (
      <>
        <SEO title="分类列表" />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="分类列表" />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">所有分类</h1>
          <p className="text-gray-600">浏览网站的所有内容分类</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-blue-600">{category.name}</h2>
                  <Badge variant="secondary">{category.slug}</Badge>
                </div>
                <p className="text-gray-600 text-sm">{category.description || '暂无描述'}</p>
              </Card>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无分类</p>
          </div>
        )}
      </div>
    </>
  );
}
