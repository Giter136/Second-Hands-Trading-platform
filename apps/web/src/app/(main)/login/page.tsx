'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../../../services/auth.service';

type AuthMode = 'login' | 'register';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return '服务器连接异常，请稍后再试';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get('redirect');

  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !password) {
      setErrorMsg('请输入账号和密码');
      return;
    }
    if (mode === 'register' && !nickname.trim()) {
      setErrorMsg('请输入昵称');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    try {
      if (mode === 'register') {
        await authService.register(account, password, nickname.trim());
      }

      const data = await authService.login(account, password);
      localStorage.setItem('access_token', data.token);
      document.cookie = `access_token=${data.token}; path=/; max-age=86400`;

      // 针对管理员权限（role === 1）分配专线跳转机制
      if (data.user.role === 1) {
        // 如果是从非 /admin 的其他地方重定向来的，通常管理员更期望回管理后台
        // 但如果明确有特殊 redirect 可以考虑放行。为了彻底解决无法进后台：一律先切去 /admin
        // 除非参数明确要回前台某个页，或者就干脆优先 /admin
        if (redirectParams && !redirectParams.startsWith('/admin')) {
          router.push(redirectParams);
        } else {
          router.push('/admin');
        }
      } else {
        // 普通用户跳转逻辑
        if (redirectParams) {
          router.push(redirectParams);
        } else {
          router.push('/');
        }
      }

      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
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
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
            {mode === 'login' ? '登录云端' : '创建账号'}
          </h1>
          <p className="text-slate-500 font-medium text-sm">欢迎开启你的极简交易之旅</p>

          <div className="mt-5 inline-flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              注册
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10 w-full">
          {mode === 'register' && (
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-500 mb-2">昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入昵称"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#4361EE]/50 transition-all font-medium placeholder:text-slate-400 outline-none"
              />
            </div>
          )}

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
            {loading ? '正在通信...' : mode === 'login' ? '立即登录' : '注册并登录'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400 font-medium relative z-10">
          点击登录即表示您同意我们的 <a href="#" className="underline hover:text-slate-900">服务条款</a>
        </div>
      </div>
    </div>
  );
}
