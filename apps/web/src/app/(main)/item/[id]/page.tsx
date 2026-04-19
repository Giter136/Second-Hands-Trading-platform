'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { itemService } from '../../../../services/item.service';
import type { Item } from '../../../../types/models';

function getAssetUrl(url: string | undefined): string {
  if (!url) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="%23e2e8f0"/></svg>';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const host = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
}

function statusText(status: number): string {
  if (status === 1) {
    return '在售';
  }
  if (status === 2) {
    return '交易中';
  }
  if (status === 3) {
    return '已售出';
  }
  if (status === 4) {
    return '已下架';
  }
  return '审核中';
}

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const itemId = useMemo(() => Number(params?.id), [params]);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDetail() {
      if (!itemId || Number.isNaN(itemId)) {
        setError('商品 ID 无效');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const data = await itemService.getItemDetail(itemId);
        if (!mounted) {
          return;
        }
        setItem(data);
      } catch (err: unknown) {
        if (!mounted) {
          return;
        }
        if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError('加载商品详情失败');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  if (loading) {
    return <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 text-slate-500">正在加载商品详情...</div>;
  }

  if (error || !item) {
    return <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 text-rose-500">{error || '商品不存在'}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 animate-fade-up delay-100">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="glass-card rounded-[2rem] p-4 aspect-[4/3] w-full relative overflow-hidden group">
            <img
              src={getAssetUrl(item.images?.[0]?.imageUrl)}
              alt={item.title}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/80 backdrop-blur text-[#4361EE] px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
                {statusText(item.status)}
              </span>
              <span className="bg-white/80 backdrop-blur text-slate-700 px-4 py-1.5 rounded-full text-sm shadow-sm">
                {item.category}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[480px] flex flex-col pt-4">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">{item.title}</h1>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-purple-600">
              ¥ {item.price}
            </span>
          </div>

          <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col gap-2">
            <p className="font-bold text-slate-900">城市：{item.city}</p>
            <p className="text-sm text-slate-500">商品状态：{statusText(item.status)}</p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12">
            <p>{item.description}</p>
          </div>

          <div className="sticky bottom-6 mt-auto">
            <div className="glass-panel p-3 rounded-full flex items-center justify-between shadow-[0_12px_40px_rgb(67,97,238,0.15)] ring-1 ring-white/60">
              <div className="pl-4">
                <p className="text-sm font-bold text-slate-500">闲置一口价</p>
                <p className="text-xl font-black text-slate-900">¥ {item.price}</p>
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
