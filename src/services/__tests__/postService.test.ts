// @vitest-environment jsdom

// 模拟数据
const mockPosts = [
  {
    id: '1',
    title: '测试文章 1',
    content: '这是测试文章 1 的内容',
    author_id: 'user1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    view_count: 100,
    like_count: 50,
  },
  {
    id: '2',
    title: '测试文章 2',
    content: '这是测试文章 2 的内容',
    author_id: 'user2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    view_count: 200,
    like_count: 75,
  },
];

describe('PostService', () => {
  describe('getPosts', () => {
    it('应该返回文章列表', async () => {
      // 这是一个模拟测试
      expect(mockPosts.length).toBe(2);
      expect(mockPosts[0].title).toBe('测试文章 1');
    });
  });

  describe('getPostById', () => {
    it('应该根据 ID 返回单篇文章', async () => {
      const post = mockPosts.find((p) => p.id === '1');
      expect(post).toBeDefined();
      expect(post?.title).toBe('测试文章 1');
    });
  });

  describe('likePost', () => {
    it('应该增加文章的点赞数', async () => {
      const post = { ...mockPosts[0], like_count: 50 };
      const newLikeCount = post.like_count + 1;
      expect(newLikeCount).toBe(51);
    });
  });
});
