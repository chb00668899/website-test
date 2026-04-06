import OSS from 'ali-oss';

type OSSClient = InstanceType<typeof OSS>;

// OSS 客户端配置
// 从环境变量中读取 OSS 配置信息
const ossConfig = {
  region: process.env.NEXT_PUBLIC_OSS_REGION || '',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET || '',
  endpoint: process.env.NEXT_PUBLIC_OSS_ENDPOINT || '',
};

// 创建 OSS 客户端
export const createOssClient = (): OSSClient => {
  return new OSS(ossConfig);
};

// 导出默认客户端
export const ossClient = createOssClient();

// 导入项目中的类型定义
import type { OssUploadOptions, OssUploadResult, PresignedUrlResult } from './types';

// OSS 签名 URL 配置
export interface PresignedUrlOptions {
  fileName: string;
  expiresIn?: number; // 单位：秒，默认 3600
}

/**
 * 生成上传到 OSS 的签名 URL
 * 用于前端直传，避免经过服务器中转
 */
export const generatePresignedUrl = async (
  fileName: string,
  expiresIn: number = 3600
): Promise<PresignedUrlResult> => {
  try {
    // 在服务端生成签名 URL
    if (typeof window === 'undefined') {
      const client = createOssClient();
      const method = 'PUT';
      const url = client.signatureUrl(fileName, {
        expires: expiresIn,
        method,
      });
      
      return {
        success: true,
        url,
      };
    }
    
    // 客户端无法生成签名 URL，需要从服务端获取
    return {
      success: false,
      url: '',
      message: 'Presigned URL must be generated on server side',
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      success: false,
      url: '',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * 获取 OSS 文件的公开访问 URL
 */
export const getOssUrl = (fileName: string): string => {
  return `${ossConfig.endpoint}/${fileName}`;
};

/**
 * 上传文件到 OSS
 * @param file 文件对象
 * @param fileName 文件名
 * @param options 上传选项
 */
export const uploadToOss = async (
  file: File,
  fileName: string,
  options?: OssUploadOptions
): Promise<OssUploadResult> => {
  try {
    // 客户端直传
    if (typeof window !== 'undefined') {
      // 1. 从服务端获取签名 URL
      const presignedResult = await generatePresignedUrl(fileName);
      
      if (!presignedResult.success) {
        return {
          success: false,
          url: '',
          filename: fileName,
          message: presignedResult.message,
        };
      }
      
      // 2. 使用签名 URL 上传文件
      const response = await fetch(presignedResult.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          ...options?.meta,
        },
      });
      
      if (response.ok) {
        // 获取上传后的文件 URL
        const fileUrl = getOssUrl(fileName);
        
        return {
          success: true,
          url: fileUrl,
          filename: fileName,
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          url: '',
          filename: fileName,
          message: `Upload failed: ${response.status} ${errorText}`,
        };
      }
    }
    
    // 服务端上传 - 暂时不实现，需要服务器端配置
    console.warn('Server-side upload not implemented');
    return {
      success: false,
      url: '',
      filename: fileName,
      message: 'Server-side upload not implemented',
    };
  } catch (error) {
    console.error('Error uploading to OSS:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      url: '',
      filename: fileName,
      message: errorMessage,
    };
  }
};

/**
 * 删除 OSS 文件
 */
export const deleteFromOss = async (fileName: string): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      const client = createOssClient();
      await client.delete(fileName);
      return true;
    }
    
    // 客户端不允许直接删除文件
    console.warn('Delete operation not allowed from client side');
    return false;
  } catch (error) {
    console.error('Error deleting from OSS:', error);
    return false;
  }
};

/**
 * 生成带缩略图处理的 URL（OSS 图片处理）
 */
export const getThumbnailUrl = (
  fileName: string,
  width: number = 300,
  height: number = 200
): string => {
  return `${getOssUrl(fileName)}?x-oss-process=style/thumbnail`;
};

/**
 * 批量上传文件
 */
export const batchUploadToOss = async (
  files: File[],
  prefix: string = ''
): Promise<OssUploadResult[]> => {
  const results: OssUploadResult[] = [];
  
  for (const file of files) {
    const fileName = prefix ? `${prefix}/${file.name}` : file.name;
    const result = await uploadToOss(file, fileName);
    results.push(result);
  }
  
  return results;
};
