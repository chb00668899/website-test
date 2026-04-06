# 使用官方 Node.js 运行时作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
# 先复制 package 文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动 Next.js 应用
CMD ["npm", "start"]
