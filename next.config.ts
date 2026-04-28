import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'chb00668899.oss-cn-hangzhou.aliyuncs.com',
      },
      {
        protocol: 'http',
        hostname: 'chb00668899.oss-cn-hangzhou.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: '*.oss-cn-hangzhou.aliyuncs.com',
      },
      {
        protocol: 'http',
        hostname: '*.oss-cn-hangzhou.aliyuncs.com',
      },
    ],
  },
};

export default nextConfig;
