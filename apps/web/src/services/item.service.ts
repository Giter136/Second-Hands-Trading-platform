import { Item } from '../types/models';
import { http } from '../utils/request';

export interface PublishItemPayload {
  title: string;
  category: string;
  conditionLevel: number;
  price: number;
  description: string;
  city: string;
  imageUrls: string[]; // 假设由专门的上传请求优先上传拿到回显URL
}

export const itemService = {
  /**
   * 分页筛选商品列表（首页瀑布流等使用）
   */
  async getItems(params?: { category?: string; page?: number; size?: number }): Promise<{ items: Item[]; total: number }> {
    return http<{ items: Item[]; total: number }>('/items', {
      method: 'GET',
      params,
    });
  },

  /**
   * 获取商品详情
   */
  async getItemDetail(id: number): Promise<Item> {
    return http<Item>(`/items/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 发布商品
   */
  async publishItem(payload: PublishItemPayload): Promise<Item> {
    return http<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 更新商品状态（上下架等）
   */
  async updateItemStatus(id: number, status: number): Promise<void> {
    return http<void>(`/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
};
