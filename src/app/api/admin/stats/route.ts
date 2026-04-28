import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const [
      { count: postCount = 0 } = {},
      { count: publishedPosts = 0 } = {},
      { count: draftPosts = 0 } = {},
      { count: videoCount = 0 } = {},
      { count: commentCount = 0 } = {},
    ] = await Promise.all([
      supabaseAdmin.client.from('posts').select('*', { count: 'exact', head: true }),
      supabaseAdmin.client.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabaseAdmin.client.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabaseAdmin.client.from('videos').select('*', { count: 'exact', head: true }),
      supabaseAdmin.client.from('comments').select('*', { count: 'exact', head: true }),
    ]);

    const { data: recentPosts } = await supabaseAdmin.client
      .from('posts')
      .select('id, title, view_count, like_count, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      postCount,
      publishedPosts,
      draftPosts,
      videoCount,
      commentCount,
      recentPosts: recentPosts || [],
    });
  } catch (error) {
    console.error('[Dashboard Stats] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
