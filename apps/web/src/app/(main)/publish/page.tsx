'use client';

import React, { useState, useRef } from 'react';
import { uploadService } from '../../../services/upload.service';
import { itemService } from '../../../services/item.service';
import { useRouter } from 'next/navigation';

export default function PublishPage() {
  const router = useRouter();
  
  // 表单状态
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('数码极客');
  const [conditionLevel, setConditionLevel] = useState(1); // 1-全新 2-99新 3-9成新 4-轻微使用
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');

  // 状态与校验
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片选择与分片上传
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 9) {
      setErrorMsg('最多只能上传 9 张图片');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const uploadPromises = Array.from(files).map(file => uploadService.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.url);
      setImages(prev => [...prev, ...newUrls]);
    } catch (err: any) {
      setErrorMsg(err.message || '图片上传失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // 重置文件选择器
      }
    }
  };

  // 移除某张缩略图
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 提交并封装发布接口逻辑
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) {
      setErrorMsg('请至少上传 1 张商品图片以充分展示物品');
      return;
    }
    if (!title || !description || !price || !city) {
      setErrorMsg('由于展示需要，请完整填写商品的基础信息和价格以及所在城市');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await itemService.publishItem({
        title,
        category,
        conditionLevel: Number(conditionLevel),
        price: Number(price),
        description,
        city,
        imageUrls: images
      });
      
      // 成功发布，跳转到主页查收结果
      router.push('/');
      router.refresh();
    } catch (err: any) {
      // 抛出后端刚刚修复通过 data 解析传过来的 422 及其他相关 message
      setErrorMsg(err.message || '发布失败或资料校验错误，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-10 animate-fade-up">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">发布你的闲置</h1>
        <p className="text-slate-500 font-medium">让物品在流转中发挥它新的价值</p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        
        {/* 背景光效 */}
        <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-[#4361EE]/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
          
          {/* 第1步：真实可用多图分片上传区 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center text-xs shadow-sm">1</span> 
              上传有故事的照片
            </h2>
            
            <div className="flex flex-wrap gap-4 mb-2">
              {/* 图片预览 */}
              {images.map((url, index) => (
                <div key={index} className="w-24 h-24 rounded-2xl overflow-hidden relative group border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`http://localhost:8000${url}`} alt={`预览 ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="移除"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              
              {/* 隐藏的真实上传输入口 + 激活按钮体 */}
              {images.length < 9 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-50 hover:border-[#4361EE]/50 transition-colors cursor-pointer group"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="text-xs font-bold text-[#4361EE] animate-pulse whitespace-nowrap">上传中...</div>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-white shadow-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {images.length === 0 ? (
               <p className="text-xs text-slate-400 mt-2">支持常见图片格式，首张图片将作为瀑布流封面，最多支持9张</p>
            ) : (
               <p className="text-xs text-[#10B981] mt-2 font-bold">已就绪 {images.length}/9 张</p>
            )}
          </section>

          <hr className="border-slate-200" />

          {/* 第2步：内容说明表单双向绑定 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs shadow-sm">2</span> 
              给它起个响亮的名字
            </h2>
            
            <div className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入商品标题（如：全新未拆封的 AirPods Pro 2）"
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-200 pb-3 focus:outline-none focus:border-[#4361EE] transition-colors placeholder:font-normal placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-2">
                  <span className="pl-4 text-sm font-bold text-slate-500 whitespace-nowrap">分类</span>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="flex-1 bg-transparent py-3 pr-4 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                    <option value="数码极客">数码极客</option>
                    <option value="书籍名著">书籍名著</option>
                    <option value="生活家居">生活家居</option>
                    <option value="服饰穿搭">服饰穿搭</option>
                  </select>
                </div>
                <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-2">
                  <span className="pl-4 text-sm font-bold text-slate-500 whitespace-nowrap">成色</span>
                  <select value={conditionLevel} onChange={e => setConditionLevel(Number(e.target.value))} className="flex-1 bg-transparent py-3 pr-4 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                    <option value={1}>全新</option>
                    <option value={2}>99新</option>
                    <option value={3}>9成新</option>
                    <option value={4}>轻微使用</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-4xl font-black pl-12 py-4 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-[#4361EE] transition-colors text-slate-900 placeholder:text-slate-200"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="所在城市（如：杭州）"
                  className="w-full p-4 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#4361EE]/20 outline-none transition-all font-bold text-center"
                />
              </div>
            </div>
          </section>

          {/* 红色错误提示预留区 */}
          {errorMsg && (
            <div className="flex justify-center mt-2">
              <p className="text-sm font-bold text-rose-500 bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm animate-pulse">
                {errorMsg}
              </p>
            </div>
          )}

          {/* 真·表单提交入口 */}
          <div className="mt-4 flex justify-center">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="bg-[#4361EE] disabled:bg-slate-300 disabled:shadow-none hover:bg-slate-900 text-white font-bold text-lg px-16 py-4 rounded-full shadow-[0_8px_30px_rgba(67,97,238,0.3)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {loading ? '正在与后端对接...' : '点亮并发布'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
