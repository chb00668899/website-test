-- 增加文章浏览次数的函数
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 增加视频浏览次数的函数
CREATE OR REPLACE FUNCTION increment_video_view_count(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET view_count = view_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
