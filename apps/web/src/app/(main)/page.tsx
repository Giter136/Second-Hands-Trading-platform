'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import { itemService } from '../../services/item.service';
import type { Item } from '../../types/models';

const CATEGORY_TABS = [
  { label: '全部精选', value: 'all' },
  { label: '数码极客', value: 'digital' },
  { label: '文学角落', value: 'books' },
  { label: '生活家居', value: 'home' },
  { label: '穿搭潮流', value: 'fashion' },
];

function getAssetUrl(url: string | undefined): string {
  if (!url) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="%23e2e8f0"/></svg>';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const host = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryParam = useMemo(() => {
    return activeCategory === 'all' ? undefined : activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      setLoading(true);
      setError('');
      try {
        const result = await itemService.getItems({ category: categoryParam, page: 1, size: 20 });
        if (!mounted) {
          return;
        }
        setItems(result.items || []);
      } catch (err: unknown) {
        if (!mounted) {
          return;
        }
        if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError('加载商品失败，请稍后重试');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadItems();
    return () => {
      mounted = false;
    };
  }, [categoryParam]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
      <section className="mb-12 text-center mt-6 animate-fade-up delay-100">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900 drop-shadow-sm">
          发现角落的<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#10B981]">无价之宝</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
          极简、纯粹，让闲置物品像云般轻盈流转。开启你的一见钟情之旅。
        </p>
      </section>

      <section className="mb-12 flex justify-center animate-fade-up delay-200">
        <div className="glass-panel rounded-full inline-flex p-1.5 gap-1 overflow-x-auto max-w-full">
          {CATEGORY_TABS.map((tab) => {
            const active = tab.value === activeCategory;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  active ? 'bg-white shadow-sm text-[#4361EE]' : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {loading && <p className="text-center text-slate-500 font-medium">正在加载商品...</p>}
      {!loading && error && <p className="text-center text-rose-500 font-medium">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="glass-panel rounded-3xl px-6 py-16 text-center text-slate-500 font-medium">
          当前分类暂无商品，试试切换其他分类。
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up delay-300">
          {items.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`} className="block">
              <article className="glass-card rounded-3xl group cursor-pointer flex flex-col relative h-full">
                <div className="p-2">
                  <div className="w-full aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden relative">
                    <img
                      src={getAssetUrl(item.images?.[0]?.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#4361EE] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {item.status === 1 ? '在售' : '非在售'}
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-6 pt-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight mb-1 text-slate-800 group-hover:text-[#4361EE] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-1">{item.city} · {item.category}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-black text-xl text-slate-900">¥ {item.price}</span>
                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4361EE] group-hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      <div className="fixed bottom-8 right-8 z-50 animate-fade-up delay-300">
        <Link
          href="/publish"
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#0EA5E9] text-white px-6 py-4 rounded-full font-bold shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] transition-all duration-500 hover:-translate-y-2 group"
        >
          <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-wide">卖闲置</span>
        </Link>
      </div>
    </div>
  );
}
