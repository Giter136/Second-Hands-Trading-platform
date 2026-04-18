import { Item, Trade, User } from '../types/models';
import { http } from '../utils/request';

export interface AdminItemAuditPayload {
  result: number; // 1通过, 2拒绝
  reason?: string;
}

export interface AdminFreezeUserPayload {
  reason: string;
}

export const adminService = {
  /**
   * 拉取管理员视角的商品列表（查询待审核、全部商品等）
   */
  async getItems(params?: { status?: number; page?: number; size?: number }): Promise<{ items: Item[]; total: number }> {
    return http<{ items: Item[]; total: number }>('/admin/items', {
      method: 'GET',
      params,
    });
  },

  /**
   * 审核并流转单条商品的状体
   */
  async auditItem(itemId: number, payload: AdminItemAuditPayload): Promise<void> {
    return http<void>(`/admin/items/${itemId}/audit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 冻结违规用户
   */
  async freezeUser(userId: number, payload: AdminFreezeUserPayload): Promise<void> {
    return http<void>(`/admin/users/${userId}/freeze`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 拉取全局交易全景监控记录
   */
  async getAllTrades(params?: { status?: number; page?: number; size?: number }): Promise<{ trades: Trade[]; total: number }> {
    return http<{ trades: Trade[]; total: number }>('/admin/trades', {
      method: 'GET',
      params,
    });
  }
};
