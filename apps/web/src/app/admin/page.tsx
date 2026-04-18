import React from 'react';

// 管理员全景仪表盘 (Admin Dashboard)
export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 animate-fade-up">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 左侧：悬浮导航侧边栏 */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel p-6 rounded-[2rem] sticky top-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
                A
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">管理中枢</h2>
                <p className="text-xs text-emerald-500 font-bold">● System Online</p>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button className="text-left px-5 py-3.5 rounded-2xl bg-[#4361EE] text-white font-bold shadow-[0_8px_20px_rgba(67,97,238,0.25)] transition-all flex justify-between items-center">
                <span>待审核商品</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">12</span>
              </button>
              <button className="text-left px-5 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-bold transition-all">
                全局交易监控
              </button>
              <button className="text-left px-5 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-bold transition-all">
                用户封禁管理
              </button>
            </nav>
          </div>
        </aside>

        {/* 右侧：数据表格与瀑布流图文混排的待审核列表 */}
        <main className="flex-1 pb-12">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">待审核列队</h1>
              <p className="text-slate-500 font-medium">请及时处理用户发布的闲置物品，维护社区纯净与交易安全。</p>
            </div>
            <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500">当前积压卷宗</span>
              <span className="text-2xl font-black text-slate-900">12</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* 审核卡片 1 - 云端浮岛拟物设计 */}
            <article className="glass-card rounded-[2rem] p-4 flex gap-5 group">
              {/* 大比例图片 */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-200 shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-50 group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                  数码极客
                </span>
              </div>
              
              {/* 信息与快速防呆操作区 */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1">
                    索尼 WH-1000XM4 降噪耳机
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    全新未拆封，公司年会抽奖抽中的。一直用苹果全家桶所以打算出掉回血。
                  </p>
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">挂牌价</p>
                    <span className="font-black text-[#4361EE] text-xl">¥ 1,450</span>
                  </div>
                  
                  {/* 滑动意向操作按钮：红色极具警告感的违规下架与绿色通过 */}
                  <div className="flex gap-2">
                    <button 
                      className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(244,63,94,0.3)]"
                      title="判定违规并拒绝"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button 
                      className="w-11 h-11 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)]"
                      title="审核通过并上架"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* 审核卡片 2 */}
            <article className="glass-card rounded-[2rem] p-4 flex gap-5 group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-200 shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-orange-50 group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                  文学角落
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1">
                    全套哈利波特绝版精装
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    人民文学出版社第一版，保存完好没有缺页，内页微微泛黄很有年代感。
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">挂牌价</p>
                    <span className="font-black text-[#4361EE] text-xl">¥ 3,200</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(244,63,94,0.3)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button className="w-11 h-11 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </main>

      </div>
    </div>
  );
}
