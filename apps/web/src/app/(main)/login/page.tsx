'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { http } from '../../../utils/request';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get('redirect');

  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 严正声明：登录逻辑已对接真实后端
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !password) {
      setErrorMsg('请输入账号和密码');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    try {
      // 对接真实后端 API 获取 token
      // 修复高风险问题：直接接收 request.ts 脱壳后的 data 对象
      const data = await http<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: account, password_hash: password }), 
      });

      if (data?.token) {
        const { token } = data;
        // 同步 Token 状态以防万一：
        // 1. 本地存储，供 request.ts 后续调用拦截拿取
        localStorage.setItem('access_token', token);
        // 2. Cookie，供服务端组件 (ssr) 和 middleware 取用
        document.cookie = `access_token=${token}; path=/; max-age=86400`;

        if (redirectParams) {
          router.push(redirectParams);
        } else {
          router.push('/');
        }
        
        router.refresh(); 
      } else {
        setErrorMsg('登录失败，未能获取鉴权凭证');
      }
    } catch (err: any) {
      // http 方法内部抛出的是携带 message 的 Error 对象
      setErrorMsg(err.message || '服务器连接异常，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-20 px-4 animate-fade-up w-full">
      <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* 背景光晕装饰 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#4361EE]/20 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="mb-10 text-center relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">登录云端</h1>
          <p className="text-slate-500 font-medium text-sm">欢迎开启你的极简交易之旅</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10 w-full">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 mb-2">手机号/账号</label>
            <input 
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="输入账号"
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#4361EE]/50 transition-all font-medium placeholder:text-slate-400 outline-none"
            />
          </div>
          
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 mb-2">密码</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#4361EE]/50 transition-all font-medium placeholder:text-slate-400 outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-rose-500 text-xs font-bold text-center animate-pulse">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-6 mt-2 border border-transparent text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-[#4361EE] focus:outline-none transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(67,97,238,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? '正在通信...' : '立即登录 / 注册'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400 font-medium relative z-10">
          点击登录即表示您同意我们的 <a href="#" className="underline hover:text-slate-900">服务条款</a>
        </div>
      </div>
    </div>
  );
}
