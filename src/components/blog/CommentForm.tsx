'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { QueryClient } from '@tanstack/react-query';

interface CommentFormProps {
  onSubmit: (content: string, queryClient?: QueryClient) => void;
  postId: string;
  placeholder?: string;
}

export function CommentForm({ onSubmit, postId, placeholder = '发表你的看法...' }: CommentFormProps) {
  const { user, isLoading } = useUser();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-500">
        正在加载...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? placeholder : '登录后发表评论'}
          disabled={isSubmitting || !user}
          className="min-h-[100px]"
        />
        {!user && (
          <p className="text-xs text-gray-500">
            请先登录再发表评论
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim() || !user}
          size="sm"
        >
          {isSubmitting ? '提交中...' : '发表评论'}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
