'use client';

import { RefreshCw, AlertOctagon } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex items-center justify-center p-4 bg-[#090D16] text-slate-100 font-sans">
        <div className="modern-card p-8 text-center max-w-md w-full border-rose-500/30">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto mb-4">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold mb-2">Lỗi Hệ Thống Trống</h2>
          <p className="text-xs text-slate-400 mb-6">
            Hãy tải lại trang để tiếp tục hành trình nỗ lực tốt hơn mỗi ngày.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tải Lại Ứng Dụng</span>
          </button>
        </div>
      </body>
    </html>
  );
}
