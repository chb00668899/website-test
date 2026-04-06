'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import type { Comment as CommentType } from '@/lib/types';

// 组件内部使用的评论类型
interface CommentItem {
  id: string;
  content: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  created_at: string;
  replies?: CommentItem[];
}

interface CommentListProps {
  comments: CommentItem[];
  onReply?: (parentId: string, content: string) => void;
  onComment?: (content: string) => void;
  postId: string;
}

export function CommentList({ comments, onReply, postId }: CommentListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleExpand = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.author_avatar || undefined} alt={comment.author_name || '用户'} />
                  <AvatarFallback>{comment.author_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{comment.author_name || '匿名用户'}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply && onReply(comment.id, '')}
                      className="text-xs h-8"
                    >
                      回复
                    </Button>
                    {comment.replies && comment.replies.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(comment.id)}
                        className="text-xs h-8"
                      >
                        {expandedComments.has(comment.id) ? '收起回复' : `查看 ${comment.replies.length} 条回复`}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 回复列表 */}
              {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
                <div className="mt-3 pl-12 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.author_avatar || undefined} alt={reply.author_name || '用户'} />
                        <AvatarFallback>{reply.author_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs">{reply.author_name || '匿名用户'}</span>
                          <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-gray-700 text-xs">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;
