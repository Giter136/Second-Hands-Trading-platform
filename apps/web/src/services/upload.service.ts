import { http } from '../utils/request';

export const uploadService = {
  /**
   * 上传单张图片（如发布闲置时依次上传），依靠 multipart/form-data
   * @param file 选中的二进制文件对象 (File)
   * @returns { url: string } 包含存储在服务端的对外访问URL路径
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return http<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
    });
  }
};
