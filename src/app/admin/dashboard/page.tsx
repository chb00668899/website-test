import Link from 'next/link';
import { AdminPostService } from '@/services/adminPostService';

export default async function DashboardPage() {
  // 获取最近文章
  const recentPosts = await AdminPostService.getRecentPosts(3);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <Link 
          href="/admin/posts/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          新建文章
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">文章总数</h3>
          <p className="text-2xl font-bold">25</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">视频总数</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">评论总数</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">用户总数</h3>
          <p className="text-2xl font-bold">48</p>
        </div>
      </div>

      {/* 最近文章 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">最近文章</h2>
        {recentPosts && recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b pb-2 last:border-0">
                <Link 
                  href={`/admin/posts/${post.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {post.title}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  浏览: {post.view_count || 0} | 点赞: {post.like_count || 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">暂无文章</p>
        )}
      </div>
    </div>
  );
}
