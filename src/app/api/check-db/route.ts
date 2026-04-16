import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 检查数据库表结构
 */
export async function GET(request: NextRequest) {
  try {
    // 检查表是否存在
    const tables = [
      'user_profiles',
      'categories',
      'tags',
      'posts',
      'post_tags',
      'comments',
      'videos',
      'post_likes',
      'post_views',
      'video_comments',
      'test_table'
    ];

    const tableInfo = [];

    for (const table of tables) {
      let exists = false;
      let error = null;
      let count = 0;

      // 尝试查询表的第一行数据
      // 对于 post_tags 表，使用 post_id 和 tag_id 而不是 id
      const selectClause = table === 'post_tags' ? 'post_id, tag_id' : 'id';
      
      const { data, error: queryError } = await supabaseAdmin.client
        .from(table)
        .select(selectClause, { count: 'exact' })
        .limit(1);

      if (queryError) {
        // 如果错误是因为列不存在，检查是否是 post_tags 表
        if (table === 'post_tags' && queryError.message.includes('column post_tags.id does not exist')) {
          exists = true;
          error = null;
          count = 0;
        } else {
          exists = false;
          error = queryError.message;
          count = 0;
        }
      } else {
        exists = true;
        count = Array.isArray(data) ? data.length : 0;
      }

      tableInfo.push({
        table,
        exists,
        error,
        count
      });
    }

    return NextResponse.json({
      status: 'success',
      tables: tableInfo
    });
  } catch (error) {
    console.error('检查数据库表结构错误:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
