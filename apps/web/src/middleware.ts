import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 简易 mock 鉴权逻辑：实际情况应该从 cookie 中取出 JWT 并校验
  const role = request.cookies.get('mock_role')?.value; // 'admin' 或 'user'
  const isLoggedIn = request.cookies.has('mock_token');

  const { pathname } = request.nextUrl;

  // 1. 保护管理员路由
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      // 未登录或非管理员，重定向到登录页，并携带回跳参数
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. 保护发布等需要登录的普通路由
  if (pathname.startsWith('/publish')) {
    if (!isLoggedIn) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/publish/:path*'],
};
