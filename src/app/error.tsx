'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      <div className="modern-card p-8 text-center max-w-md w-full border-rose-500/30">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold mb-2">Đã Có Lỗi Xảy Ra</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {error.message || 'Có sự cố nhỏ về kết nối, bấm Thử lại bên dưới để làm mới.'}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Thử Lại Trải Nghiệm</span>
        </button>
      </div>
    </div>
  );
}
