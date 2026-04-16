import { useEffect } from 'react';
import Head from 'next/head';

type MetaTagProps = {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
};

export const MetaTags = ({
  title,
  description = '个人技术博客，分享前端开发、Web 技术和编程经验',
  keywords = '博客,技术博客,前端开发,Web,JavaScript,React,Next.js',
  author = '博主',
  ogTitle,
  ogDescription,
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
}: MetaTagProps) => {
  const fullTitle = ogTitle || title;
  const fullDescription = ogDescription || description;
  const siteName = '我的博客';

  return (
    <>
      <Head>
        {/* 基础 Meta 标签 */}
        <title>{title} | {siteName}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph 标签 */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="zh_CN" />
        
        {/* Twitter Card 标签 */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={fullDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* 其他 SEO 标签 */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical || 'https://your-site.com'} />
        <link rel="icon" href="/favicon.ico" />
        
        {/* 预连接到外部域名 */}
        <link rel="preconnect" href="https://mgsdwrgnlmothebvazwf.supabase.co" />
        <link rel="preconnect" href="https://chb00668899.oss-cn-hangzhou.aliyuncs.com" />
      </Head>
    </>
  );
};

export default MetaTags;
