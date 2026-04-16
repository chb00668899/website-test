'use client';

import Image from 'next/image';
import { useState } from 'react';

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurRadius?: number;
};

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 75,
  priority = false,
  placeholder = 'empty',
  blurRadius = 10,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // 处理图片加载成功
  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* 占位符 */}
      <div
        className={`absolute inset-0 bg-gray-100 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ width, height }}
      />
      
      {/* Next.js Image 组件 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={
          placeholder === 'blur'
            ? `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iJHdpZHRoIiBoZWlnaHQ9IiRoZWlnaHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0iYmx1ciI+PGdvc3NoYW5kbGVyIHgmPSIwIiB5PSIwIiByPSIyMCIgaW49InNoYXBlIiBmaWx0ZXJMZXZlbD0iMyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNibHVyKSIvPjwvc3ZnPg==`
            : undefined
        }
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={false}
      />
      
      {/* 加载中状态 */}
      {!isLoaded && placeholder !== 'blur' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
