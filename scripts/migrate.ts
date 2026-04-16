/**
 * 数据库迁移脚本
 * 
 * 用法：
 * 1. 设置环境变量 DATABASE_URL（Supabase 数据库 URL）
 * 2. 运行：ts-node scripts/migrate.ts
 * 
 * Supabase 数据库 URL 格式：
 * postgresql://postgres:[password]@db.mgsdwrgnlmothebvazwf.supabase.co:5432/postgres
 * 
 * 如何获取数据库 URL：
 * 1. 登录 Supabase 控制台：https://mgsdwrgnlmothebvazwf.supabase.co
 * 2. 进入 Project Settings > Database
 * 3. 复制连接字符串
 */

import { Pool, Client } from 'pg';
import fs from 'fs';
import path from 'path';

// 获取数据库 URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('错误：请设置 DATABASE_URL 环境变量');
  console.error('');
  console.error('Supabase 数据库 URL 格式：');
  console.error('  postgresql://postgres:[password]@db.mgsdwrgnlmothebvazwf.supabase.co:5432/postgres');
  console.error('');
  console.error('如何获取数据库 URL：');
  console.error('  1. 登录 Supabase 控制台：https://mgsdwrgnlmothebvazwf.supabase.co');
  console.error('  2. 进入 Project Settings > Database');
  console.error('  3. 复制连接字符串');
  console.error('');
  console.error('或者在 Supabase 控制台的 SQL Editor 中执行 SQL 迁移文件。');
  process.exit(1);
}

// 读取 SQL 迁移文件
const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '20240101000008_create_tables_idempotent.sql');
let sqlContent = '';

try {
  sqlContent = fs.readFileSync(sqlFile, 'utf-8');
} catch (error) {
  console.error('错误：无法读取 SQL 迁移文件:', sqlFile);
  console.error(error);
  process.exit(1);
}

// 创建 PostgreSQL 客户端
const client = new Client({
  connectionString: databaseUrl,
});

async function migrate() {
  try {
    // 连接到数据库
    await client.connect();
    console.log('已连接到数据库');

    // 执行 SQL 迁移
    await client.query(sqlContent);
    console.log('数据库迁移成功！');

    // 断开连接
    await client.end();
    console.log('已断开连接');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    await client.end();
    process.exit(1);
  }
}

migrate();
