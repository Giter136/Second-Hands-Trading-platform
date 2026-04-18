import React from 'react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
      
      {/* 顶部标题区 (Hero Section) */}
      <section className="mb-12 text-center mt-6 animate-fade-up delay-100">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900 drop-shadow-sm">
          发现角落的<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#10B981]">无价之宝</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
          极简、纯粹，让闲置物品像云般轻盈流转。开启你的一见钟情之旅。
        </p>
      </section>

      {/* 分类筛选区 (Pill Filters) */}
      <section className="mb-12 flex justify-center animate-fade-up delay-200">
        <div className="glass-panel rounded-full inline-flex p-1.5 gap-1 overflow-x-auto max-w-full">
          {['全部精选', '数码极客', '文学角落', '生活家居', '穿搭潮流'].map((tag, idx) => (
            <button 
              key={idx}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                idx === 0 
                  ? 'bg-white shadow-sm text-[#4361EE]' 
                  : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 不规则卡片流网格 (Bento / Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up delay-300">
        
        {/* 示例商品卡片 1 - 带有强烈的悬停反馈 */}
        <article className="glass-card rounded-3xl group cursor-pointer flex flex-col relative">
          <div className="p-2">
            <div className="w-full aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden relative">
              {/* 图片占位渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-emerald-50 group-hover:scale-105 transition-transform duration-700 ease-out" />
              {/* 轻量的Tag浮层 */}
              <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#4361EE] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                几乎全新
              </span>
            </div>
          </div>
          <div className="px-5 pb-6 pt-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg leading-tight mb-1 text-slate-800 group-hover:text-[#4361EE] transition-colors">
              Fujifilm X100V 相机
            </h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-1">
              深圳 · 保护极好，带原装肩带
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-black text-xl text-slate-900">¥ 8,600</span>
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4361EE] group-hover:text-white transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* 示例商品卡片 2 - 模拟错落高度 (设置不同的 aspect ratio) */}
        <article className="glass-card rounded-3xl group cursor-pointer flex flex-col relative lg:translate-y-8">
          <div className="p-2">
            <div className="w-full aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 via-orange-50 to-rose-50 group-hover:scale-105 transition-transform duration-700 ease-out" />
              <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#10B981] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                轻微使用
              </span>
            </div>
          </div>
          <div className="px-5 pb-6 pt-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg leading-tight mb-1 text-slate-800 group-hover:text-[#4361EE] transition-colors">
              《设计心理学》四册全
            </h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-1">
              杭州 · 页面完好，无折痕
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-black text-xl text-slate-900">¥ 120</span>
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4361EE] group-hover:text-white transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* 示例商品卡片 3 */}
        <article className="glass-card rounded-3xl group cursor-pointer flex flex-col relative">
          <div className="p-2">
            <div className="w-full aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 group-hover:scale-105 transition-transform duration-700 ease-out" />
              <span className="absolute top-4 left-4 bg-[#0F172A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                全新未拆
              </span>
            </div>
          </div>
          <div className="px-5 pb-6 pt-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg leading-tight mb-1 text-slate-800 group-hover:text-[#4361EE] transition-colors">
              Herman Miller 办公椅
            </h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-1">
              上海 · 年会抽奖奖品闲置
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-black text-xl text-slate-900">¥ 4,500</span>
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4361EE] group-hover:text-white transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </article>

      </section>

      {/* 底部悬浮的超级发布按钮 (CTA) */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-up delay-300">
        <button className="flex items-center gap-2 bg-[#10B981] hover:bg-[#0EA5E9] text-white px-6 py-4 rounded-full font-bold shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] transition-all duration-500 hover:-translate-y-2 group">
          <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-wide">卖闲置</span>
        </button>
      </div>

    </div>
  );
}
