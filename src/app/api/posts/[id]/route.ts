import { NextResponse } from 'next/server';
import { AdminPostService } from '@/services/adminPostService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/posts/[id] - 获取单个文章详情
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await AdminPostService.getPostById(id);

    // Increment view count
    if (post) {
      await supabaseAdmin.client
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', id);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/posts/[id] - 更新文章
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const post = await AdminPostService.updatePost(id, body);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - 删除文章
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await AdminPostService.deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
