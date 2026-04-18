import { User } from '../types/models';
import { http } from '../utils/request';

export const authService = {
  /**
   * 用户登录
   */
  async login(phone: string, passwordHash: string): Promise<{ token: string; user: User }> {
    return http<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password_hash: passwordHash }),
    });
  },

  /**
   * 用户注册
   */
  async register(phone: string, passwordHash: string, nickname: string): Promise<{ user: User }> {
    return http<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password_hash: passwordHash, nickname }),
    });
  },

  /**
   * 获取当前用户信息
   */
  async getProfile(): Promise<User> {
    return http<User>('/auth/me', {
      method: 'GET',
    });
  }
};
