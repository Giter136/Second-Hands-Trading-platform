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
  const token = cookieStore.get('mock_token')?.value;
  // 这是一个残留的测试值，用于暂时模拟后端数据库返回的鉴定结果
  const simulatedBackendResult = cookieStore.get('mock_role')?.value;

  // 2. 【核心修复】：在这里向后端发起身份鉴定请求！
  // 实际接入后端后的代码将是：
  // const res = await fetch('http://localhost:8000/api/v1/auth/me', {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // const user = await res.json();
  // if (user.role !== 1) { redirect('/'); }

  // 模拟等待后端处理及返回的结果：如果后端说该账号不是管理员
  if (simulatedBackendResult !== 'admin') {
    // 服务端直接掐断，强行把用户丢回前台！
    // 浏览器根本连管理员界面的 HTML 骨架都不会收到，做到真正的无感知。
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
