import { Trade } from '../types/models';
import { http } from '../utils/request';

export interface CreateTradePayload {
  itemId: number;
  conversationId: number;
  agreedPrice: number;
  meetupLocation: string;
}

export const tradeService = {
  /**
   * 发起交易意向
   */
  async createTrade(payload: CreateTradePayload): Promise<Trade> {
    return http<Trade>('/trades', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 卖家确认交易
   */
  async confirmTrade(tradeId: number): Promise<Trade> {
    return http<Trade>(`/trades/${tradeId}/confirm`, {
      method: 'POST',
    });
  },

  /**
   * 取消交易（双方均可）
   */
  async cancelTrade(tradeId: number, reason: string): Promise<Trade> {
    return http<Trade>(`/trades/${tradeId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancelReason: reason }),
    });
  },

  /**
   * 确认完成交易闭环
   */
  async completeTrade(tradeId: number): Promise<Trade> {
    return http<Trade>(`/trades/${tradeId}/complete`, {
      method: 'POST',
    });
  }
};
