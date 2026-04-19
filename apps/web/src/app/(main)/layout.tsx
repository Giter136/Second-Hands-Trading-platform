import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 只用于用户界面的状态感知（非实际权限控制）
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value; 

  return (
    <>
      {/* 悬浮导航栏 */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          <nav className="glass-panel rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 hover:shadow-[0_12px_40px_rgb(67,97,238,0.08)]">
            {/* Logo 区 */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4361EE] to-[#10B981] shadow-lg animate-float flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg leading-none mt-[-2px]">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                CloudTrade
              </span>
            </Link>
            
            {/* 动作区 */}
            <div className="flex items-center gap-4">
              {!token ? (
                <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  登录
                </Link>
              ) : (
                <Link href="/profile" className="text-sm font-bold text-slate-800 hover:text-[#4361EE] cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
                  用户中心
                </Link>
              )}
              <Link href="/publish" className="text-sm font-medium bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-[#4361EE] transition-all flex items-center justify-center">
                发布闲置
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      {/* 主内容渲染区 */}
      <main className="pt-28 pb-24 min-h-screen flex flex-col">
        {children}
      </main>
    </>
  );
}
