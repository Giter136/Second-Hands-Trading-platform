import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import { cookies } from 'next/headers';
import './globals.css';

// 引入现代张力字体 Outfit 作为全局主字体展示
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '云端二手 | Cloud Trading',
  description: '轻量化的美学二手交易平台',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 获取当前的鉴权状态以局部渲染导航栏
  const cookieStore = await cookies();
  const role = cookieStore.get('mock_role')?.value; // 'admin' 或 'user'
  const isLoggedIn = cookieStore.has('mock_token');

  return (
    <html lang="zh-CN" className={`${outfit.variable}`}>
      <body className="relative text-slate-800 font-sans">
        
        {/* 全局悬浮导航栏 (Floating Navbar) */}
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
                {role === 'admin' && (
                  <Link href="/admin" className="text-sm font-bold text-[#4361EE] hover:text-slate-900 transition-colors">
                    管理中枢
                  </Link>
                )}
                {!isLoggedIn ? (
                  <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    登录
                  </Link>
                ) : (
                  <span className="text-sm font-bold text-slate-800">
                    你好, {role === 'admin' ? '管理员' : '探险家'}
                  </span>
                )}
                <Link href="/publish" className="text-sm font-medium bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-[#4361EE] transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 inline-block text-center">
                  发布闲置
                </Link>
              </div>
            </nav>
          </div>
        </header>
        
        {/* 主内容渲染区 (预留顶部导航的安全空间) */}
        <main className="pt-28 pb-24 min-h-screen flex flex-col">
          {children}
        </main>

      </body>
    </html>
  );
}
