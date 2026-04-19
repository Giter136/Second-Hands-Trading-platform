import { User } from '../types/models';
import { http } from '../utils/request';

export const authService = {
  /**
   * 用户登录
   */
  async login(account: string, passwordHash: string): Promise<{ token: string; user: User }> {
    // 粗略判断是否可能是手机号（11位数字），否则按 username 处理，兼顾前后端最佳实践
    const isPhone = /^1\d{10}$/.test(account);
    const body: Record<string, string> = { password_hash: passwordHash };
    if (isPhone) {
      body.phone = account;
    } else {
      body.username = account;
    }

    return http<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * 用户注册
   */
  async register(account: string, passwordHash: string, nickname: string): Promise<{ user: User }> {
    const isPhone = /^1\d{10}$/.test(account);
    const body: Record<string, string> = { password_hash: passwordHash, nickname };
    if (isPhone) {
      body.phone = account;
    } else {
      body.username = account;
    }

    return http<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * 获取当前用户信息
   */
  async getProfile(): Promise<User> {
    return http<User>('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    return http<void>('/auth/logout', {
      method: 'POST',
    });
  }
};
