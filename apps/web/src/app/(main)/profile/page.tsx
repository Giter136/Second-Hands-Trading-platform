'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth.service';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogout = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 业务核心交给后端 /auth/logout
      await authService.logout();
      
      // 后端确认无误后，前端才清空凭证状态并拦截跳出
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      document.cookie = 'access_token=; path=/; max-age=0;';
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('登出失败', err);
      setErrorMsg(err?.message || '登出失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-up">
      <div className="space-y-6">
        <h1 className="text-3xl font-black text-slate-900">用户中心</h1>
        <p className="text-slate-500 font-medium">此模块正在开发中，敬请期待！</p>
        
        {/* 红色退出登录功能块 */}
        <div className="pt-20 flex flex-col items-center">
          <button 
            onClick={handleLogout} 
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:shadow-none text-white font-bold px-12 py-3 rounded-full shadow-[0_8px_30px_rgba(244,63,94,0.3)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            {loading ? '正在登出...' : '退出登录'}
          </button>
          {errorMsg && (
            <p className="mt-4 text-sm font-bold text-rose-500 animate-pulse">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}