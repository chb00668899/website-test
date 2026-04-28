import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/videos - 获取视频列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;

    let query = supabaseAdmin.client
      .from('videos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ videos: data, count });
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/videos - 创建视频
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, oss_url, thumbnail_url, duration, status, author_id } = body;

    if (!title || !oss_url) {
      return NextResponse.json({ error: '标题和视频 URL 是必需的' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.client
      .from('videos')
      .insert([{ title, description, oss_url, thumbnail_url, duration, status, author_id }])
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
