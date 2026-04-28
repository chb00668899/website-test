import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
  postCount: number;
  publishedPosts: number;
  draftPosts: number;
  videoCount: number;
  commentCount: number;
  recentPosts: Array<{
    id: string;
    title: string;
    view_count: number;
    like_count: number;
    created_at: string;
  }>;
}

async function getStats(): Promise<DashboardStats> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export default async function DashboardPage() {
  let stats: DashboardStats | null = null;
  let error: Error | null = null;
  try {
    stats = await getStats();
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">加载失败: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            新建文章
          </Link>
          <Link
            href="/admin/videos/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            新建视频
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="文章总数" value={stats.postCount} color="blue" />
        <StatCard label="已发布" value={stats.publishedPosts} color="green" />
        <StatCard label="草稿" value={stats.draftPosts} color="yellow" />
        <StatCard label="评论总数" value={stats.commentCount} color="purple" />
      </div>

      {/* Video Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm">视频总数</h3>
              <p className="text-2xl font-bold">{stats.videoCount}</p>
            </div>
            <Link
              href="/admin/videos"
              className="text-sm text-blue-600 hover:underline"
            >
              管理视频 →
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm">博客管理</h3>
              <p className="text-2xl font-bold">{stats.postCount}</p>
            </div>
            <Link
              href="/admin/posts"
              className="text-sm text-blue-600 hover:underline"
            >
              管理文章 →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">最近文章</h2>
        {stats.recentPosts.length > 0 ? (
          <div className="space-y-4">
            {stats.recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {post.title}
                </Link>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>浏览: {post.view_count || 0}</span>
                  <span>点赞: {post.like_count || 0}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
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

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'border-l-4 border-blue-500',
    green: 'border-l-4 border-green-500',
    yellow: 'border-l-4 border-yellow-500',
    purple: 'border-l-4 border-purple-500',
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${colors[color] || ''}`}>
      <h3 className="text-gray-600 text-sm">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
