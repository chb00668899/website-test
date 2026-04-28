'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      window.location.reload();
    } catch (e) {
      alert('删除文章失败');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? '删除中...' : '删除'}
    </Button>
  );
}
