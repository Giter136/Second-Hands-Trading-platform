import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. 提取当前附带的 Token（由中间件保证这里肯定有Token，但未鉴定角色）
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // 2. 【核心修复】：在这里向真实后端发起身份鉴定请求！
  try {
    const res = await fetch('http://localhost:8000/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store' // 保证每次都拿取真实鉴权，防止状态缓存
    });
    
    if (!res.ok) {
      // 无权限或Token失效或服务端错误，踢回前台
      redirect('/');
    }

    const { data: user } = await res.json();
    
    // 如果后台确凿说账号不是管理员（role不为1）
    if (user?.role !== 1) {
      redirect('/');
    }
  } catch (error) {
    // 遇到断网或者后端未启动情况时，不予通过（安全第一）
    redirect('/');
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 管理员专用的精简顶栏 (区别于普通用户的悬浮球) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg text-white font-black flex items-center justify-center">
            A
          </div>
          <span className="font-black text-slate-800 tracking-tight">管理工作台</span>
        </div>
        
        <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          退出管理 (返回前台)
        </Link>
      </header>

      {/* 管理员主内容区 */}
      <main className="pt-8">
        {children}
      </main>
    </div>
  );
}
