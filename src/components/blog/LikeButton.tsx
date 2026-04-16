'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { LikeService } from '@/services/likeService';
import { Post } from '@/lib/types';

interface LikeButtonProps {
  postId: string;
  initialLikeCount?: number;
  showCount?: boolean;
}

export function LikeButton({ postId, initialLikeCount = 0, showCount = true }: LikeButtonProps) {
  const { user, isLoading: userLoading } = useUser();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userLiked, setUserLiked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    // 获取当前点赞状态
    if (user) {
      LikeService.getUserLikeStatus(postId, user.id).then(status => {
        setUserLiked(!!status);
      });
    }
  }, [postId, user]);

  const handleToggleLike = async () => {
    if (!user) {
      // 未登录用户，提示登录
      return;
    }

    setIsToggling(true);
    try {
      const result = await LikeService.toggleLike(postId, user.id);
      setLikeCount(result.likeCount);
      setUserLiked(result.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsToggling(false);
    }
  };

  if (userLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleLike}
        disabled={isToggling || !user}
        className={`h-8 w-8 p-0 flex items-center justify-center ${userLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
        title={userLiked ? '取消点赞' : '点赞'}
      >
        <svg
          className={`w-5 h-5 ${userLiked ? 'fill-current' : 'fill-none'}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </Button>
      {showCount && (
        <span className="text-sm text-gray-500">
          {likeCount} {userLiked ? '已点赞' : '点赞'}
        </span>
      )}
    </div>
  );
}

export default LikeButton;
