'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    avatar_url: '',
    bio: '',
  });

  // 加载用户数据
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">未登录</h1>
          <p className="text-muted-foreground mb-6">您需要登录才能访问个人中心。</p>
        </div>
      </div>
    );
  }

  // 初始化表单数据
  if (!isEditing && !formData.email) {
    setFormData({
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      bio: user.user_metadata?.bio || '',
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 这里需要实现更新用户信息的逻辑
      // 由于 Supabase 的 updateUser 方法限制，这里仅做演示
      console.log('保存用户信息:', formData);
      
      setIsEditing(false);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">个人中心</h1>
          <p className="text-muted-foreground mt-2">管理您的账户信息和设置</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 用户信息卡片 */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || ''} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.email}</CardTitle>
              <div className="mt-2">
                <Badge variant="outline">
                  {user.user_metadata?.role === 'admin' ? '管理员' : '用户'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">加入日期</p>
                  <p className="text-sm">
                    {new Date(user.created_at || '').toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">最后登录</p>
                  <p className="text-sm">
                    {new Date(user.last_sign_in_at || '').toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 编辑表单 */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>个人信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      邮箱
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      placeholder="请输入邮箱"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="full_name" className="text-sm font-medium">
                      昵称
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="请输入昵称"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="avatar_url" className="text-sm font-medium">
                      头像 URL
                    </label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="请输入头像图片地址"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      个人简介
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="介绍一下自己吧"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(prev => ({
                            ...prev,
                            email: user.email || '',
                            full_name: user.user_metadata?.full_name || '',
                            avatar_url: user.user_metadata?.avatar_url || '',
                            bio: user.user_metadata?.bio || '',
                          }));
                        }}
                      >
                        取消
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          '保存'
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>编辑资料</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 安全设置 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>安全设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">修改密码</p>
                    <p className="text-sm text-muted-foreground">
                      更改您的账户密码
                    </p>
                  </div>
                  <Button variant="outline" size="sm">修改密码</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">注销账户</p>
                    <p className="text-sm text-muted-foreground">
                      永久删除您的账户和所有数据
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">注销账户</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
