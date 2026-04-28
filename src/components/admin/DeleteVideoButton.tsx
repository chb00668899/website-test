'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function DeleteVideoButton({ videoId }: { videoId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('确定要删除这个视频吗？')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/videos/${videoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      window.location.reload();
    } catch (e) {
      alert('删除视频失败');
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
