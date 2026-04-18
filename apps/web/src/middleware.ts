import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 只判断是否存在基础 token（代表登录状态）。不在这里做角色判断。
  const token = request.cookies.get('mock_token')?.value;

  const { pathname } = request.nextUrl;

  // 1. 对于必须登录才能进入的普通页面 /publish
  if (pathname.startsWith('/publish')) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. 保护 /admin 本身：只拦截是否有 Token（未登录当然不能进 Admin）
  // 至于角色是不是Admin，将由进入/admin后发起的数据接口API请求去接受后端的鉴定(403无权限或200获取成功)。
  // 前端不对角色做自作主张的鉴定限制。
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/publish/:path*', '/publish'],
};
