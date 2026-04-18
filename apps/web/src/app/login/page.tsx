'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get('redirect');

  const [loading, setLoading] = useState<string | null>(null);

  // 模拟登录函数
  const handleLogin = (role: 'user' | 'admin') => {
    setLoading(role);
    
    // 模拟网络请求延迟
    setTimeout(() => {
      // 写入 mock Cookie
      document.cookie = `mock_token=fake_jwt_token_${role}; path=/; max-age=86400`;
      document.cookie = `mock_role=${role}; path=/; max-age=86400`;

      // 路由跳转：如果有回跳地址，优先回跳，否则按角色进入不同页面
      if (redirectParams) {
        router.push(redirectParams);
        router.refresh();
      } else {
        router.push(role === 'admin' ? '/admin' : '/');
        router.refresh(); // 刷新强制服务端重新拉取 cookie 渲染 Header
      }
    }, 800);
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-md w-full shadow-2xl relative overflow-hidden">
      {/* 背景光晕装饰 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#4361EE]/20 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">登录云端</h1>
        <p className="text-slate-500 font-medium">作为 V1 交付版本，请使用下方 Mock 通道快速模拟身份鉴权。</p>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <button
          onClick={() => handleLogin('user')}
          disabled={loading !== null}
          className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-slate-800 bg-slate-100/80 hover:bg-slate-200 focus:outline-none transition-all"
        >
          {loading === 'user' ? '登录中...' : '模拟普通用户登录'}
        </button>
        
        <button
          onClick={() => handleLogin('admin')}
          disabled={loading !== null}
          className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-[#4361EE] focus:outline-none transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(67,97,238,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading === 'admin' ? '验证中...' : '拥有特权：管理员登录'}
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 font-medium">
        点击登录即表示您同意我们的 <a href="#" className="underline">服务条款</a> 和 <a href="#" className="underline">隐私政策</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center -mt-20 px-4 animate-fade-up">
      <Suspense fallback={<div className="font-bold text-slate-500">正在加载鉴权模块...</div>}>
         <LoginForm />
      </Suspense>
    </div>
  );
}
