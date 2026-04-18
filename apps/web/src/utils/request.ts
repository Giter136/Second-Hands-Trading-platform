/**
 * 基础请求封装类
 * 处理全局 baseURL, 请求拦截（Token 添加），响应拦截（错误统一处理）
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export async function http<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customOptions } = options;
  
  // 1. 处理请求查询参数 (Query strings)
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }

  // 2. 处理 Token (可从 cookie/localStorage 中获取)
  let authHeader = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...headers,
  };

  try {
    const response = await fetch(url.toString(), {
      ...customOptions,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      // 抛出统一个 HTTP 异常或者针对 401 等特殊处理
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res.data as T; // 假定遵循 ApiResponse 格式并直接抽取 data
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
