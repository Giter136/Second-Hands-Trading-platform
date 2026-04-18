import React from 'react';

export default function PublishPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-10 animate-fade-up">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">发布你的闲置</h1>
        <p className="text-slate-500 font-medium">让物品在流转中发挥它新的价值</p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        
        {/* 背景光效 */}
        <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-[#4361EE]/10 rounded-full blur-3xl" />

        <form className="relative z-10 flex flex-col gap-8">
          
          {/* 第1步：视觉化上传区域 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center text-xs shadow-sm">1</span> 
              上传有故事的照片
            </h2>
            <div className="w-full aspect-[21/9] border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-50 hover:border-[#4361EE]/50 transition-colors cursor-pointer group">
              <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-bold text-slate-600">点击上传或将图片拖拽至此</p>
              <p className="text-xs text-slate-400 mt-1">支持 PNG, JPG 格式，最多 9 张</p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* 第2步：内容说明表单 - 无感流线化设计 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs shadow-sm">2</span> 
              给它起个响亮的名字
            </h2>
            
            <div className="space-y-6">
              <div>
                <input 
                  type="text" 
                  placeholder="请输入商品标题（如：全新未拆封的 AirPods Pro 2）"
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-200 pb-3 focus:outline-none focus:border-[#4361EE] transition-colors placeholder:font-normal placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-2">
                  <span className="pl-4 text-sm font-bold text-slate-500 whitespace-nowrap">分类</span>
                  <select className="flex-1 bg-transparent py-3 pr-4 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                    <option>数码极客</option>
                    <option>书籍名著</option>
                    <option>生活家居</option>
                  </select>
                </div>
                <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-2">
                  <span className="pl-4 text-sm font-bold text-slate-500 whitespace-nowrap">成色</span>
                  <select className="flex-1 bg-transparent py-3 pr-4 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                    <option>全新</option>
                    <option>99新</option>
                    <option>9成新</option>
                    <option>轻微使用</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea 
                  rows={4}
                  placeholder="详细描述物品的来源、使用体验和瑕疵说明..."
                  className="w-full p-6 bg-slate-50 rounded-3xl outline-none focus:ring-2 focus:ring-[#4361EE]/20 transition-all resize-none text-slate-700"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* 第3步：定价与城市 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-sm">3</span> 
              最终挂牌价
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-end">
              <div className="flex-1 w-full relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">¥</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full text-4xl font-black pl-12 py-4 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-[#4361EE] transition-colors text-slate-900 placeholder:text-slate-200"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <input 
                  type="text"
                  placeholder="所在城市（如：杭州）"
                  className="w-full p-4 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#4361EE]/20 outline-none transition-all font-bold text-center"
                />
              </div>
            </div>
          </section>

          {/* 确认提交 */}
          <div className="mt-8 flex justify-center">
            <button type="button" className="bg-[#4361EE] hover:bg-slate-900 text-white font-bold text-lg px-16 py-4 rounded-full shadow-[0_8px_30px_rgba(67,97,238,0.3)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              点亮并发布
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
