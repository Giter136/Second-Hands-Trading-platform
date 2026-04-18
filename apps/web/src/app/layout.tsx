import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
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

// 根布局：仅保留最基础的 HTML 和 Body 定义，不在此处写任何界面和导航栏组件。
// 让 (main) 和 admin 拥有彻底隔离的子版式布局。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${outfit.variable}`}>
      <body className="relative text-slate-800 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
