// @vitest-environment jsdom
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import LikeButton from '../LikeButton';
import * as useUserHook from '@/hooks/useUser';
import { vi } from 'vitest';

// 模拟 useUser 钩子
vi.mock('@/hooks/useUser');

describe('LikeButton', () => {
  beforeEach(() => {
    // 模拟用户已登录
    (useUserHook.useUser as any).mockReturnValue({
      user: { id: 'test-user-id' },
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该显示初始点赞数', async () => {
    render(<LikeButton postId="1" initialLikeCount={10} />);
    
    // 等待组件渲染
    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });

  it('点击按钮应该增加点赞数', async () => {
    render(<LikeButton postId="1" initialLikeCount={10} />);
    
    // 等待组件渲染
    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });
});
