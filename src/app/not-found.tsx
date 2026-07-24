'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      <div className="modern-card p-8 text-center max-w-md w-full">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">404 - Trang Không Tồn Tại</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
