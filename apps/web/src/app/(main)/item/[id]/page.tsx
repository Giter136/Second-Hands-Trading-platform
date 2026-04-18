import React from 'react';

export default function ItemDetail({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 animate-fade-up delay-100">
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* 左侧：画廊画框区 */}
        <div className="flex-1">
          <div className="glass-card rounded-[2rem] p-4 aspect-[4/3] w-full relative overflow-hidden group">
            {/* 这个位置实际上是商品大图，这里做高保真占位 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/80 backdrop-blur text-[#4361EE] px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
                全新未拆
              </span>
              <span className="bg-white/80 backdrop-blur text-slate-700 px-4 py-1.5 rounded-full text-sm shadow-sm">
                数码极客
              </span>
            </div>
            
            {/* 浮动分页圆点占位 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 transition-all" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-all cursor-pointer shadow-sm" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-all cursor-pointer shadow-sm" />
            </div>
          </div>
        </div>

        {/* 右侧：商品信息及详情面板 */}
        <div className="w-full lg:w-[480px] flex flex-col pt-4">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">
              Fujifilm X100V 纯净黑 <br />带真皮半套
            </h1>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-purple-600">
              ¥ 8,600
            </span>
          </div>

          <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-bl from-[#10B981] to-emerald-300 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                Z
              </div>
              <div>
                <p className="font-bold text-slate-900">ZeroCoder</p>
                <p className="text-sm text-slate-500">深圳 · 发布于 2 小时前</p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12">
            <p>
              成色完美无暇，仅在室内棚拍使用过两次，快门数不到 200。因为准备升级中画幅所以割爱。
            </p>
            <p>
              原装配件（包装盒、肩带、充电线、说明书）全套都在且未使用。额外赠送买的原厂遮光罩和皮质半套（由于本人保护极好，一点磕碰都没有）。
            </p>
            <p>
              只支持深圳线下面交，不接受外地邮寄。非诚勿扰呀～
            </p>
          </div>

          {/* 底部悬浮动作栏 (常驻CTA) */}
          <div className="sticky bottom-6 mt-auto">
            <div className="glass-panel p-3 rounded-full flex items-center justify-between shadow-[0_12px_40px_rgb(67,97,238,0.15)] ring-1 ring-white/60">
              <div className="pl-4">
                <p className="text-sm font-bold text-slate-500">闲置一口价</p>
                <p className="text-xl font-black text-slate-900">¥ 8,600</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#4361EE] hover:-translate-y-1 transition-all duration-300 ease-out">
                发起沟通
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
