# Stage 1: Build stage
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装依赖
# 先复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制应用源代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# 设置工作目录
WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "start"]
